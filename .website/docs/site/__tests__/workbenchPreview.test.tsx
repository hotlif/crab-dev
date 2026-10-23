import { describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, render, screen } from "@crab-dev/wake/test/react";
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
    const { design, theme } = useConfig();
    return <output aria-label={name}>{design}/{theme}</output>;
}

async function sendConfiguration(source: object, origin: string, design: string, theme = "dark") {
    await act(async () => {
        const event = new Event("message");
        Object.defineProperties(event, {
            source: { value: source },
            origin: { value: origin },
            data: { value: { type: "crab:preview-config", design, theme } },
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
    it("父页面消息更新实际 Provider、嵌套继承与 Portal，并保留显式设计覆盖", async () => {
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const { unmount } = await render(
            <WorkbenchPreview>
                <ConfigurationProbe name="demo" />
                <ConfigProvider><ConfigurationProbe name="nested" /></ConfigProvider>
                <ConfigProvider design="material" theme="light"><ConfigurationProbe name="explicit" /></ConfigProvider>
                {createPortal(<ConfigProvider><ConfigurationProbe name="portal" /></ConfigProvider>, document.body)}
            </WorkbenchPreview>,
        );
        try {
            await act(async () => {
                window.postMessage({ type: "crab:preview-config", design: "shadcn", theme: "dark" }, window.location.origin);
                await new Promise<void>(resolve => { window.setTimeout(resolve, 0); });
            });
            expect(screen.getByLabelText("demo").textContent).toBe("shadcn/dark");
            expect(screen.getByLabelText("nested").textContent).toBe("shadcn/dark");
            const portal = screen.getByLabelText("portal");
            expect(portal.textContent).toBe("shadcn/dark");
            expect(portal.parentElement?.dataset.crabDesign).toBe("shadcn");
            expect(screen.getByLabelText("explicit").textContent).toBe("material/light");
            await sendConfiguration(window.parent, window.location.origin, "macos");
            expect(screen.getByLabelText("demo").textContent).toBe("macos/dark");
            expect(screen.getByLabelText("nested").textContent).toBe("macos/dark");
            expect(portal.textContent).toBe("macos/dark");
            expect(portal.parentElement?.dataset.crabDesign).toBe("macos");
            expect(screen.getByLabelText("explicit").textContent).toBe("material/light");
            await sendConfiguration(window.parent, window.location.origin, "material", "light");
            expect(screen.getByLabelText("demo").textContent).toBe("material/light");
            expect(portal.textContent).toBe("material/light");
            expect(portal.parentElement?.dataset.crabDesign).toBe("material");
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
            expect(screen.getByLabelText("demo").textContent).toBe("macos/dark");
            const stage = container.querySelector(".demo-frame-root");
            expect(stage?.getAttribute("data-crab-design")).toBe("macos");
            expect(stage?.getAttribute("data-theme")).toBe("dark");
            await act(async () => { document.documentElement.dataset.theme = "light"; });
            expect(screen.getByLabelText("demo").textContent).toBe("macos/light");
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
        window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, "material");
        expect(window.localStorage.getItem(SITE_DESIGN_STORAGE_KEY)).toBe("material");
        expect(window.parent === window).toBe(true);
        const { unmount } = await render(<WorkbenchPreview><ConfigurationProbe name="demo" /></WorkbenchPreview>);
        try {
            expect(screen.getByLabelText("demo").textContent?.startsWith("material/")).toBe(true);
            await sendStoredDesign("shadcn", "unrelated-preference");
            expect(screen.getByLabelText("demo").textContent?.startsWith("material/")).toBe(true);
            await sendStoredDesign("shadcn");
            expect(screen.getByLabelText("demo").textContent?.startsWith("shadcn/")).toBe(true);
            expect(document.documentElement.dataset.crabDesign).toBe("shadcn");
            await sendStoredDesign("material");
            expect(screen.getByLabelText("demo").textContent?.startsWith("material/")).toBe(true);
            await sendStoredDesign("macos");
            expect(screen.getByLabelText("demo").textContent?.startsWith("macos/")).toBe(true);
            await sendStoredDesign(null, null);
            expect(screen.getByLabelText("demo").textContent?.startsWith("macos/")).toBe(true);
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
        window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, "material");
        Object.defineProperty(window, "parent", { configurable: true, value: parentWindow });
        let unmount: (() => Promise<void>) | undefined;
        try {
            const rendered = await render(<div className="demo-frame-root" data-theme="light">
                <WorkbenchPreview><ConfigurationProbe name="demo" /></WorkbenchPreview>
            </div>);
            unmount = rendered.unmount;
            const stage = rendered.container.querySelector(".demo-frame-root");
            expect(screen.getByLabelText("demo").textContent?.startsWith("material/")).toBe(true);
            expect(document.documentElement.dataset.crabDesign).toBe("material");
            expect(stage?.getAttribute("data-crab-design")).toBe("material");
            await sendStoredDesign("shadcn");
            expect(screen.getByLabelText("demo").textContent?.startsWith("shadcn/")).toBe(true);
            expect(stage?.getAttribute("data-crab-design")).toBe("shadcn");
            await sendConfiguration(parentWindow, window.location.origin, "macos", "dark");
            await sendStoredDesign("material");
            await sendStoredDesign("light", "wake-docs-theme");
            expect(screen.getByLabelText("demo").textContent).toBe("macos/dark");
            expect(document.documentElement.dataset.crabDesign).toBe("macos");
            expect(stage?.getAttribute("data-crab-design")).toBe("macos");
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
