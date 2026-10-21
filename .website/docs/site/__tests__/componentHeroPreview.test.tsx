import { afterAll, beforeAll, beforeEach, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, render } from "@crab-dev/wake/test/react";
import { componentPreviews } from "../../_generated/component-previews.js";
import type { ComponentDemoDescriptor, ComponentDemoFramePresentation } from "../componentDemoFrame.js";

// Wake matches the consumer's literal relative import specifier.
mock.module("./componentDemoFrame.js", () => ({
    __esModule: true,
    default: ({ demo, presentation = "interactive" }: {
        readonly demo: ComponentDemoDescriptor;
        readonly presentation?: ComponentDemoFramePresentation;
    }) => <div
        data-frame-fixture=""
        data-presentation={presentation}
        data-demo-id={demo.id}
        data-preview-path={demo.previewPath}
        data-workbench-path={demo.workbenchPath}
        data-density={demo.density}
    >{demo.title}</div>,
}));

let ComponentHeroPreview: (typeof import("../componentHeroPreview.js"))["default"];
const resizeObservers: ControlledResizeObserver[] = [];
const mutationObservers: ControlledMutationObserver[] = [];

class ControlledResizeObserver implements ResizeObserver {
    readonly observed = new Set<Element>();
    private readonly callback: ResizeObserverCallback;

    constructor(callback: ResizeObserverCallback) {
        this.callback = callback;
        resizeObservers.push(this);
    }

    observe(target: Element) { this.observed.add(target); }
    unobserve(target: Element) { this.observed.delete(target); }
    disconnect() { this.observed.clear(); }
    notify() { this.callback([], this); }
}

class ControlledMutationObserver implements MutationObserver {
    readonly observed = new Set<Node>();
    private readonly callback: MutationCallback;

    constructor(callback: MutationCallback) {
        this.callback = callback;
        mutationObservers.push(this);
    }

    observe(target: Node) { this.observed.add(target); }
    disconnect() { this.observed.clear(); }
    takeRecords(): MutationRecord[] { return []; }
    notify() { this.callback([], this); }
}

const resizeDescriptor = Object.getOwnPropertyDescriptor(globalThis, "ResizeObserver");
const mutationDescriptor = Object.getOwnPropertyDescriptor(globalThis, "MutationObserver");
const rectDescriptor = Object.getOwnPropertyDescriptor(HTMLElement.prototype, "getBoundingClientRect");

beforeAll(async () => {
    Object.defineProperty(globalThis, "ResizeObserver", { configurable: true, writable: true, value: ControlledResizeObserver });
    Object.defineProperty(globalThis, "MutationObserver", { configurable: true, writable: true, value: ControlledMutationObserver });
    Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
        configurable: true,
        writable: true,
        value(this: HTMLElement) {
            return new globalThis.DOMRect(0, 0, Number(this.dataset.testWidth ?? 0), 120);
        },
    });
    ({ default: ComponentHeroPreview } = await mock.import<typeof import("../componentHeroPreview.js")>("../componentHeroPreview.js"));
});

beforeEach(() => {
    resizeObservers.length = 0;
    mutationObservers.length = 0;
});

afterAll(() => {
    if (resizeDescriptor) Object.defineProperty(globalThis, "ResizeObserver", resizeDescriptor);
    else Reflect.deleteProperty(globalThis, "ResizeObserver");
    if (mutationDescriptor) Object.defineProperty(globalThis, "MutationObserver", mutationDescriptor);
    else Reflect.deleteProperty(globalThis, "MutationObserver");
    if (rectDescriptor) Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", rectDescriptor);
    else Reflect.deleteProperty(HTMLElement.prototype, "getBoundingClientRect");
});

function element(root: ParentNode, selector: string): HTMLElement {
    const found = root.querySelector<HTMLElement>(selector);
    if (!found) throw new Error(`Missing test element: ${selector}`);
    return found;
}

describe("ComponentHeroPreview", () => {
    it("使用 registry 选中的精确 Demo，并以 artwork 展示同一描述符", async () => {
        const demo = componentPreviews["rc-form"];
        const { container, unmount } = await render(<ComponentHeroPreview name="rc-form" />);
        try {
            const frame = element(container, "[data-frame-fixture]");
            expect(container.querySelectorAll("[data-frame-fixture]").length).toBe(1);
            expect(frame.dataset.presentation).toBe("artwork");
            expect(frame.dataset.demoId).toBe(demo.id);
            expect(frame.dataset.previewPath).toBe(demo.previewPath);
            expect(frame.dataset.workbenchPath).toBe(demo.workbenchPath);
            expect(frame.dataset.density).toBe(demo.density);
            expect(frame.textContent).toBe(demo.title);
        } finally {
            await unmount();
        }
    });

    it("只同步当前 article 内同一 Demo 的 interactive 宽度，并跟随 ResizeObserver 更新", async () => {
        const demo = componentPreviews["rc-form"];
        const otherDemo = componentPreviews["rc-line-edit"];
        const { container, unmount } = await render(<>
            <div data-component-demo-id={demo.id}>
                <div data-presentation="interactive" data-test-width="1000" />
            </div>
            <article>
                <ComponentHeroPreview name="rc-form" />
                <div data-component-demo-id={otherDemo.id}>
                    <div data-presentation="interactive" data-test-width="800" />
                </div>
                <div data-component-demo-id={demo.id} data-test-width="900">
                    <div data-presentation="artwork" data-test-width="120" />
                    <div data-source="selected" data-presentation="interactive" data-test-width="480" />
                </div>
            </article>
        </>);
        try {
            const hero = element(container, "[data-component-hero]");
            const source = element(container, '[data-source="selected"]');
            expect(hero.style.getPropertyValue("--crab-docs-preview-width")).toBe("480px");
            expect(resizeObservers.length).toBe(1);
            expect([...resizeObservers[0].observed]).toEqual([source]);
            await act(() => {
                source.dataset.testWidth = "632";
                resizeObservers[0].notify();
            });
            expect(hero.style.getPropertyValue("--crab-docs-preview-width")).toBe("632px");
        } finally {
            await unmount();
        }
    });

    it("演示延后出现或替换时切换尺寸来源，卸载时清理 Observer 和窗口监听", async () => {
        const demo = componentPreviews["rc-form"];
        const page = (version?: string) => <article>
            <ComponentHeroPreview name="rc-form" />
            {version && <div key={version} data-component-demo-id={demo.id}>
                <div data-source={version} data-presentation="interactive" data-test-width={version === "first" ? 420 : 560} />
            </div>}
        </article>;
        const { container, rerender, unmount } = await render(page());
        const hero = element(container, "[data-component-hero]");
        const resize = resizeObservers[0];
        const mutations = mutationObservers[0];
        let source: HTMLElement | undefined;
        try {
            expect(resize.observed.size).toBe(0);
            await rerender(page("first"));
            await act(() => mutations.notify());
            const first = element(container, '[data-source="first"]');
            expect([...resize.observed]).toEqual([first]);
            expect(hero.style.getPropertyValue("--crab-docs-preview-width")).toBe("420px");

            await rerender(page("replacement"));
            await act(() => mutations.notify());
            source = element(container, '[data-source="replacement"]');
            expect(resizeObservers.length).toBe(1);
            expect(resize.observed.has(first)).toBe(false);
            expect([...resize.observed]).toEqual([source]);
            expect(hero.style.getPropertyValue("--crab-docs-preview-width")).toBe("560px");
        } finally {
            await unmount();
        }
        expect(resize.observed.size).toBe(0);
        expect(mutations.observed.size).toBe(0);
        expect(hero.style.getPropertyValue("--crab-docs-preview-width")).toBe("");
        await act(() => {
            if (source) source.dataset.testWidth = "700";
            window.dispatchEvent(new Event("resize"));
        });
        expect(hero.style.getPropertyValue("--crab-docs-preview-width")).toBe("");
    });

    it("切换组件页后连接新 Demo，未知组件不展示预览并清理旧连接", async () => {
        const form = componentPreviews["rc-form"];
        const input = componentPreviews["rc-line-edit"];
        const page = (name: string) => <article>
            <ComponentHeroPreview name={name} />
            <div data-component-demo-id={form.id}>
                <div data-source="form" data-presentation="interactive" data-test-width="480" />
            </div>
            <div data-component-demo-id={input.id}>
                <div data-source="input" data-presentation="interactive" data-test-width="320" />
            </div>
        </article>;
        const { container, rerender, unmount } = await render(page("rc-form"));
        try {
            const previousResize = resizeObservers[0];
            const previousMutations = mutationObservers[0];
            await rerender(page("rc-line-edit"));
            const hero = element(container, "[data-component-hero]");
            const frame = element(hero, "[data-frame-fixture]");
            expect(frame.dataset.previewPath).toBe(input.previewPath);
            expect(hero.style.getPropertyValue("--crab-docs-preview-width")).toBe("320px");
            expect(previousResize.observed.size).toBe(0);
            expect(previousMutations.observed.size).toBe(0);
            expect(resizeObservers.length).toBe(2);
            expect([...resizeObservers[1].observed]).toEqual([element(container, '[data-source="input"]')]);

            for (const name of ["rc-unknown-component", "constructor", "toString", "__proto__"]) {
                await rerender(page(name));
                expect(container.querySelector("[data-component-hero]")).toBeNull();
                expect(container.querySelector("[data-frame-fixture]")).toBeNull();
                expect(resizeObservers[1].observed.size).toBe(0);
                expect(mutationObservers[1].observed.size).toBe(0);
            }
        } finally {
            await unmount();
        }
    });
});
