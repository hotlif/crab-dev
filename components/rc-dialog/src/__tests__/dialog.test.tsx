import { beforeAll, beforeEach, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, render } from "@crab-dev/wake/test/react";
import { useEffect } from "react";
const cssExitTestState: { deferExit: boolean; finishExit?: () => void } = { deferExit: false };
import type { DialogProps } from "../dialog.js";
let Dialog: (typeof import("../dialog.js"))["default"];
beforeAll(async () => {
    // The DOM runner has no CSS engine: model only native animation completion.
    Object.defineProperty(HTMLElement.prototype, "getAnimations", {
        configurable: true,
        value: () => cssExitTestState.deferExit ? [{
            playState: "running",
            finished: new Promise<void>(resolve => { cssExitTestState.finishExit = resolve; }),
        }] : [],
    });
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
    cssExitTestState.deferExit = false;
    cssExitTestState.finishExit = undefined;
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
    it("labels the dialog and exposes a named keyboard close action", async () => {
        const { container, getDialog } = await renderDialog({ open: true });
        const dialog = getDialog();
        const labelledBy = dialog.getAttribute("aria-labelledby");
        expect(labelledBy).toBeTruthy();
        const titleElement = container.querySelector(`[id="${labelledBy}"]`);
        expect(titleElement?.textContent).toBe("Dialog Title");
        const closeIcon = container.querySelector('svg[data-icon="close"]') as SVGElement;
        const closeTrigger = closeIcon.closest("button") as HTMLButtonElement;
        expect(closeTrigger.getAttribute("aria-label")).toBe("取消");
        expect(closeTrigger.tabIndex).toBe(0);
        expect(closeTrigger.closest('[aria-hidden="true"]')).toBe(null);
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
    it("keeps scroll locked until the exit finishes and restores it on unmount", async () => {
        cssExitTestState.deferExit = true;
        const { rerender, unmount } = await renderDialog({ open: true });
        await rerender({ open: false });
        expect(document.body.style.overflow).toBe("hidden");
        expect(HTMLDialogElement.prototype.close).not.toHaveBeenCalled();
        expect(cssExitTestState.finishExit).toBeDefined();
        await act(async () => cssExitTestState.finishExit?.());
        expect(document.body.style.overflow).toBe("");
        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
        await rerender({ open: true });
        expect(document.body.style.overflow).toBe("hidden");
        await unmount();
        expect(document.body.style.overflow).toBe("");
    });
    it("clicking close icon without onCancel closes dialog", async () => {
        const onOpenChange = mock.fn();
        const { container } = await renderDialog({ open: true, onOpenChange });
        const closeIcon = container.querySelector('svg[data-icon="close"]') as SVGElement;
        const closeTrigger = closeIcon.closest("button") as HTMLButtonElement;
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
    it("retains confirm focus and ignores re-entry while onConfirm is pending", async () => {
        let resolveConfirm: (value: boolean) => void = () => { };
        const onOpenChange = mock.fn();
        const onConfirm = mock.fn<() => Promise<boolean>>().implement(() => new Promise<boolean>((resolve) => {
            resolveConfirm = resolve;
        }));
        const { container, getDialog } = await renderDialog({ open: true, onOpenChange, onConfirm });
        await act(() => {
            findButton(container, "确定").focus();
            findButton(container, "确定").click();
        });
        await flush();
        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(findButton(container, "确定").disabled).toBe(false);
        expect(findButton(container, "确定").getAttribute("aria-disabled")).toBe("true");
        expect(document.activeElement).toBe(findButton(container, "确定"));
        await act(() => { findButton(container, "确定").click(); });
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
    it("retains the initiating cancel action while an async cancellation is pending", async () => {
        let resolveCancel: (value: boolean) => void = () => { };
        const onCancel = mock.fn<() => Promise<boolean>>().implement(() => new Promise(resolve => {
            resolveCancel = resolve;
        }));
        const onOpenChange = mock.fn();
        const { container, getDialog } = await renderDialog({ open: true, onCancel, onOpenChange });
        const cancelButton = findButton(container, "取消");
        await act(() => {
            cancelButton.focus();
            cancelButton.click();
            // A second event in the same React batch must not start a second request.
            cancelButton.click();
        });
        await flush();
        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(document.activeElement).toBe(cancelButton);
        expect(cancelButton.disabled).toBe(false);
        expect(cancelButton.getAttribute("aria-busy")).toBe("true");
        expect(findButton(container, "确定").disabled).toBe(true);
        await act(() => resolveCancel(false));
        await flush();
        expect(onOpenChange).not.toHaveBeenCalled();
        expect(cancelButton.getAttribute("aria-busy")).toBe("false");
        expect(document.activeElement).toBe(cancelButton);
        await act(() => {
            findButton(container, "确定").focus();
            getDialog().dispatchEvent(new Event("cancel", { cancelable: true }));
        });
        await flush();
        expect(document.activeElement).toBe(cancelButton);
        expect(cancelButton.getAttribute("aria-busy")).toBe("true");
        await act(() => resolveCancel(false));
        await flush();
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
        expect(mountCounter.value).toBe(3);
        await withoutReset.unmount();
    });
});
