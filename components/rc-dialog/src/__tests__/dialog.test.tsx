import React, { act, useEffect } from "react";
import { cleanup, render } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, jest } from "@jest/globals";

import Dialog, { type DialogProps } from "../dialog.js";

jest.mock("motion/react", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const mockReact = require("react");
    // React 19 下 ref 是普通 prop，直接透传即可，无需 forwardRef
    const MockDiv = (props: Record<string, unknown>) => mockReact.createElement("div", props);
    return {
        motion: {
            div: MockDiv,
        },
        AnimatePresence: ({ children, onExitComplete }: { children: unknown; onExitComplete?: () => void }) => {
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

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type PartialDialogProps = Partial<DialogProps>;

interface RenderDialogResult {
    container: HTMLDivElement;
    rerender: (nextProps?: PartialDialogProps) => void;
    unmount: () => void;
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

const renderDialog = (props: PartialDialogProps = {}): RenderDialogResult => {
    let currentProps: DialogProps = {
        open: false,
        onOpenChange: jest.fn(),
        title: "Dialog Title",
        children: <div>Dialog Content</div>,
        ...props,
    } as DialogProps;

    const renderResult = render(<Dialog {...currentProps} />);

    const doRender = () => {
        act(() => {
            renderResult.rerender(<Dialog {...currentProps} />);
        });
    };

    return {
        container: renderResult.container as HTMLDivElement,
        rerender: (nextProps = {}) => {
            currentProps = {
                ...currentProps,
                ...nextProps,
            };
            doRender();
        },
        unmount: () => {
            renderResult.unmount();
        },
        getDialog: () => renderResult.container.querySelector("dialog") as HTMLDialogElement,
    };
};

beforeEach(() => {
    if (!HTMLDialogElement.prototype.showModal) {
        HTMLDialogElement.prototype.showModal = () => {};
    }
    if (!HTMLDialogElement.prototype.close) {
        HTMLDialogElement.prototype.close = () => {};
    }
    jest.spyOn(HTMLDialogElement.prototype, "showModal").mockImplementation(() => {});
    jest.spyOn(HTMLDialogElement.prototype, "close").mockImplementation(() => {});
});

afterEach(() => {
    cleanup();
});

describe("Dialog", () => {
    it("renders title, content and default i18n texts", () => {
        const { container } = renderDialog({ open: true });

        expect(container.textContent).toContain("Dialog Title");
        expect(container.textContent).toContain("Dialog Content");
        expect(container.textContent).toContain("取消");
        expect(container.textContent).toContain("确定");
    });

    it("renders custom i18n texts", () => {
        const { container } = renderDialog({
            open: true,
            i18n: {
                cancelText: "Cancel",
                confirmText: "Confirm",
            },
        });

        expect(container.textContent).toContain("Cancel");
        expect(container.textContent).toContain("Confirm");
    });

    it("keeps default texts when i18n is partially provided", () => {
        const { container } = renderDialog({
            open: true,
            i18n: {
                confirmText: "OK",
            },
        });

        expect(container.textContent).toContain("OK");
        expect(container.textContent).toContain("取消");
    });

    it("labels the dialog with the title and hides the close icon from a11y tree", () => {
        const { container, getDialog } = renderDialog({ open: true });

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

    it("exposes the dialog element through the ref prop", () => {
        const refCallback = jest.fn();
        const { getDialog, unmount } = renderDialog({
            open: true,
            ref: refCallback,
        } as PartialDialogProps);

        expect(refCallback).toHaveBeenCalledWith(getDialog());

        unmount();
        expect(refCallback).toHaveBeenLastCalledWith(null);
    });

    it("calls showModal when open=true and close via onExitComplete when open=false", () => {
        const { rerender } = renderDialog({ open: true });

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

        rerender({ open: false });

        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();
    });

    it("locks body scroll while open and restores it after close", () => {
        const { rerender } = renderDialog({ open: true });

        expect(document.body.style.overflow).toBe("hidden");

        rerender({ open: false });

        expect(document.body.style.overflow).toBe("");
    });

    it("clicking close icon without onCancel closes dialog", async () => {
        const onOpenChange = jest.fn();
        const { container } = renderDialog({ open: true, onOpenChange });

        const closeIcon = container.querySelector('svg[data-icon="close"]') as SVGElement;
        const closeTrigger = closeIcon.parentElement as HTMLElement;

        act(() => {
            closeTrigger.click();
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("clicking cancel button handles onCancel true/false branches", async () => {
        const onOpenChange = jest.fn();
        const onCancel = jest
            .fn<() => Promise<boolean>>()
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true);

        const { container } = renderDialog({ open: true, onOpenChange, onCancel });

        act(() => {
            findButton(container, "取消").click();
        });
        await flush();

        expect(onOpenChange).not.toHaveBeenCalled();

        act(() => {
            findButton(container, "取消").click();
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("clicking confirm button handles onConfirm true/false branches", async () => {
        const onOpenChange = jest.fn();
        const onConfirm = jest
            .fn<() => Promise<boolean>>()
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true);

        const { container } = renderDialog({ open: true, onOpenChange, onConfirm });

        act(() => {
            findButton(container, "确定").click();
        });
        await flush();

        expect(onOpenChange).not.toHaveBeenCalled();

        act(() => {
            findButton(container, "确定").click();
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("clicking confirm button does nothing when onConfirm is missing", async () => {
        const onOpenChange = jest.fn();

        const { container } = renderDialog({
            open: true,
            onOpenChange,
            onConfirm: undefined,
        });

        act(() => {
            findButton(container, "确定").click();
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("disables footer buttons and ignores re-entry while onConfirm is pending", async () => {
        let resolveConfirm: (value: boolean) => void = () => {};
        const onOpenChange = jest.fn();
        const onConfirm = jest.fn<() => Promise<boolean>>().mockImplementation(
            () => new Promise<boolean>((resolve) => {
                resolveConfirm = resolve;
            }),
        );

        const { container, getDialog } = renderDialog({ open: true, onOpenChange, onConfirm });

        act(() => {
            findButton(container, "确定").click();
        });
        await flush();

        expect(onConfirm).toHaveBeenCalledTimes(1);
        expect(findButton(container, "确定").disabled).toBe(true);
        expect(findButton(container, "取消").disabled).toBe(true);

        // pending 期间 ESC（原生 cancel）也应被忽略
        act(() => {
            getDialog().dispatchEvent(new Event("cancel", { bubbles: false, cancelable: true }));
        });
        await flush();
        expect(onOpenChange).not.toHaveBeenCalled();

        act(() => {
            resolveConfirm(true);
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onConfirm).toHaveBeenCalledTimes(1);
    });

    it("pressing ESC (native cancel) is intercepted and routed through onOpenChange", async () => {
        const onOpenChange = jest.fn();
        const { getDialog } = renderDialog({ open: true, onOpenChange });

        const dialog = getDialog();
        const cancelEvent = new Event("cancel", { bubbles: false, cancelable: true });

        act(() => {
            dialog.dispatchEvent(cancelEvent);
        });
        await flush();

        // 原生关闭被拦截，改走受控关闭；否则 open 会与 DOM 失步、无法再次打开
        expect(cancelEvent.defaultPrevented).toBe(true);
        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("pressing ESC respects onCancel returning false", async () => {
        const onOpenChange = jest.fn();
        const onCancel = jest.fn<() => Promise<boolean>>().mockResolvedValue(false);
        const { getDialog } = renderDialog({ open: true, onOpenChange, onCancel });

        act(() => {
            getDialog().dispatchEvent(new Event("cancel", { bubbles: false, cancelable: true }));
        });
        await flush();

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("syncs controlled state when the dialog is force-closed (native close)", async () => {
        const onOpenChange = jest.fn();
        const { getDialog } = renderDialog({ open: true, onOpenChange });

        // Chrome 连续第二次 ESC 会强制关闭且不可 preventDefault，只会触发 close 事件
        act(() => {
            getDialog().dispatchEvent(new Event("close", { bubbles: false }));
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);
    });

    it("clicking overlay does NOT close by default (maskClosable=false)", async () => {
        const onClick = jest.fn();
        const onOpenChange = jest.fn();
        const onCancel = jest.fn<() => Promise<boolean>>().mockResolvedValue(true);
        const { getDialog } = renderDialog({ open: true, onClick, onOpenChange, onCancel });

        const overlay = getDialog().firstElementChild as HTMLElement;

        act(() => {
            overlay.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        });
        await flush();

        expect(onCancel).not.toHaveBeenCalled();
        expect(onOpenChange).not.toHaveBeenCalled();
        // 遮罩点击也不应冒泡触发透传给 <dialog> 的 onClick
        expect(onClick).not.toHaveBeenCalled();
    });

    it("clicking overlay triggers cancel when maskClosable is true", async () => {
        const onClick = jest.fn();
        const onOpenChange = jest.fn();
        const { getDialog } = renderDialog({
            open: true,
            onClick,
            onOpenChange,
            maskClosable: true,
        });

        const overlay = getDialog().firstElementChild as HTMLElement;

        act(() => {
            overlay.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);
        expect(onClick).not.toHaveBeenCalled();
    });

    it("clicking dialog content fires pass-through onClick without closing", async () => {
        const onClick = jest.fn();
        const onOpenChange = jest.fn();
        const { getDialog } = renderDialog({ open: true, onClick, onOpenChange });

        const content = getDialog().children[1] as HTMLElement;

        act(() => {
            content.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
        });
        await flush();

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onOpenChange).not.toHaveBeenCalled();
    });

    it("resets content when shouldResetContent is true and keeps content when false", () => {
        const mountCounter = {
            value: 0,
        };

        const Child = () => {
            useEffect(() => {
                mountCounter.value += 1;
            }, []);
            return <div>Counter Child</div>;
        };

        const withReset = renderDialog({
            shouldResetContent: true,
            open: true,
            children: <Child />,
        });

        expect(mountCounter.value).toBe(1);

        withReset.rerender({ open: false });
        withReset.rerender({ open: true });
        expect(mountCounter.value).toBe(2);
        withReset.unmount();

        const withoutReset = renderDialog({
            shouldResetContent: false,
            open: true,
            children: <Child />,
        });

        expect(mountCounter.value).toBe(3);
        withoutReset.rerender({ open: false });
        withoutReset.rerender({ open: true });
        expect(mountCounter.value).toBe(4);
        withoutReset.unmount();
    });
});
