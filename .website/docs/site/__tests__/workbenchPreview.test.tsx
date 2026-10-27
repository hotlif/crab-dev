import { describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import ConfigProvider, { useConfig } from "@crab-dev/rc-config-provider";
import { createPortal } from "react-dom";
import WorkbenchPreview from "../workbenchPreview.js";
import { SITE_DESIGN_STORAGE_KEY } from "../siteContext.js";

function standaloneWindow() {
    const parentDescriptor = Object.getOwnPropertyDescriptor(window, "parent");
    // Wake's DOM gives the host a separate parent proxy. Establish the actual
    // browser standalone relationship; embedded cases replace it explicitly.
    Object.defineProperty(window, "parent", { configurable: true, value: window });
    return () => {
        if (parentDescriptor) Object.defineProperty(window, "parent", parentDescriptor);
        else Reflect.deleteProperty(window, "parent");
    };
}

function ConfigurationProbe({ name }: { readonly name: string }) {
    const { designSystem: design, colorMode: theme } = useConfig();
    return <output aria-label={name}>{design}/{theme}</output>;
}

function FullConfigurationProbe({ name }: { readonly name: string }) {
    const { designSystem, colorMode, size, density, locale, direction } = useConfig();
    return <output aria-label={name}>{designSystem}/{colorMode}/{size}/{density}/{locale}/{direction}</output>;
}

function BrandConfigurationProbe({ name }: { readonly name: string }) {
    const { brandColor, nonce } = useConfig();
    return <output aria-label={name}>{JSON.stringify({ brandColor, nonce })}</output>;
}

async function sendConfiguration(source: object, origin: string, design: string, theme = "dark", axes: Readonly<Record<string, unknown>> = {}) {
    await act(async () => {
        const event = new Event("message");
        Object.defineProperties(event, {
            source: { value: source },
            origin: { value: origin },
            data: { value: { type: "crab:preview-config", designSystem: design, colorMode: theme, ...axes } },
        });
        window.dispatchEvent(event);
    });
}

async function sendStoredDesign(value: string | null, key: string | null = SITE_DESIGN_STORAGE_KEY) {
    await act(async () => {
        const event = new Event("storage");
        Object.defineProperties(event, {
            key: { value: key },
            newValue: { value },
        });
        window.dispatchEvent(event);
    });
}

describe("WorkbenchPreview", () => {
    it("自定义预览类保留共享边界类，默认或显式重复时只出现一次", async () => {
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const { unmount } = await render(<>
            <WorkbenchPreview className="rc-button-console-preview"><ConfigurationProbe name="custom-class" /></WorkbenchPreview>
            <WorkbenchPreview><ConfigurationProbe name="default-class" /></WorkbenchPreview>
            <WorkbenchPreview className="demo-default-preview rc-button-console-preview demo-default-preview"><ConfigurationProbe name="repeated-class" /></WorkbenchPreview>
        </>);
        try {
            for (const name of ["custom-class", "default-class", "repeated-class"]) {
                const classes = screen.getByLabelText(name).parentElement?.className.split(/\s+/) ?? [];
                expect(classes.filter(value => value === "demo-default-preview").length).toBe(1);
                if (name !== "default-class") expect(classes.includes("rc-button-console-preview")).toBe(true);
            }
        } finally {
            await unmount();
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
        }
    });

    it("六轴消息进入真实配置、嵌套边界和 Portal，旧消息保留其他轴且不重建示例", async () => {
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const { unmount } = await render(<WorkbenchPreview>
            <FullConfigurationProbe name="all-axes" />
            <input aria-label="preserved-input" defaultValue="draft" />
            <ConfigProvider><FullConfigurationProbe name="nested-axes" /></ConfigProvider>
            <ConfigProvider size="small" density="comfortable" locale="zh-CN" direction="ltr"><FullConfigurationProbe name="explicit-axes" /></ConfigProvider>
            {createPortal(<ConfigProvider><FullConfigurationProbe name="portal-axes" /></ConfigProvider>, document.body)}
        </WorkbenchPreview>);
        try {
            const input = screen.getByLabelText("preserved-input");
            const initial = screen.getByLabelText("all-axes");
            expect(initial.textContent?.endsWith("/medium/standard/zh-CN/ltr")).toBe(true);
            await sendConfiguration(window.parent, window.location.origin, "apple", "dark", { size: "large", density: "compact", locale: "en-US", direction: "rtl" });
            for (const name of ["all-axes", "nested-axes", "portal-axes"]) {
                const probe = screen.getByLabelText(name);
                expect(probe.textContent).toBe("apple/dark/large/compact/en-US/rtl");
                const boundary = probe.parentElement;
                expect(boundary?.getAttribute("data-crab-size")).toBe("large");
                expect(boundary?.getAttribute("data-crab-density")).toBe("compact");
                expect(boundary?.getAttribute("lang")).toBe("en-US");
                expect(boundary?.getAttribute("dir")).toBe("rtl");
            }
            expect(screen.getByLabelText("explicit-axes").textContent).toBe("apple/dark/small/comfortable/zh-CN/ltr");
            await sendConfiguration(window.parent, window.location.origin, "shadcn", "light");
            expect(initial.textContent).toBe("shadcn/light/large/compact/en-US/rtl");
            expect(screen.getByLabelText("portal-axes").textContent).toBe("shadcn/light/large/compact/en-US/rtl");
            expect(screen.getByLabelText("preserved-input")).toBe(input);
            await sendConfiguration(window.parent, window.location.origin, "md3", "light", { size: "small", density: "comfortable", locale: "zh-CN", direction: "ltr" });
            expect(initial.textContent).toBe("md3/light/small/comfortable/zh-CN/ltr");
            await sendConfiguration(window.parent, window.location.origin, "md3", "light", { size: "medium", density: "standard" });
            expect(initial.textContent).toBe("md3/light/medium/standard/zh-CN/ltr");
        } finally {
            await unmount();
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
        }
    });

    it("品牌与 nonce 接入实际 Provider、嵌套边界和 Portal，保留局部消息与草稿", async () => {
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const { unmount } = await render(<WorkbenchPreview>
            <BrandConfigurationProbe name="brand-axes" />
            <input aria-label="brand-draft" defaultValue="draft" />
            <ConfigProvider><BrandConfigurationProbe name="nested-brand-axes" /></ConfigProvider>
            <ConfigProvider brandColor={null} nonce="own-nonce"><BrandConfigurationProbe name="explicit-brand-axes" /></ConfigProvider>
            {createPortal(<ConfigProvider><BrandConfigurationProbe name="portal-brand-axes" /></ConfigProvider>, document.body)}
        </WorkbenchPreview>);
        try {
            const probe = screen.getByLabelText("brand-axes");
            const input = screen.getByLabelText("brand-draft");
            if (!(input instanceof HTMLInputElement)) throw new Error("草稿应为输入框");
            await fireEvent.change(input, { target: { value: "edited draft" } });
            await sendConfiguration(window.parent, window.location.origin, "apple", "dark", {
                size: "large", density: "compact", locale: "en-US", direction: "rtl", brandColor: "#AbC", nonce: "preview-nonce",
            });
            for (const name of ["brand-axes", "nested-brand-axes", "portal-brand-axes"]) {
                const output = screen.getByLabelText(name);
                expect(output.textContent).toBe(JSON.stringify({ brandColor: "#aabbcc", nonce: "preview-nonce" }));
                expect(output.parentElement?.querySelector("style[data-crab-brand-style]")?.getAttribute("nonce")).toBe("preview-nonce");
            }
            expect(screen.getByLabelText("explicit-brand-axes").textContent).toBe(JSON.stringify({ brandColor: null, nonce: "own-nonce" }));

            // A change confined to these fields must not be swallowed by the
            // equality check for the other six configuration fields.
            await sendConfiguration(window.parent, window.location.origin, "apple", "dark", { brandColor: "#123456", nonce: "next-nonce" });
            expect(probe.textContent).toBe(JSON.stringify({ brandColor: "#123456", nonce: "next-nonce" }));
            await sendConfiguration(window.parent, window.location.origin, "shadcn", "light");
            expect(probe.textContent).toBe(JSON.stringify({ brandColor: "#123456", nonce: "next-nonce" }));

            await sendConfiguration(window.parent, window.location.origin, "shadcn", "light", { brandColor: null, nonce: undefined });
            for (const name of ["brand-axes", "nested-brand-axes", "portal-brand-axes"]) {
                const output = screen.getByLabelText(name);
                expect(output.textContent).toBe(JSON.stringify({ brandColor: null }));
                expect(output.parentElement?.querySelector("style[data-crab-brand-style]")).toBeNull();
            }
            await sendConfiguration(window.parent, window.location.origin, "shadcn", "light", { nonce: "" });
            expect(probe.textContent).toBe(JSON.stringify({ brandColor: null, nonce: "" }));
            expect(screen.getByLabelText("brand-draft")).toBe(input);
            expect(input.value).toBe("edited draft");
            expect(screen.getByLabelText("brand-axes")).toBe(probe);

            // A Wake document mutation cannot override a controlled inner
            // Provider. Only the next validated parent snapshot changes it.
            await act(async () => { document.documentElement.dataset.theme = "dark"; });
            expect(probe.parentElement?.getAttribute("data-theme")).toBe("light");
        } finally {
            await unmount();
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
        }
    });

    it("未接收品牌和 nonce 时继承最近同根边界，显式 undefined 移除局部覆盖而 null 复位品牌", async () => {
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const { unmount } = await render(<ConfigProvider brandColor="#2468ac" nonce="outer-nonce">
            <WorkbenchPreview><BrandConfigurationProbe name="inherited-brand-axes" /></WorkbenchPreview>
        </ConfigProvider>);
        try {
            const probe = screen.getByLabelText("inherited-brand-axes");
            const inherited = JSON.stringify({ brandColor: "#2468ac", nonce: "outer-nonce" });
            expect(probe.textContent).toBe(inherited);
            await sendConfiguration(window.parent, window.location.origin, "apple", "dark", { brandColor: "#123456", nonce: "local-nonce" });
            expect(probe.textContent).toBe(JSON.stringify({ brandColor: "#123456", nonce: "local-nonce" }));
            await sendConfiguration(window.parent, window.location.origin, "apple", "dark", { brandColor: undefined, nonce: undefined });
            expect(probe.textContent).toBe(inherited);
            await sendConfiguration(window.parent, window.location.origin, "apple", "dark", { brandColor: null });
            expect(probe.textContent).toBe(JSON.stringify({ brandColor: null, nonce: "outer-nonce" }));
            expect(probe.parentElement?.querySelector("style[data-crab-brand-style]")).toBeNull();
        } finally {
            await unmount();
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
        }
    });

    it("附加轴无效时拒绝整条消息，不让设计、明暗或其他轴部分更新", async () => {
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const { unmount } = await render(<WorkbenchPreview><FullConfigurationProbe name="all-axes" /></WorkbenchPreview>);
        try {
            await sendConfiguration(window.parent, window.location.origin, "md3", "light");
            const expected = "md3/light/medium/standard/zh-CN/ltr";
            for (const axes of [{ size: "xl" }, { density: "small" }, { locale: "fr-FR" }, { direction: "auto" }, { size: null }, { density: 1 },
                { brandColor: "red" }, { brandColor: "#ggg" }, { brandColor: 1 }, { nonce: null }, { nonce: 1 }]) {
                await sendConfiguration(window.parent, window.location.origin, "apple", "dark", axes);
                expect(screen.getByLabelText("all-axes").textContent).toBe(expected);
                expect(document.documentElement.dataset.crabDesign).toBe("md3");
                expect(document.documentElement.dataset.theme).toBe("light");
            }
            await sendConfiguration({}, window.location.origin, "apple", "dark", { direction: "rtl" });
            await sendConfiguration(window.parent, "https://untrusted.example", "apple", "dark", { locale: "en-US" });
            expect(screen.getByLabelText("all-axes").textContent).toBe(expected);
        } finally {
            await unmount();
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
        }
    });

    it("父页面消息更新实际 Provider、嵌套继承与 Portal，并保留显式设计覆盖", async () => {
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const { unmount } = await render(
            <WorkbenchPreview>
                <ConfigurationProbe name="demo" />
                <ConfigProvider><ConfigurationProbe name="nested" /></ConfigProvider>
                <ConfigProvider designSystem="md3" colorMode="light"><ConfigurationProbe name="explicit" /></ConfigProvider>
                {createPortal(<ConfigProvider><ConfigurationProbe name="portal" /></ConfigProvider>, document.body)}
            </WorkbenchPreview>,
        );
        try {
            await act(async () => {
                window.postMessage({ type: "crab:preview-config", designSystem: "shadcn", colorMode: "dark" }, window.location.origin);
                await new Promise<void>(resolve => { window.setTimeout(resolve, 0); });
            });
            expect(screen.getByLabelText("demo").textContent).toBe("shadcn/dark");
            expect(screen.getByLabelText("nested").textContent).toBe("shadcn/dark");
            const portal = screen.getByLabelText("portal");
            expect(portal.textContent).toBe("shadcn/dark");
            expect(portal.parentElement?.dataset.crabDesign).toBe("shadcn");
            expect(screen.getByLabelText("explicit").textContent).toBe("md3/light");
            await sendConfiguration(window.parent, window.location.origin, "apple");
            expect(screen.getByLabelText("demo").textContent).toBe("apple/dark");
            expect(screen.getByLabelText("nested").textContent).toBe("apple/dark");
            expect(portal.textContent).toBe("apple/dark");
            expect(portal.parentElement?.dataset.crabDesign).toBe("apple");
            expect(screen.getByLabelText("explicit").textContent).toBe("md3/light");
            await sendConfiguration(window.parent, window.location.origin, "md3", "light");
            expect(screen.getByLabelText("demo").textContent).toBe("md3/light");
            expect(portal.textContent).toBe("md3/light");
            expect(portal.parentElement?.dataset.crabDesign).toBe("md3");
        } finally {
            await unmount();
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
        }
    });

    it("拒绝其他来源、跨域和无效设计的配置消息", async () => {
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const { unmount } = await render(<WorkbenchPreview><ConfigurationProbe name="demo" /></WorkbenchPreview>);
        try {
            const initial = screen.getByLabelText("demo").textContent;
            await sendConfiguration({}, window.location.origin, "shadcn");
            await sendConfiguration(window.parent, "https://untrusted.example", "shadcn");
            await sendConfiguration(window.parent, window.location.origin, "unknown");
            await sendConfiguration(window.parent, window.location.origin, "material");
            await sendConfiguration(window.parent, window.location.origin, "macos");
            expect(screen.getByLabelText("demo").textContent).toBe(initial);
        } finally {
            await unmount();
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
        }
    });

    it("监听配置后主动向同源父窗口发送握手", async () => {
        const descriptor = Object.getOwnPropertyDescriptor(window, "parent");
        const postMessage = mock.fn();
        Object.defineProperty(window, "parent", { configurable: true, value: { postMessage } });
        let unmount: (() => Promise<void>) | undefined;
        try {
            ({ unmount } = await render(<WorkbenchPreview><ConfigurationProbe name="demo" /></WorkbenchPreview>));
            expect(postMessage).toHaveBeenCalledWith({ type: "crab:preview-ready" }, window.location.origin);
        } finally {
            await unmount?.();
            if (descriptor) Object.defineProperty(window, "parent", descriptor);
            else Reflect.deleteProperty(window, "parent");
        }
    });

    it("独立工作台继续跟随 Wake 的主题变化，卸载后释放监听", async () => {
        const restoreWindow = standaloneWindow();
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const savedDesign = window.localStorage.getItem(SITE_DESIGN_STORAGE_KEY);
        window.localStorage.removeItem(SITE_DESIGN_STORAGE_KEY);
        const { container, unmount } = await render(<div className="demo-frame-root" data-theme="light">
            <WorkbenchPreview><ConfigurationProbe name="demo" /></WorkbenchPreview>
        </div>);
        try {
            await act(async () => { document.documentElement.dataset.theme = "dark"; });
            expect(screen.getByLabelText("demo").textContent).toBe("md3/dark");
            const stage = container.querySelector(".demo-frame-root");
            expect(stage?.getAttribute("data-crab-design")).toBe("md3");
            expect(stage?.getAttribute("data-theme")).toBe("dark");
            await act(async () => { document.documentElement.dataset.theme = "light"; });
            expect(screen.getByLabelText("demo").textContent).toBe("md3/light");
            expect(stage?.getAttribute("data-theme")).toBe("light");
        } finally {
            await unmount();
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
            if (savedDesign !== null) window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, savedDesign);
            restoreWindow();
        }
    });

    it("独立工作台读取站点设计偏好，并跟随其他标签页的选择与清除", async () => {
        const restoreWindow = standaloneWindow();
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const savedDesign = window.localStorage.getItem(SITE_DESIGN_STORAGE_KEY);
        window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, "md3");
        expect(window.localStorage.getItem(SITE_DESIGN_STORAGE_KEY)).toBe("md3");
        expect(window.parent === window).toBe(true);
        const { unmount } = await render(<WorkbenchPreview><ConfigurationProbe name="demo" /></WorkbenchPreview>);
        try {
            expect(screen.getByLabelText("demo").textContent?.startsWith("md3/")).toBe(true);
            await sendStoredDesign("shadcn", "unrelated-preference");
            expect(screen.getByLabelText("demo").textContent?.startsWith("md3/")).toBe(true);
            await sendStoredDesign("shadcn");
            expect(screen.getByLabelText("demo").textContent?.startsWith("shadcn/")).toBe(true);
            expect(document.documentElement.dataset.crabDesign).toBe("shadcn");
            await sendStoredDesign("md3");
            expect(screen.getByLabelText("demo").textContent?.startsWith("md3/")).toBe(true);
            await sendStoredDesign("apple");
            expect(screen.getByLabelText("demo").textContent?.startsWith("apple/")).toBe(true);
            await sendStoredDesign(null, null);
            expect(screen.getByLabelText("demo").textContent?.startsWith("md3/")).toBe(true);
        } finally {
            await unmount();
            if (savedDesign === null) window.localStorage.removeItem(SITE_DESIGN_STORAGE_KEY);
            else window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, savedDesign);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
            restoreWindow();
        }
    });

    it("独立预览同步其他标签页的明暗选择，并在系统模式跟随系统变化", async () => {
        const restoreWindow = standaloneWindow();
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const savedTheme = window.localStorage.getItem("wake-docs-theme");
        const mediaDescriptor = Object.getOwnPropertyDescriptor(window, "matchMedia");
        const media = Object.assign(new EventTarget(), { matches: true });
        Object.defineProperty(window, "matchMedia", { configurable: true, value: () => media });
        window.localStorage.setItem("wake-docs-theme", "dark");
        let unmount: (() => Promise<void>) | undefined;
        try {
            const rendered = await render(<div className="demo-frame-root" data-theme="dark">
                <WorkbenchPreview><ConfigurationProbe name="demo" /></WorkbenchPreview>
            </div>);
            unmount = rendered.unmount;
            const stage = rendered.container.querySelector(".demo-frame-root");
            expect(screen.getByLabelText("demo").textContent?.endsWith("/dark")).toBe(true);
            await sendStoredDesign("light", "wake-docs-theme");
            expect(document.documentElement.dataset.theme).toBe("light");
            expect(stage?.getAttribute("data-theme")).toBe("light");
            expect(screen.getByLabelText("demo").textContent?.endsWith("/light")).toBe(true);
            await sendStoredDesign("system", "wake-docs-theme");
            expect(screen.getByLabelText("demo").textContent?.endsWith("/dark")).toBe(true);
            await act(() => { media.matches = false; media.dispatchEvent(new Event("change")); });
            expect(screen.getByLabelText("demo").textContent?.endsWith("/light")).toBe(true);
            expect(stage?.getAttribute("data-theme")).toBe("light");
        } finally {
            await unmount?.();
            if (savedTheme === null) window.localStorage.removeItem("wake-docs-theme");
            else window.localStorage.setItem("wake-docs-theme", savedTheme);
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
            if (mediaDescriptor) Object.defineProperty(window, "matchMedia", mediaDescriptor);
            else Reflect.deleteProperty(window, "matchMedia");
            restoreWindow();
        }
    });

    it("工作台内嵌预览也读取设计偏好，文档父配置接管后不再受其他标签页覆盖", async () => {
        const descriptor = Object.getOwnPropertyDescriptor(window, "parent");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const savedDesign = window.localStorage.getItem(SITE_DESIGN_STORAGE_KEY);
        const parentWindow = { postMessage: mock.fn() };
        window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, "md3");
        Object.defineProperty(window, "parent", { configurable: true, value: parentWindow });
        let unmount: (() => Promise<void>) | undefined;
        try {
            const rendered = await render(<div className="demo-frame-root" data-theme="light">
                <WorkbenchPreview><ConfigurationProbe name="demo" /></WorkbenchPreview>
            </div>);
            unmount = rendered.unmount;
            const stage = rendered.container.querySelector(".demo-frame-root");
            expect(screen.getByLabelText("demo").textContent?.startsWith("md3/")).toBe(true);
            expect(document.documentElement.dataset.crabDesign).toBe("md3");
            expect(stage?.getAttribute("data-crab-design")).toBe("md3");
            await sendStoredDesign("shadcn");
            expect(screen.getByLabelText("demo").textContent?.startsWith("shadcn/")).toBe(true);
            expect(stage?.getAttribute("data-crab-design")).toBe("shadcn");
            await sendConfiguration(parentWindow, window.location.origin, "apple", "dark");
            await sendStoredDesign("md3");
            await sendStoredDesign("light", "wake-docs-theme");
            expect(screen.getByLabelText("demo").textContent).toBe("apple/dark");
            expect(document.documentElement.dataset.crabDesign).toBe("apple");
            expect(stage?.getAttribute("data-crab-design")).toBe("apple");
            expect(stage?.getAttribute("data-theme")).toBe("dark");
        } finally {
            await unmount?.();
            if (descriptor) Object.defineProperty(window, "parent", descriptor);
            else Reflect.deleteProperty(window, "parent");
            if (savedDesign === null) window.localStorage.removeItem(SITE_DESIGN_STORAGE_KEY);
            else window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, savedDesign);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
        }
    });
});
