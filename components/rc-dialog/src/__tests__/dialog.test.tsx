import { act, beforeAll, beforeEach, describe, expect, it, mock, render } from "@crab-dev/wake/test/react";
import React, { useEffect } from "react";
mock.module("motion/react", async () => {

    const mockReact = await mock.actual<typeof import("react")>("react");
    // React 19 下 ref 是普通 prop，直接透传即可，无需 forwardRef
    const MockDiv = (props: Record<string, unknown>) => mockReact.createElement("div", props);
    return {
        motion: {
            div: MockDiv,
        },
        AnimatePresence: ({ children, onExitComplete }: {
            children: unknown;
            onExitComplete?: () => void;
        }) => {
            const prevChildrenRef = mockReact.useRef(children);
            mockReact.useEffect(() => {
                if (prevChildrenRef.current && !children) {
                    onExitComplete?.();
                }
                prevChildrenRef.current = children;
            });
            return children;
        },
    };
});
import type { DialogProps } from "../dialog.js";
let Dialog: (typeof import("../dialog.js"))["default"];
beforeAll(async () => {
    const dialogModule = await mock.import<typeof import("../dialog.js")>("../dialog.js");
    Dialog = dialogModule.default;
});
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
type PartialDialogProps = Partial<DialogProps>;
interface RenderDialogResult {
    container: HTMLDivElement;
    rerender: (nextProps?: PartialDialogProps) => Promise<void>;
    unmount: () => Promise<void>;
    getDialog: () => HTMLDialogElement;
}
const flush = async () => {
    await act(async () => {
        await Promise.resolve();
        await Promise.resolve();
    });
};
const findButton = (container: HTMLElement, text: string): HTMLButtonElement => {
    const buttons = Array.from(container.querySelectorAll("button"));
    const target = buttons.find((button) => button.textContent?.includes(text));
    if (!target) {
        throw new Error(`button not found: ${text}`);
    }
    return target;
};
const renderDialog = async (props: PartialDialogProps = {}): Promise<RenderDialogResult> => {
    let currentProps: DialogProps = {
        open: false,
        onOpenChange: mock.fn(),
        title: "Dialog Title",
        children: <div>Dialog Content</div>,
        ...props,
    } as DialogProps;
    const renderResult = await render(<Dialog {...currentProps}/>);
    const doRender = async () => {
        await act(async () => {
            await renderResult.rerender(<Dialog {...currentProps}/>);
        });
    };
    return {
        container: renderResult.container as HTMLDivElement,
        rerender: async (nextProps = {}) => {
            currentProps = {
                ...currentProps,
                ...nextProps,
            };
            await doRender();
        },
        unmount: async () => {
            await renderResult.unmount();
        },
        getDialog: () => renderResult.container.querySelector("dialog") as HTMLDialogElement,
    };
};
beforeEach(() => {
    if (!HTMLDialogElement.prototype.showModal) {
        HTMLDialogElement.prototype.showModal = () => { };
    }
    if (!HTMLDialogElement.prototype.close) {
        HTMLDialogElement.prototype.close = () => { };
    }
    mock.spyOn(HTMLDialogElement.prototype, "showModal").implement(() => { });
    mock.spyOn(HTMLDialogElement.prototype, "close").implement(() => { });
});
describe("Dialog", () => {
    it("renders title, content and default i18n texts", async () => {
        const { container } = await renderDialog({ open: true });
        expect(container.textContent).toContain("Dialog Title");
        expect(container.textContent).toContain("Dialog Content");
        expect(container.textContent).toContain("取消");
        expect(container.textContent).toContain("确定");
    });
    it("renders custom i18n texts", async () => {
        const { container } = await renderDialog({
            open: true,
            i18n: {
                cancelText: "Cancel",
                confirmText: "Confirm",
            },
        });
        expect(container.textContent).toContain("Cancel");
        expect(container.textContent).toContain("Confirm");
    });
    it("keeps default texts when i18n is partially provided", async () => {
        const { container } = await renderDialog({
            open: true,
            i18n: {
                confirmText: "OK",
            },
        });
        expect(container.textContent).toContain("OK");
        expect(container.textContent).toContain("取消");
    });
    it("labels the dialog with the title and hides the close icon from a11y tree", async () => {
        const { container, getDialog } = await renderDialog({ open: true });
        const dialog = getDialog();
        const labelledBy = dialog.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();
        const titleElement = container.querySelector(`[id="${labelledBy}"]`);
        expect(titleElement?.textContent).toBe("Dialog Title");
        // 关闭图标不可聚焦且对读屏隐藏，等效关闭路径为 ESC / 取消按钮
        const closeIcon = container.querySelector('svg[data-icon="close"]') as SVGElement;
        const closeTrigger = closeIcon.parentElement as HTMLElement;
        expect(closeTrigger.tagName).not.toBe("BUTTON");
        expect(closeTrigger.getAttribute("aria-hidden")).toBe("true");
    });
    it("exposes the dialog element through the ref prop", async () => {
        const refCallback = mock.fn();
        const { getDialog, unmount } = await renderDialog({
            open: true,
            ref: refCallback,
        } as PartialDialogProps);
        expect(refCallback).toHaveBeenCalledWith(getDialog());
        await unmount();
        expect(refCallback).toHaveBeenLastCalledWith(null);
    });
    it("calls showModal when open=true and close via onExitComplete when open=false", async () => {
        const { rerender } = await renderDialog({ open: true });
        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();
        await rerender({ open: false });
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });
    it("locks body scroll while open and restores it after close", async () => {
        const { rerender } = await renderDialog({ open: true });
        expect(document.body.style.overflow).toBe("hidden");
        await rerender({ open: false });
        expect(document.body.style.overflow).toBe("");
    });
    it("clicking close icon without onCancel closes dialog", async () => {
        const onOpenChange = mock.fn();
        const { container } = await renderDialog({ open: true, onOpenChange });
        const closeIcon = container.querySelector('svg[data-icon="close"]') as SVGElement;
        const closeTrigger = closeIcon.parentElement as HTMLElement;
        await act(() => {
            closeTrigger.click();
        });
        await flush();
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    it("clicking cancel button handles onCancel true/false branches", async () => {
        const onOpenChange = mock.fn();
        const onCancel = mock.fn<() => Promise<boolean>>()
            .resolveOnce(false)
            .resolveOnce(true);
        const { container } = await renderDialog({ open: true, onOpenChange, onCancel });
        await act(() => {
            findButton(container, "取消").click();
        });
        await flush();
        expect(onOpenChange).not.toHaveBeenCalled();
        await act(() => {
            findButton(container, "取消").click();
        });
        await flush();
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    it("clicking confirm button handles onConfirm true/false branches", async () => {
        const onOpenChange = mock.fn();
        const onConfirm = mock.fn<() => Promise<boolean>>()
            .resolveOnce(false)
            .resolveOnce(true);
        const { container } = await renderDialog({ open: true, onOpenChange, onConfirm });
        await act(() => {
            findButton(container, "确定").click();
        });
        await flush();
        expect(onOpenChange).not.toHaveBeenCalled();
        await act(() => {
            findButton(container, "确定").click();
        });
        await flush();
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    it("clicking confirm button does nothing when onConfirm is missing", async () => {
        const onOpenChange = mock.fn();
        const { container } = await renderDialog({
            open: true,
            onOpenChange,
            onConfirm: undefined,
        });
        await act(() => {
            findButton(container, "确定").click();
        });
        await flush();
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    it("disables footer buttons and ignores re-entry while onConfirm is pending", async () => {
        let resolveConfirm: (value: boolean) => void = () => { };
        const onOpenChange = mock.fn();
        const onConfirm = mock.fn<() => Promise<boolean>>().implement(() => new Promise<boolean>((resolve) => {
            resolveConfirm = resolve;
        }));
        const { container, getDialog } = await renderDialog({ open: true, onOpenChange, onConfirm });
        await act(() => {
            findButton(container, "确定").click();
        });
        await flush();
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(findButton(container, "确定").disabled).toBe(true);
        expect(findButton(container, "取消").disabled).toBe(true);
        // pending 期间 ESC（原生 cancel）也应被忽略
        await act(() => {
            getDialog().dispatchEvent(new Event("cancel", { bubbles: false, cancelable: true }));
        });
        await flush();
        expect(onOpenChange).not.toHaveBeenCalled();
        await act(() => {
            resolveConfirm(true);
        });
        await flush();
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });
    it("pressing ESC (native cancel) is intercepted and routed through onOpenChange", async () => {
        const onOpenChange = mock.fn();
        const { getDialog } = await renderDialog({ open: true, onOpenChange });
        const dialog = getDialog();
        const cancelEvent = new Event("cancel", { bubbles: false, cancelable: true });
        await act(() => {
            dialog.dispatchEvent(cancelEvent);
        });
        await flush();
        // 原生关闭被拦截，改走受控关闭；否则 open 会与 DOM 失步、无法再次打开
        expect(cancelEvent.defaultPrevented).toBe(true);
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    it("pressing ESC respects onCancel returning false", async () => {
        const onOpenChange = mock.fn();
        const onCancel = mock.fn<() => Promise<boolean>>().resolve(false);
        const { getDialog } = await renderDialog({ open: true, onOpenChange, onCancel });
        await act(() => {
            getDialog().dispatchEvent(new Event("cancel", { bubbles: false, cancelable: true }));
        });
        await flush();
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onOpenChange).not.toHaveBeenCalled();
    });
    it("syncs controlled state when the dialog is force-closed (native close)", async () => {
        const onOpenChange = mock.fn();
        const { getDialog } = await renderDialog({ open: true, onOpenChange });
        // Chrome 连续第二次 ESC 会强制关闭且不可 preventDefault，只会触发 close 事件
        await act(() => {
            getDialog().dispatchEvent(new Event("close", { bubbles: false }));
        });
        await flush();
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });
    it("clicking overlay does NOT close by default (maskClosable=false)", async () => {
        const onClick = mock.fn();
        const onOpenChange = mock.fn();
        const onCancel = mock.fn<() => Promise<boolean>>().resolve(true);
        const { getDialog } = await renderDialog({ open: true, onClick, onOpenChange, onCancel });
        const overlay = getDialog().firstElementChild as HTMLElement;
        await act(() => {
            overlay.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        });
        await flush();
        expect(onCancel).not.toHaveBeenCalled();
        expect(onOpenChange).not.toHaveBeenCalled();
        // 遮罩点击也不应冒泡触发透传给 <dialog> 的 onClick
        expect(onClick).not.toHaveBeenCalled();
    });
    it("clicking overlay triggers cancel when maskClosable is true", async () => {
        const onClick = mock.fn();
        const onOpenChange = mock.fn();
        const { getDialog } = await renderDialog({
            open: true,
            onClick,
            onOpenChange,
            maskClosable: true,
        });
        const overlay = getDialog().firstElementChild as HTMLElement;
        await act(() => {
            overlay.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        });
        await flush();
        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onClick).not.toHaveBeenCalled();
    });
    it("clicking dialog content fires pass-through onClick without closing", async () => {
        const onClick = mock.fn();
        const onOpenChange = mock.fn();
        const { getDialog } = await renderDialog({ open: true, onClick, onOpenChange });
        const content = getDialog().children[1] as HTMLElement;
        await act(() => {
            content.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        });
        await flush();
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onOpenChange).not.toHaveBeenCalled();
    });
    it("resets content when shouldResetContent is true and keeps content when false", async () => {
        const mountCounter = {
            value: 0,
        };
        const Child = () => {
            useEffect(() => {
                mountCounter.value += 1;
            }, []);
            return <div>Counter Child</div>;
        };
        const withReset = await renderDialog({
            shouldResetContent: true,
            open: true,
            children: <Child />,
        });
        expect(mountCounter.value).toBe(1);
        await withReset.rerender({ open: false });
        await withReset.rerender({ open: true });
        expect(mountCounter.value).toBe(2);
        await withReset.unmount();
        const withoutReset = await renderDialog({
            shouldResetContent: false,
            open: true,
            children: <Child />,
        });
        expect(mountCounter.value).toBe(3);
        await withoutReset.rerender({ open: false });
        await withoutReset.rerender({ open: true });
        expect(mountCounter.value).toBe(4);
        await withoutReset.unmount();
    });
});
