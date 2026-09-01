import { act, describe, expect, it, mock, render, screen } from "@crab-dev/wake/test/react";
import type { ReactElement } from "react";
import ComponentDemoFrame, {
    EmptyComponentDemos,
    getComponentDemoFrameAttributes,
} from "../componentDemoFrame.js";
import type { ComponentDemoFrameRenderState } from "../componentDemoFrame.js";
import type { ComponentDemoFrameWindow } from "../componentDemoFrame.js";
import ComponentDemos from "../componentDemos.js";
import type { ComponentDemoRecord } from "../componentDemos.js";

const demo: ComponentDemoRecord = {
    id: "docs/demos/basic.demo.tsx",
    title: "基础用法",
    description: "基础组件演示",
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

function renderTestFrame(state: ComponentDemoFrameRenderState) {
    return (
        <div
            title={state.title}
            data-src={state.src}
            data-sandbox={state.sandbox}
            data-wake-demo={state.demoId}
            data-height={state.height}
            aria-busy={!state.ready}
        />
    );
}

async function dispatchWakeMessage(
    source: object,
    data: Readonly<Record<string, unknown>>,
) {
    await act(async () => {
        const event = new Event("message");
        Object.defineProperties(event, {
            data: { value: data },
            source: { value: source },
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

    it("进入预加载区域后才挂载 iframe", async () => {
        type ObserverConstructor = typeof globalThis.IntersectionObserver;
        type ObserverCallback = ConstructorParameters<ObserverConstructor>[0];

        let callback: ObserverCallback | undefined;
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
            observe() {}
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
                target: document.body,
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
    });

    it("ready 后同步主题并解除 busy 状态", async () => {
        document.documentElement.dataset.theme = "dark";
        const postMessage = mock.fn();
        const themeFrameWindow: ComponentDemoFrameWindow = { postMessage };
        const getThemeFrameWindow = () => themeFrameWindow;
        await renderImmediately(
            <ComponentDemoFrame
                demo={demo}
                getFrameWindow={getThemeFrameWindow}
                renderFrame={renderTestFrame}
            />,
        );
        const frame = screen.getByTitle("基础用法 交互演示");

        expect(frame.getAttribute("aria-busy")).toBe("true");
        await dispatchWakeMessage(themeFrameWindow, { type: "wake:ready" });
        expect(frame.getAttribute("aria-busy")).toBe("false");
        expect(postMessage).toHaveBeenCalledWith(
            { type: "wake:theme", theme: "dark" },
            "*",
        );
        delete document.documentElement.dataset.theme;
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
});
