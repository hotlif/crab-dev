import { act, beforeAll, describe, expect, it, mock, render, fireEvent, screen } from "@crab-dev/wake/test/react";
import React from "react";
mock.module("motion/react", async () => {

    const mockReact = await mock.actual<typeof import("react")>("react");
    const MockDiv = mockReact.forwardRef((props: Record<string, unknown>, ref: unknown) => mockReact.createElement("div", { ...props, ref }));
    MockDiv.displayName = "MockMotionDiv";
    return {
        motion: {
            div: MockDiv,
        },
        AnimatePresence: ({ children }: {
            children: unknown;
        }) => children,
    };
});
mock.module("@floating-ui/react", async () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const { createPortal } = require("react-dom");
    return {
        useFloating: (options: {
            open?: boolean;
            onOpenChange?: (open: boolean) => void;
        }) => ({
            refs: {
                setReference: mock.fn(),
                setFloating: mock.fn(),
            },
            floatingStyles: {},
            // 本文件不测试真实的 dismiss 机制(那由 dropdownContainer.nested.test.tsx 覆盖,
            // 使用未 mock 的真实 @floating-ui/react),这里只需把 open/onOpenChange 原样透出，
            // 供 useDismiss 的 mock 读取即可。
            context: { open: options?.open, onOpenChange: options?.onOpenChange },
        }),
        autoUpdate: mock.fn(),
        offset: mock.fn(),
        flip: mock.fn(),
        useDismiss: () => ({}),
        useInteractions: () => ({
            getReferenceProps: (props?: Record<string, unknown>) => props ?? {},
            getFloatingProps: (props?: Record<string, unknown>) => props ?? {},
        }),
        useFloatingNodeId: () => undefined,
        useFloatingParentNodeId: () => null,
        FloatingTree: ({ children }: {
            children: React.ReactNode;
        }) => children,
        FloatingNode: ({ children }: {
            children: React.ReactNode;
        }) => children,
        // 与真实 FloatingPortal 对齐：root === null 表示"等待 root 就绪"，不渲染任何内容；
        // undefined 挂默认 body；指定 root 时 portal 到 root
        FloatingPortal: ({ children, root }: {
            children: React.ReactNode;
            root?: HTMLElement | null;
        }) => (root === null ? null : createPortal(children, root ?? globalThis.document.body)),
    };
});
import type { DropdownContainerProps } from "../index.js";
let DropdownContainer: (typeof import("../index.js"))["default"];
let useDropdownContext: (typeof import("../index.js"))["useDropdownContext"];
let dropdownReducer: (typeof import("../reducer.js"))["dropdownReducer"];
let initialDropdownState: (typeof import("../reducer.js"))["initialDropdownState"];
beforeAll(async () => {
    const indexModule = await mock.import<typeof import("../index.js")>("../index.js");
    const reducerModule = await mock.import<typeof import("../reducer.js")>("../reducer.js");
    DropdownContainer = indexModule.default;
    useDropdownContext = indexModule.useDropdownContext;
    dropdownReducer = reducerModule.dropdownReducer;
    initialDropdownState = reducerModule.initialDropdownState;
});
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
/**
 * A trigger button that uses DropdownContext to open/close the dropdown.
 */
const Trigger = () => {
    const { state, dispatch, refs } = useDropdownContext<HTMLButtonElement>();
    return (<button ref={refs.setReference} data-testid="trigger" onFocus={() => dispatch({ type: "setOpen", payload: true })} onBlur={() => dispatch({ type: "setOpen", payload: false })}>
        {state.open ? "open" : "closed"}
    </button>);
};
const renderDropdown = async (props: Partial<DropdownContainerProps> = {}) => {
    const defaultProps: DropdownContainerProps = {
        overlay: <div data-testid="overlay">Dropdown Content</div>,
        ...props,
    };
    return await render(<DropdownContainer {...defaultProps}>
        <Trigger />
    </DropdownContainer>);
};
describe("DropdownContainer", () => {
    it("renders children", async () => {
        await renderDropdown();
        expect(screen.getByTestId("trigger")).toBeTruthy();
    });
    it("does not render overlay when closed", async () => {
        await renderDropdown();
        expect(screen.queryByTestId("overlay")).toBeNull();
    });
    it("renders overlay when opened via dispatch", async () => {
        await renderDropdown();
        await act(async () => {
            await fireEvent(screen.getByTestId("trigger"), new FocusEvent("focusin", { bubbles: true }));
        });
        expect(screen.getByTestId("trigger").textContent).toBe("open");
        expect(screen.queryByTestId("overlay")).toBeTruthy();
    });
    it("hides overlay when closed via dispatch", async () => {
        await renderDropdown();
        await act(async () => {
            await fireEvent(screen.getByTestId("trigger"), new FocusEvent("focusin", { bubbles: true }));
        });
        expect(screen.queryByTestId("overlay")).toBeTruthy();
        await act(async () => {
            await fireEvent(screen.getByTestId("trigger"), new FocusEvent("focusout", { bubbles: true }));
        });
        expect(screen.getByTestId("trigger").textContent).toBe("closed");
    });
    it("applies className to container", async () => {
        const { container } = await renderDropdown({ className: "custom-class" });
        const wrapper = container.firstElementChild as HTMLElement;
        expect(wrapper.className).toContain("custom-class");
    });
    it("passes restProps to container div", async () => {
        const { container } = await renderDropdown({ "data-testid": "container" } as Record<string, unknown> & Partial<DropdownContainerProps>);
        expect(container.querySelector("[data-testid='container']")).toBeTruthy();
    });
    it("calls floatingContainerProps.onMouseDown and prevents default", async () => {
        const onMouseDown = mock.fn();
        await renderDropdown({
            floatingContainerProps: { onMouseDown },
        });
        await act(async () => {
            await fireEvent(screen.getByTestId("trigger"), new FocusEvent("focusin", { bubbles: true }));
        });
        const floatingWrapper = screen.getByTestId("overlay").parentElement?.parentElement as HTMLElement;
        const preventDefault = mock.fn();
        await act(() => {
            floatingWrapper.dispatchEvent(Object.assign(new MouseEvent("mousedown", { bubbles: true }), {
                preventDefault,
            }));
        });
        expect(onMouseDown).toHaveBeenCalled();
    });
    it("prevents default mousedown on non-control area but allows focusing form controls", async () => {
        await renderDropdown({
            overlay: (<div data-testid="overlay">
                <span data-testid="plain">text</span>
                <input data-testid="field"/>
            </div>),
        });
        await act(async () => {
            await fireEvent(screen.getByTestId("trigger"), new FocusEvent("focusin", { bubbles: true }));
        });
        // 点击浮层空白 / 列表项仍阻止默认(不抢触发器焦点),
        // 点击表单控件必须放行默认行为,否则控件无法通过点击进入编辑态
        const plainEvent = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
        await fireEvent(screen.getByTestId("plain"), plainEvent);
        expect(plainEvent.defaultPrevented).toBe(true);
        const fieldEvent = new MouseEvent("mousedown", { bubbles: true, cancelable: true });
        await fireEvent(screen.getByTestId("field"), fieldEvent);
        expect(fieldEvent.defaultPrevented).toBe(false);
    });
    it("works without floatingContainerProps.onMouseDown", async () => {
        await renderDropdown();
        await act(async () => {
            await fireEvent(screen.getByTestId("trigger"), new FocusEvent("focusin", { bubbles: true }));
        });
        const floatingWrapper = screen.getByTestId("overlay").parentElement?.parentElement as HTMLElement;
        await act(async () => {
            await fireEvent(floatingWrapper, new MouseEvent("mousedown", { bubbles: true }));
        });
    });
    it("renders custom overlay content", async () => {
        await renderDropdown({
            overlay: <span>Custom Overlay</span>,
        });
        await act(async () => {
            await fireEvent(screen.getByTestId("trigger"), new FocusEvent("focusin", { bubbles: true }));
        });
        expect(screen.getByText("Custom Overlay")).toBeTruthy();
    });
    it("portals overlay into the enclosing dialog to escape modal inert", async () => {
        // 模拟在原生 modal <dialog> 中使用下拉组件的场景
        const { container } = await render(<dialog open data-testid="host-dialog">
            <DropdownContainer overlay={<div data-testid="overlay">Dropdown Content</div>}>
                <Trigger />
            </DropdownContainer>
        </dialog>);
        await act(async () => {
            await fireEvent(screen.getByTestId("trigger"), new FocusEvent("focusin", { bubbles: true }));
        });
        const overlay = screen.getByTestId("overlay");
        const dialog = container.querySelector("dialog") as HTMLDialogElement;
        // 浮层必须位于 dialog 子树内，否则会被 showModal 的 inert 机制屏蔽交互
        expect(dialog.contains(overlay)).toBe(true);
    });
    it("does not portal into a dialog when trigger is outside of one", async () => {
        await renderDropdown();
        await act(async () => {
            await fireEvent(screen.getByTestId("trigger"), new FocusEvent("focusin", { bubbles: true }));
        });
        const overlay = screen.getByTestId("overlay");
        expect(overlay.closest("dialog")).toBeNull();
    });
});
describe("useDropdownContext", () => {
    it("throws when used outside DropdownContainer", async () => {
        const ErrorComponent = () => {
            useDropdownContext();
            return null;
        };
        await expect(render(<ErrorComponent />)).rejects.toThrow(
            "useDropdownContext must be used within a DropdownContainer",
        );
    });
});
describe("dropdownReducer", () => {
    it("returns current state for unknown action type", () => {
        const state = dropdownReducer(initialDropdownState, { type: "unknown" } as never);
        expect(state).toEqual(initialDropdownState);
    });
});
