import { act, describe, expect, it, beforeAll, mock, render, fireEvent, screen } from "@crab-dev/wake/test/react";
import React from "react";
// 本文件刻意不 mock @floating-ui/react —— 要验证的正是它的真实 FloatingTree/useDismiss
// 机制:嵌套的 DropdownContainer(如 rc-select 用在 rc-color-picker 面板内)各自的浮层
// 因独立 FloatingPortal 而在 DOM 上只是兄弟节点,点击内层浮层不应被外层误判为"点击外部"
// 而整体关闭。dropdownContainer.test.tsx 用简化 mock 无法覆盖这一场景。
mock.module("motion/react", async () => {

    const mockReact = await mock.actual<typeof import("react")>("react");
    const MockDiv = mockReact.forwardRef((props: Record<string, unknown>, ref: unknown) => mockReact.createElement("div", { ...props, ref }));
    MockDiv.displayName = "MockMotionDiv";
    return {
        motion: { div: MockDiv },
        AnimatePresence: ({ children }: {
            children: unknown;
        }) => children,
    };
});
let DropdownContainer: (typeof import("../index.js"))["default"];
let useDropdownContext: (typeof import("../index.js"))["useDropdownContext"];
beforeAll(async () => {
    const indexModule = await mock.import<typeof import("../index.js")>("../index.js");
    DropdownContainer = indexModule.default;
    useDropdownContext = indexModule.useDropdownContext;
});
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
beforeAll(() => {
    // jsdom 未内置 ResizeObserver;真实 useFloating 的 autoUpdate 依赖它。
    (globalThis as Record<string, unknown>).ResizeObserver ??= class {
        observe() { }
        unobserve() { }
        disconnect() { }
    };
});
/** 模拟真实消费方(SelectInput / ColorPickerInput)点击触发器时直接 dispatch 打开。 */
const OpenButton = ({ testId }: {
    testId: string;
}) => {
    const { dispatch } = useDropdownContext();
    return (<button data-testid={testId} onClick={() => dispatch({ type: "setOpen", payload: true })}>
            open
    </button>);
};
const NestedScenario = () => (<DropdownContainer overlay={<div data-testid="outer-panel">
    <DropdownContainer overlay={<button data-testid="inner-option">pick</button>}>
        <OpenButton testId="inner-trigger"/>
    </DropdownContainer>
</div>}>
    <OpenButton testId="outer-trigger"/>
</DropdownContainer>);
describe("DropdownContainer nested usage (real @floating-ui/react)", () => {
    it("does not close the outer dropdown when interacting inside a nested dropdown's own floating panel", async () => {
        await render(<NestedScenario />);
        await act(async () => {
            await fireEvent.click(screen.getByTestId("outer-trigger"));
        });
        expect(screen.getByTestId("outer-panel")).toBeTruthy();
        await act(async () => {
            await fireEvent.click(screen.getByTestId("inner-trigger"));
        });
        expect(screen.getByTestId("inner-option")).toBeTruthy();
        // 点击嵌套下拉自身浮层内的选项:即便该浮层因独立 FloatingPortal 而在 DOM 上
        // 只是 outer-panel 的兄弟节点,也不应被外层的 outside-press 判定为"点击外部"。
        await act(async () => {
            await fireEvent(screen.getByTestId("inner-option"), new PointerEvent("pointerdown", { bubbles: true }));
        });
        expect(screen.getByTestId("outer-panel")).toBeTruthy();
        expect(screen.getByTestId("inner-option")).toBeTruthy();
    });
    it("still closes on a genuine outside pointerdown", async () => {
        await render(<NestedScenario />);
        await act(async () => {
            await fireEvent.click(screen.getByTestId("outer-trigger"));
        });
        expect(screen.getByTestId("outer-panel")).toBeTruthy();
        await act(() => {
            document.body.dispatchEvent(new PointerEvent("pointerdown", { bubbles: true }));
        });
        expect(screen.queryByTestId("outer-panel")).toBeNull();
    });
});
