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
        const { unmount } = await render(<WorkbenchPreview><ConfigurationProbe name="demo" /></WorkbenchPreview>);
        try {
            await act(async () => { document.documentElement.dataset.theme = "dark"; });
            expect(screen.getByLabelText("demo").textContent).toBe("shadcn/dark");
            await act(async () => { document.documentElement.dataset.theme = "light"; });
            expect(screen.getByLabelText("demo").textContent).toBe("shadcn/light");
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
            await sendStoredDesign(null, null);
            expect(screen.getByLabelText("demo").textContent?.startsWith("shadcn/")).toBe(true);
        } finally {
            await unmount();
            if (savedDesign === null) window.localStorage.removeItem(SITE_DESIGN_STORAGE_KEY);
            else window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, savedDesign);
            if (originalDesign === null) document.documentElement.removeAttribute("data-crab-design");
            else document.documentElement.setAttribute("data-crab-design", originalDesign);
            restoreWindow();
        }
    });

    it("嵌入演示由父配置控制，存储偏好和其他标签页不会覆盖父配置", async () => {
        const descriptor = Object.getOwnPropertyDescriptor(window, "parent");
        const originalDesign = document.documentElement.getAttribute("data-crab-design");
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const savedDesign = window.localStorage.getItem(SITE_DESIGN_STORAGE_KEY);
        const parentWindow = { postMessage: mock.fn() };
        window.localStorage.setItem(SITE_DESIGN_STORAGE_KEY, "material");
        Object.defineProperty(window, "parent", { configurable: true, value: parentWindow });
        let unmount: (() => Promise<void>) | undefined;
        try {
            ({ unmount } = await render(<WorkbenchPreview><ConfigurationProbe name="demo" /></WorkbenchPreview>));
            expect(screen.getByLabelText("demo").textContent?.startsWith("shadcn/")).toBe(true);
            await sendConfiguration(parentWindow, window.location.origin, "material", "light");
            await sendStoredDesign("shadcn");
            expect(screen.getByLabelText("demo").textContent).toBe("material/light");
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
