import { clock, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import { useLayoutEffect } from "react";
import type { ReactElement } from "react";
import ConfigProvider from "@crab-dev/rc-config-provider";
import type { ConfigValue } from "@crab-dev/rc-config-provider";
import ComponentDemoFrame, {
    EmptyComponentDemos,
    getComponentDemoFrameAttributes,
} from "../componentDemoFrame.js";
import type { ComponentDemoFrameRenderState } from "../componentDemoFrame.js";
import type { ComponentDemoDescriptor, ComponentDemoFrameWindow } from "../componentDemoFrame.js";
import ComponentDemos from "../componentDemos.js";
import type { ComponentDemoRecord } from "../componentDemos.js";

const demo: ComponentDemoRecord = {
    id: "docs/demos/basic.demo.tsx",
    title: "基础用法",
    description: "基础组件演示",
    learning: {
        components: ["Button"],
        props: ["appearance", "onClick"],
        events: ["onClick"],
        hasState: true,
    },
    sourceCode: "export default function Demo() { return <button>演示</button>; }",
    previewPath: "/components/rc-button/workbench/?__wake_demo=docs%2Fdemos%2Fbasic.demo.tsx",
    workbenchPath: "/components/rc-button/workbench/#/components/docs%2Fdemos%2Fbasic.demo.tsx",
    density: "compact",
    layout: "grid",
    group: null,
};

const testFrameWindow: ComponentDemoFrameWindow = {
    postMessage: mock.fn(),
};
const getTestFrameWindow = () => testFrameWindow;

const defaultPreviewConfiguration: ConfigValue = {
    designSystem: "md3",
    colorMode: "light",
    brandColor: null,
    size: "medium",
    density: "standard",
    locale: "zh-CN",
    direction: "ltr",
    nonce: undefined,
};

function previewConfiguration(overrides: Partial<ConfigValue> = {}) {
    return { type: "crab:preview-config", ...defaultPreviewConfiguration, ...overrides };
}

function renderTestFrame(state: ComponentDemoFrameRenderState) {
    return (
        <div
            title={state.title}
            data-src={state.src}
            data-sandbox={state.sandbox}
            data-wake-demo={state.demoId}
            data-height={state.height}
            data-attempt={state.attempt}
            aria-busy={!state.ready}
            tabIndex={state.tabIndex}
        />
    );
}

function renderEditableTestFrame(state: ComponentDemoFrameRenderState) {
    return <>{renderTestFrame(state)}<input aria-label="预览中的草稿" defaultValue="" /></>;
}

function ImmediateReadyFrame({ state }: { readonly state: ComponentDemoFrameRenderState }) {
    useLayoutEffect(() => {
        const event = new Event("message");
        Object.defineProperties(event, {
            data: { value: { type: "wake:ready" } },
            source: { value: testFrameWindow },
        });
        window.dispatchEvent(event);
    }, []);
    return renderTestFrame(state);
}

function renderImmediateReadyFrame(state: ComponentDemoFrameRenderState) {
    return <ImmediateReadyFrame state={state} />;
}

async function dispatchWakeMessage(
    source: object,
    data: Readonly<Record<string, unknown>>,
    origin = window.location.origin,
) {
    await act(async () => {
        const event = new Event("message");
        Object.defineProperties(event, {
            data: { value: data },
            source: { value: source },
            origin: { value: origin },
        });
        window.dispatchEvent(event);
    });
}

async function renderImmediately(node: ReactElement) {
    const observerDescriptor = Object.getOwnPropertyDescriptor(
        globalThis,
        "IntersectionObserver",
    );
    Object.defineProperty(globalThis, "IntersectionObserver", {
        configurable: true,
        writable: true,
        value: undefined,
    });
    try {
        return await render(node);
    } finally {
        if (observerDescriptor) {
            Object.defineProperty(globalThis, "IntersectionObserver", observerDescriptor);
        } else {
            Reflect.deleteProperty(globalThis, "IntersectionObserver");
        }
    }
}

describe("ComponentDemoFrame", () => {
    it("使用精确 Demo URL、隔离 sandbox 和可访问标题", async () => {
        const attributes = getComponentDemoFrameAttributes(demo);
        expect(attributes.src).toBe(demo.previewPath);
        expect(attributes.title).toBe("基础用法 交互演示");
        expect(attributes.sandbox).toBe("allow-scripts allow-same-origin");
        expect(attributes.demoId).toBe(demo.id);

        await renderImmediately(
            <ComponentDemoFrame
                demo={demo}
                getFrameWindow={getTestFrameWindow}
                renderFrame={renderTestFrame}
            />,
        );
        const frame = screen.getByTitle("基础用法 交互演示");

        expect(frame.getAttribute("data-src")).toBe(demo.previewPath);
        expect(frame.getAttribute("data-sandbox")).toBe("allow-scripts allow-same-origin");
        expect(frame.getAttribute("data-wake-demo")).toBe(demo.id);
    });

    it("外观预览使用轻量描述、独立标题，并在加载完成和主题切换后保持不可交互", async () => {
        const descriptor: ComponentDemoDescriptor = {
            id: demo.id,
            title: demo.title,
            previewPath: demo.previewPath,
            density: demo.density,
        };
        const frameDocument = document.implementation.createHTMLDocument();
        const contentRoot = frameDocument.createElement("div");
        contentRoot.className = "demo-frame-root";
        frameDocument.body.append(contentRoot);
        const postMessage = mock.fn();
        const frameWindow: ComponentDemoFrameWindow = { document: frameDocument, postMessage };
        const getFrameWindow = () => frameWindow;
        const preview = (design: "md3" | "shadcn" | "apple") => (
            <ConfigProvider designSystem={design}>
                <ComponentDemoFrame demo={descriptor} presentation="artwork" getFrameWindow={getFrameWindow}
                    renderFrame={renderTestFrame} />
            </ConfigProvider>
        );
        const { container, rerender } = await renderImmediately(preview("shadcn"));
        const frame = container.querySelector('[title="基础用法 外观预览"]');
        const artwork = container.querySelector('[data-presentation="artwork"]');
        expect(frame?.getAttribute("title")).toBe("基础用法 外观预览");
        expect(frame?.getAttribute("data-src")).toBe(demo.previewPath);
        expect(frame?.getAttribute("tabindex")).toBe("-1");
        expect(artwork?.hasAttribute("inert")).toBe(true);
        expect(artwork?.getAttribute("aria-hidden")).toBe("true");

        await dispatchWakeMessage(frameWindow, { type: "wake:ready" });
        expect(frame?.getAttribute("aria-busy")).toBe("false");
        expect(frame?.getAttribute("tabindex")).toBe("-1");
        expect(frameDocument.documentElement.inert).toBe(true);
        expect(contentRoot.inert).toBe(true);
        expect(frameDocument.documentElement.dataset.crabDesign).toBe("shadcn");

        await rerender(preview("md3"));
        expect(container.querySelector('[title="基础用法 外观预览"]')).toBe(frame);
        expect(frame?.getAttribute("tabindex")).toBe("-1");
        expect(frameDocument.documentElement.dataset.crabDesign).toBe("md3");
        expect(contentRoot.dataset.crabDesign).toBe("md3");
        expect(postMessage).toHaveBeenCalledWith(
            previewConfiguration({ designSystem: "md3" }),
            window.location.origin,
        );
        await rerender(preview("apple"));
        expect(container.querySelector('[title="基础用法 外观预览"]')).toBe(frame);
        expect(frame?.getAttribute("tabindex")).toBe("-1");
        expect(frameDocument.documentElement.dataset.crabDesign).toBe("apple");
        expect(contentRoot.dataset.crabDesign).toBe("apple");
        expect(postMessage).toHaveBeenCalledWith(
            previewConfiguration({ designSystem: "apple" }),
            window.location.origin,
        );
    });

    it("外观预览加载失败后提供静态回退，不增加重试和工作台控件", async () => {
        const { container } = await renderImmediately(
            <ComponentDemoFrame demo={demo} presentation="artwork" getFrameWindow={getTestFrameWindow}
                renderFrame={renderTestFrame} />,
        );
        await dispatchWakeMessage(testFrameWindow, { type: "wake:error", error: "Demo boom" });
        expect(container.textContent).toContain("预览暂时无法显示，请查看下方组件示例。");
        expect(container.querySelector("button, a, [role=alert]")).toBeNull();
        expect(container.querySelector('[title="基础用法 外观预览"]')).toBeNull();
    });

    it("进入预加载区域后才挂载 iframe", async () => {
        type ObserverConstructor = typeof globalThis.IntersectionObserver;
        type ObserverCallback = ConstructorParameters<ObserverConstructor>[0];

        let callback: ObserverCallback | undefined;
        let observedTarget: Element | undefined;
        const observerDescriptor = Object.getOwnPropertyDescriptor(
            globalThis,
            "IntersectionObserver",
        );

        class DeferredIntersectionObserver {
            readonly root = null;
            readonly rootMargin = "300px";
            readonly scrollMargin = "0px";
            readonly thresholds = [0];

            constructor(nextCallback: ObserverCallback) {
                callback = nextCallback;
            }

            disconnect() {}
            observe(target: Element) { observedTarget = target; }
            takeRecords() { return []; }
            unobserve() {}
        }

        Object.defineProperty(globalThis, "IntersectionObserver", {
            configurable: true,
            writable: true,
            value: DeferredIntersectionObserver,
        });
        const { unmount } = await render(
            <ComponentDemoFrame
                demo={demo}
                getFrameWindow={getTestFrameWindow}
                renderFrame={renderTestFrame}
            />,
        );
        expect(screen.queryByTitle("基础用法 交互演示")).toBeNull();
        expect(screen.getByRole("status").textContent).toContain("进入可视区域后加载");

        await act(async () => {
            const rectangle = new globalThis.DOMRectReadOnly();
            callback?.([{
                boundingClientRect: rectangle,
                intersectionRatio: 1,
                intersectionRect: rectangle,
                isIntersecting: true,
                rootBounds: null,
                target: observedTarget ?? document.body,
                time: 0,
            }], {} as InstanceType<ObserverConstructor>);
        });
        expect(screen.getByTitle("基础用法 交互演示")).toBeTruthy();

        await unmount();
        if (observerDescriptor) {
            Object.defineProperty(globalThis, "IntersectionObserver", observerDescriptor);
        } else {
            Reflect.deleteProperty(globalThis, "IntersectionObserver");
        }
    });

    it("只接受对应 iframe 的 resize 消息", async () => {
        await renderImmediately(
            <ComponentDemoFrame
                demo={demo}
                getFrameWindow={getTestFrameWindow}
                renderFrame={renderTestFrame}
            />,
        );
        const frame = screen.getByTitle("基础用法 交互演示");

        await act(async () => {
            const event = new Event("message");
            Object.defineProperties(event, {
                data: { value: { type: "wake:resize", height: 999 } },
                source: { value: {} },
            });
            window.dispatchEvent(event);
        });
        expect(frame.getAttribute("data-height")).toBe("120");

        await dispatchWakeMessage(testFrameWindow, { type: "wake:resize", height: 346.2 });
        expect(frame.getAttribute("data-height")).toBe("347");

        await dispatchWakeMessage(testFrameWindow, { type: "wake:resize", height: 100_000 });
        expect(frame.getAttribute("data-height")).toBe("1200");

        await dispatchWakeMessage(testFrameWindow, { type: "wake:resize", height: -100 });
        expect(frame.getAttribute("data-height")).toBe("80");
    });

    it("ready 后同步主题并解除 busy 状态", async () => {
        document.documentElement.dataset.theme = "dark";
        const postMessage = mock.fn();
        const themeFrameWindow: ComponentDemoFrameWindow = { postMessage };
        const getThemeFrameWindow = () => themeFrameWindow;
        await renderImmediately(
            <ConfigProvider colorMode="dark">
                <ComponentDemoFrame
                    demo={demo}
                    getFrameWindow={getThemeFrameWindow}
                    renderFrame={renderTestFrame}
                />
            </ConfigProvider>,
        );
        const frame = screen.getByTitle("基础用法 交互演示");

        expect(frame.getAttribute("aria-busy")).toBe("true");
        expect(frame.getAttribute("tabindex")).toBe("-1");
        await dispatchWakeMessage(themeFrameWindow, { type: "wake:ready" });
        expect(frame.getAttribute("aria-busy")).toBe("false");
        expect(frame.getAttribute("tabindex")).toBeNull();
        expect(postMessage).toHaveBeenCalledWith(
            { type: "wake:theme", theme: "dark" },
            "*",
        );
        delete document.documentElement.dataset.theme;
    });

    it("将设计体系同步到 iframe 的主题边界与 React 配置，并在切换时保留演示实例", async () => {
        const frameDocument = document.implementation.createHTMLDocument();
        const contentRoot = frameDocument.createElement("div");
        contentRoot.className = "demo-frame-root";
        contentRoot.dataset.theme = "dark";
        frameDocument.body.append(contentRoot);
        const postMessage = mock.fn();
        const frameWindow: ComponentDemoFrameWindow = { document: frameDocument, postMessage };
        const getFrameWindow = () => frameWindow;
        const preview = (design: "md3" | "shadcn" | "apple") => (
            <ConfigProvider designSystem={design}>
                <ComponentDemoFrame demo={demo} getFrameWindow={getFrameWindow} renderFrame={renderTestFrame} />
            </ConfigProvider>
        );
        const { rerender } = await renderImmediately(preview("shadcn"));
        await dispatchWakeMessage(frameWindow, { type: "wake:ready" });

        expect(frameDocument.documentElement.dataset.crabDesign).toBe("shadcn");
        expect(contentRoot.dataset.crabDesign).toBe("shadcn");
        expect(contentRoot.dataset.theme).toBe("light");
        expect(postMessage).toHaveBeenCalledWith(
            previewConfiguration({ designSystem: "shadcn" }),
            window.location.origin,
        );
        await rerender(preview("md3"));
        expect(frameDocument.documentElement.dataset.crabDesign).toBe("md3");
        expect(contentRoot.dataset.crabDesign).toBe("md3");
        expect(postMessage).toHaveBeenCalledWith(
            previewConfiguration({ designSystem: "md3" }),
            window.location.origin,
        );
        expect(screen.getByTitle("基础用法 交互演示").getAttribute("data-attempt")).toBe("0");
        await rerender(preview("apple"));
        expect(frameDocument.documentElement.dataset.crabDesign).toBe("apple");
        expect(contentRoot.dataset.crabDesign).toBe("apple");
        expect(postMessage).toHaveBeenCalledWith(
            previewConfiguration({ designSystem: "apple" }),
            window.location.origin,
        );
        expect(screen.getByTitle("基础用法 交互演示").getAttribute("data-attempt")).toBe("0");
    });

    it("只回应对应同源预览的主动配置握手", async () => {
        const frameDocument = document.implementation.createHTMLDocument();
        const frameWindow: ComponentDemoFrameWindow = { document: frameDocument, postMessage: mock.fn() };
        await renderImmediately(
            <ConfigProvider designSystem="shadcn">
                <ComponentDemoFrame demo={demo} getFrameWindow={() => frameWindow} renderFrame={renderTestFrame} />
            </ConfigProvider>,
        );
        frameDocument.documentElement.dataset.crabDesign = "md3";
        await dispatchWakeMessage({}, { type: "crab:preview-ready" });
        await dispatchWakeMessage(frameWindow, { type: "crab:preview-ready" }, "https://untrusted.example");
        expect(frameDocument.documentElement.dataset.crabDesign).toBe("md3");
        await dispatchWakeMessage(frameWindow, { type: "crab:preview-ready" });
        expect(frameDocument.documentElement.dataset.crabDesign).toBe("shadcn");
    });

    it("发送最近配置边界的完整快照，独立于代码主题且切换时保留父侧预览实例与草稿", async () => {
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const frameDocument = document.implementation.createHTMLDocument();
        const contentRoot = frameDocument.createElement("div");
        contentRoot.className = "demo-frame-root";
        frameDocument.body.append(contentRoot);
        const messages: { message: unknown; targetOrigin: string }[] = [];
        const frameWindow: ComponentDemoFrameWindow = {
            document: frameDocument,
            postMessage: (message, targetOrigin) => { messages.push({ message, targetOrigin }); },
        };
        const getFrameWindow = () => frameWindow;
        const onThemeChange = mock.fn();
        const inherited: ConfigValue = {
            designSystem: "md3", colorMode: "dark", brandColor: "#123456",
            size: "small", density: "compact", locale: "en-US", direction: "rtl", nonce: "outer-nonce",
        };
        const overrides: Partial<ConfigValue> = {
            designSystem: "apple", colorMode: "light", brandColor: "#345678",
            size: "large", density: "comfortable", nonce: "preview-nonce",
        };
        const expected = previewConfiguration({ ...inherited, ...overrides });
        const preview = (parent: ConfigValue, inner: Partial<ConfigValue>) => (
            <ConfigProvider {...parent}>
                <ConfigProvider {...inner}>
                    <ComponentDemoFrame demo={demo} getFrameWindow={getFrameWindow}
                        renderFrame={renderEditableTestFrame} onThemeChange={onThemeChange} />
                </ConfigProvider>
            </ConfigProvider>
        );
        let unmount: (() => Promise<void>) | undefined;
        try {
            document.documentElement.dataset.theme = "light";
            const view = await renderImmediately(preview(inherited, overrides));
            unmount = view.unmount;
            const frame = screen.getByTitle("基础用法 交互演示");
            const draft = screen.getByRole("textbox", { name: "预览中的草稿" });
            if (!(draft instanceof HTMLInputElement)) throw new Error("草稿应当是输入框");
            await fireEvent.change(draft, { target: { value: "配置切换后保留" } });
            expect(messages.at(-1)).toEqual({ message: expected, targetOrigin: window.location.origin });
            expect(frameDocument.documentElement.dataset.crabSize).toBe("large");
            expect(contentRoot.dataset.crabDensity).toBe("comfortable");
            expect(contentRoot.lang).toBe("en-US");
            expect(contentRoot.dir).toBe("rtl");

            messages.length = 0;
            await dispatchWakeMessage({}, { type: "crab:preview-ready" });
            await dispatchWakeMessage(frameWindow, { type: "crab:preview-ready" }, "https://untrusted.example");
            expect(messages).toEqual([]);
            await dispatchWakeMessage(frameWindow, { type: "crab:preview-ready" });
            expect(messages).toEqual([
                { message: { type: "wake:theme", theme: "light" }, targetOrigin: "*" },
                { message: expected, targetOrigin: window.location.origin },
            ]);

            messages.length = 0;
            await act(async () => { document.documentElement.dataset.theme = "dark"; });
            expect(onThemeChange).toHaveBeenCalledWith("dark");
            expect(messages).toEqual([]);
            expect(contentRoot.dataset.theme).toBe("light");
            await dispatchWakeMessage(frameWindow, { type: "wake:ready" });
            expect(messages.at(-1)).toEqual({ message: expected, targetOrigin: window.location.origin });
            expect(frame.getAttribute("aria-busy")).toBe("false");

            await view.rerender(preview(defaultPreviewConfiguration, {
                designSystem: "shadcn", colorMode: "dark", brandColor: null,
            }));
            const reset = previewConfiguration({ designSystem: "shadcn", colorMode: "dark" });
            expect(messages.at(-1)).toEqual({ message: reset, targetOrigin: window.location.origin });
            const lastMessage = messages.at(-1)?.message;
            expect(typeof lastMessage === "object" && lastMessage !== null && Object.hasOwn(lastMessage, "nonce")).toBe(true);
            expect(typeof lastMessage === "object" && lastMessage !== null && Object.hasOwn(lastMessage, "brandColor")).toBe(true);
            expect(contentRoot.dataset.theme).toBe("dark");
            expect(contentRoot.dataset.crabSize).toBe("medium");
            expect(contentRoot.dataset.crabDensity).toBe("standard");
            expect(contentRoot.lang).toBe("zh-CN");
            expect(contentRoot.dir).toBe("ltr");
            expect(screen.getByTitle("基础用法 交互演示")).toBe(frame);
            expect(frame.getAttribute("data-attempt")).toBe("0");
            expect(screen.getByRole("textbox", { name: "预览中的草稿" })).toBe(draft);
            expect(draft.value).toBe("配置切换后保留");
        } finally {
            await unmount?.();
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
        }
    });

    it("弹层关闭后按内容收起预览，不被旧视口高度撑开，并释放尺寸监听", async () => {
        const frameDocument = document.implementation.createHTMLDocument();
        const contentRoot = frameDocument.createElement("div");
        contentRoot.className = "demo-frame-root";
        frameDocument.body.append(contentRoot);
        let contentHeight = 132;
        Object.defineProperty(contentRoot, "getBoundingClientRect", {
            value: () => new globalThis.DOMRect(0, 0, 320, contentHeight),
        });
        const frameWindow: ComponentDemoFrameWindow = {
            document: frameDocument,
            postMessage: mock.fn(),
        };
        const getFrameWindow = () => frameWindow;
        let notifyResize: (() => void) | undefined;
        const observed = new Set<Element>();
        class ContentResizeObserver implements ResizeObserver {
            constructor(callback: ResizeObserverCallback) {
                notifyResize = () => callback([], this);
            }
            observe(target: Element) { observed.add(target); }
            unobserve(target: Element) { observed.delete(target); }
            disconnect() { observed.clear(); }
        }
        const descriptor = Object.getOwnPropertyDescriptor(globalThis, "ResizeObserver");
        Object.defineProperty(globalThis, "ResizeObserver", {
            configurable: true,
            writable: true,
            value: ContentResizeObserver,
        });
        let unmount: (() => Promise<void>) | undefined;
        try {
            const rendered = await renderImmediately(
                <ComponentDemoFrame demo={demo} getFrameWindow={getFrameWindow} renderFrame={renderTestFrame} />,
            );
            unmount = rendered.unmount;
            await dispatchWakeMessage(frameWindow, { type: "wake:ready" });
            const frame = screen.getByTitle("基础用法 交互演示");
            expect(frame.getAttribute("data-height")).toBe("132");
            expect(observed.has(contentRoot)).toBe(true);
            await act(async () => {
                contentHeight = 640;
                notifyResize?.();
            });
            expect(frame.getAttribute("data-height")).toBe("640");
            await act(async () => {
                contentHeight = 132;
                notifyResize?.();
            });
            await dispatchWakeMessage(frameWindow, { type: "wake:resize", height: 640 });
            expect(frame.getAttribute("data-height")).toBe("132");
        } finally {
            await unmount?.();
            if (descriptor) Object.defineProperty(globalThis, "ResizeObserver", descriptor);
            else Reflect.deleteProperty(globalThis, "ResizeObserver");
        }
        expect(observed.size).toBe(0);
    });

    it("在 iframe layout 阶段发送的 ready 消息不会丢失", async () => {
        await renderImmediately(
            <ComponentDemoFrame
                demo={demo}
                getFrameWindow={getTestFrameWindow}
                renderFrame={renderImmediateReadyFrame}
            />,
        );

        const frame = screen.getByTitle("基础用法 交互演示");
        expect(frame.getAttribute("aria-busy")).toBe("false");
        expect(frame.getAttribute("tabindex")).toBeNull();
    });

    it("加载较慢时保持原预览和主题同步，并由迟到的 ready 自动恢复", async () => {
        await clock.fake();
        const originalTheme = document.documentElement.getAttribute("data-theme");
        const frameDocument = document.implementation.createHTMLDocument();
        const postMessage = mock.fn();
        const frameWindow: ComponentDemoFrameWindow = { document: frameDocument, postMessage };
        const getFrameWindow = () => frameWindow;
        const preview = (design: "apple" | "shadcn", colorMode: "light" | "dark" = "light") => (
            <ConfigProvider designSystem={design} colorMode={colorMode}>
                <ComponentDemoFrame demo={demo} getFrameWindow={getFrameWindow}
                    renderFrame={renderTestFrame} readyTimeoutMs={50} />
            </ConfigProvider>
        );
        let unmount: (() => Promise<void>) | undefined;
        try {
            const rendered = await renderImmediately(preview("apple"));
            unmount = rendered.unmount;
            const frame = screen.getByTitle("基础用法 交互演示");
            await act(async () => { await clock.advanceBy(50); });

            expect(screen.getByRole("alert").textContent).toContain("演示仍在加载");
            expect(screen.getByTitle("基础用法 交互演示")).toBe(frame);
            expect(frame.getAttribute("aria-busy")).toBe("true");
            await rendered.rerender(preview("shadcn", "dark"));
            await act(async () => { document.documentElement.dataset.theme = "dark"; });
            expect(frameDocument.documentElement.dataset.crabDesign).toBe("shadcn");
            expect(frameDocument.documentElement.dataset.theme).toBe("dark");
            expect(postMessage).toHaveBeenCalledWith(
                previewConfiguration({ designSystem: "shadcn", colorMode: "dark" }),
                window.location.origin,
            );

            await dispatchWakeMessage(frameWindow, { type: "wake:ready" });
            expect(screen.queryByRole("alert")).toBeNull();
            expect(screen.getByTitle("基础用法 交互演示")).toBe(frame);
            expect(frame.getAttribute("data-attempt")).toBe("0");
            expect(frame.getAttribute("aria-busy")).toBe("false");
            expect(frame.getAttribute("tabindex")).toBeNull();
        } finally {
            await unmount?.();
            if (originalTheme === null) document.documentElement.removeAttribute("data-theme");
            else document.documentElement.setAttribute("data-theme", originalTheme);
            await clock.restore();
        }
    });

    it("加载较慢后发生运行错误仍终止预览，不被后续 ready 掩盖", async () => {
        await clock.fake();
        let unmount: (() => Promise<void>) | undefined;
        try {
            const rendered = await renderImmediately(
                <ComponentDemoFrame demo={demo} getFrameWindow={getTestFrameWindow}
                    renderFrame={renderTestFrame} readyTimeoutMs={50} />,
            );
            unmount = rendered.unmount;
            await act(async () => { await clock.advanceBy(50); });
            await dispatchWakeMessage(testFrameWindow, { type: "wake:error", error: "Demo boom" });
            expect(screen.queryByTitle("基础用法 交互演示")).toBeNull();
            expect(screen.getByRole("alert").textContent).toContain("Demo boom");
            await dispatchWakeMessage(testFrameWindow, { type: "wake:ready" });
            expect(screen.queryByTitle("基础用法 交互演示")).toBeNull();
            expect(screen.getByRole("alert").textContent).toContain("Demo boom");
        } finally {
            await unmount?.();
            await clock.restore();
        }
    });

    it("加载较慢后仍可重试，并忽略旧预览迟到的 ready", async () => {
        await clock.fake();
        const retryFrameWindow: ComponentDemoFrameWindow = { postMessage: mock.fn() };
        let activeFrameWindow = testFrameWindow;
        const getFrameWindow = () => activeFrameWindow;
        let unmount: (() => Promise<void>) | undefined;
        try {
            const rendered = await renderImmediately(
                <ComponentDemoFrame
                    demo={demo}
                    getFrameWindow={getFrameWindow}
                    renderFrame={renderTestFrame}
                    readyTimeoutMs={50}
                />,
            );
            unmount = rendered.unmount;

            expect(screen.getByRole("status").textContent).toContain("正在加载交互演示");
            await act(async () => {
                await clock.advanceBy(50);
            });

            expect(screen.getByRole("alert").textContent).toContain("演示仍在加载");
            activeFrameWindow = retryFrameWindow;
            await fireEvent.click(screen.getByRole("button", { name: "重新加载演示" }));

            const frame = screen.getByTitle("基础用法 交互演示");
            expect(frame.getAttribute("data-attempt")).toBe("1");
            await dispatchWakeMessage(testFrameWindow, { type: "wake:ready" });
            expect(frame.getAttribute("aria-busy")).toBe("true");
            await dispatchWakeMessage(retryFrameWindow, { type: "wake:ready" });
            await act(async () => {
                await clock.advanceBy(50);
            });
            expect(screen.queryByRole("alert")).toBeNull();
        } finally {
            await unmount?.();
            await clock.restore();
        }
    });

    it("重试时清理上一次加载尝试的超时计时器", async () => {
        await clock.fake();
        let unmount: (() => Promise<void>) | undefined;
        try {
            const rendered = await renderImmediately(
                <ComponentDemoFrame
                    demo={demo}
                    getFrameWindow={getTestFrameWindow}
                    renderFrame={renderTestFrame}
                    readyTimeoutMs={100}
                />,
            );
            unmount = rendered.unmount;

            await act(async () => {
                await clock.advanceBy(40);
            });
            await dispatchWakeMessage(testFrameWindow, {
                type: "wake:error",
                error: "首次加载失败",
            });
            await fireEvent.click(screen.getByRole("button", { name: "重新加载演示" }));

            await act(async () => {
                await clock.advanceBy(60);
            });
            expect(screen.queryByRole("alert")).toBeNull();
            expect(screen.getByTitle("基础用法 交互演示").getAttribute("data-attempt")).toBe("1");

            await dispatchWakeMessage(testFrameWindow, { type: "wake:ready" });
            await act(async () => {
                await clock.advanceBy(40);
            });
            expect(screen.queryByRole("alert")).toBeNull();
        } finally {
            await unmount?.();
            await clock.restore();
        }
    });

    it("将单个 Demo 的运行错误隔离在对应预览中", async () => {
        const secondDemo = {
            ...demo,
            id: "docs/demos/second.demo.tsx",
            title: "第二个演示",
        } satisfies ComponentDemoRecord;
        const firstFrameWindow: ComponentDemoFrameWindow = { postMessage: mock.fn() };
        const secondFrameWindow: ComponentDemoFrameWindow = { postMessage: mock.fn() };
        await renderImmediately(
            <div>
                <ComponentDemoFrame
                    demo={demo}
                    getFrameWindow={() => firstFrameWindow}
                    renderFrame={renderTestFrame}
                />
                <ComponentDemoFrame
                    demo={secondDemo}
                    getFrameWindow={() => secondFrameWindow}
                    renderFrame={renderTestFrame}
                />
            </div>,
        );
        screen.getByTitle("基础用法 交互演示");

        await dispatchWakeMessage(firstFrameWindow, {
            type: "wake:error",
            error: "Demo boom",
        });

        expect(screen.getByRole("alert").textContent).toContain("Demo boom");
        expect(screen.getByTitle("第二个演示 交互演示")).toBeTruthy();
    });

    it("未知或无 Demo 的组件显示稳定回退", async () => {
        await render(<EmptyComponentDemos />);
        expect(screen.getByRole("status").textContent).toContain("暂无可用的组件演示");
    });

    it("按分组组织 Demo 并为宽预览输出明确布局标记", async () => {
        const groupedDemos = [
            {
                ...demo,
                group: "基础能力",
            },
            {
                ...demo,
                id: "docs/demos/wide.demo.tsx",
                title: "宽内容",
                group: "进阶能力",
                layout: "wide",
            },
        ] satisfies readonly ComponentDemoRecord[];

        await render(<ComponentDemos demos={groupedDemos} />);

        expect(screen.getByRole("heading", { name: "基础能力", level: 3 })).toBeTruthy();
        expect(screen.getByRole("heading", { name: "进阶能力", level: 3 })).toBeTruthy();
        const cards = document.querySelectorAll("[data-component-demo-id]");
        expect(cards).toHaveLength(2);
        expect(cards[0]?.getAttribute("data-demo-layout")).toBe("grid");
        expect(cards[1]?.getAttribute("data-demo-layout")).toBe("wide");
    });

    it("瀑布流保留示例顺序，宽幅示例在相邻瀑布流之间独占整行", async () => {
        const layouts = ["grid", "grid", "wide", "grid", "wide", "grid"] as const;
        const demos = layouts.map((layout, index) => ({
            ...demo,
            id: `demo-${index}`,
            title: `演示 ${index}`,
            layout,
        }));
        const { container } = await render(<ComponentDemos demos={demos} />);
        const cards = [...container.querySelectorAll("[data-component-demo-id]")];

        expect(cards.map(card => card.getAttribute("data-component-demo-id")))
            .toEqual(demos.map(item => item.id));
        for (const [index, card] of cards.entries()) {
            expect(card.closest("[data-demo-masonry]") !== null).toBe(layouts[index] === "grid");
        }
        const masonryRuns = [...container.querySelectorAll("[data-demo-masonry]")];
        expect(masonryRuns.map(run => run.querySelectorAll("[data-component-demo-id]").length))
            .toEqual([2, 1, 1]);
        expect(cards[2]?.parentElement).toBe(masonryRuns[0]?.parentElement);
        expect(cards[4]?.parentElement).toBe(masonryRuns[1]?.parentElement);
    });
});
