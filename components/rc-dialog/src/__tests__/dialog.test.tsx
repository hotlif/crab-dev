import { act, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

import Dialog, { type DialogProps } from "../dialog";

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

type PartialDialogProps = Partial<DialogProps>;

interface RenderDialogResult {
    container: HTMLDivElement;
    root: Root;
    rerender: (nextProps?: PartialDialogProps) => void;
    unmount: () => void;
    getDialog: () => HTMLDialogElement;
}

const flush = async () => {
    await act(async () => {
        await Promise.resolve();
    });
};

const renderDialog = (props: PartialDialogProps = {}): RenderDialogResult => {
    const container = document.createElement("div");
    document.body.appendChild(container);
    const root = createRoot(container);

    let currentProps: DialogProps = {
        open: false,
        onOpenChange: jest.fn(),
        title: "Dialog Title",
        children: <div>Dialog Content</div>,
        ...props,
    } as DialogProps;

    const doRender = () => {
        act(() => {
            root.render(<Dialog {...currentProps} />);
        });
    };

    doRender();

    return {
        container,
        root,
        rerender: (nextProps = {}) => {
            currentProps = {
                ...currentProps,
                ...nextProps,
            };
            doRender();
        },
        unmount: () => {
            act(() => {
                root.unmount();
            });
            container.remove();
        },
        getDialog: () => container.querySelector("dialog") as HTMLDialogElement,
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

describe("Dialog", () => {
    it("renders title, content and default i18n texts", () => {
        const { container, unmount } = renderDialog();

        expect(container.textContent).toContain("Dialog Title");
        expect(container.textContent).toContain("Dialog Content");
        expect(container.textContent).toContain("取消");
        expect(container.textContent).toContain("确定");

        unmount();
    });

    it("renders custom i18n texts", () => {
        const { container, unmount } = renderDialog({
            i18n: {
                cancelText: "Cancel",
                confirmText: "Confirm",
            },
        });

        expect(container.textContent).toContain("Cancel");
        expect(container.textContent).toContain("Confirm");

        unmount();
    });

    it("calls showModal when open=true and close when open=false", () => {
        const { rerender, unmount } = renderDialog({ open: false });

        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();

        rerender({ open: true });

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

        unmount();
    });

    it("clicking close icon without onCancel closes dialog", () => {
        const onOpenChange = jest.fn();
        const { container, unmount } = renderDialog({ onOpenChange });

        const closeIcon = container.querySelector('svg[data-icon="close"]') as SVGElement;
        const closeButton = closeIcon.parentElement as HTMLElement;

        act(() => {
            closeButton.click();
        });

        expect(onOpenChange).toHaveBeenCalledWith(false);

        unmount();
    });

    it("does not throw when onOpenChange is missing at runtime", () => {
        const { container, unmount } = renderDialog({
            onOpenChange: undefined as unknown as DialogProps["onOpenChange"],
            onCancel: undefined,
        });

        const closeIcon = container.querySelector('svg[data-icon="close"]') as SVGElement;
        const closeButton = closeIcon.parentElement as HTMLElement;

        expect(() => {
            act(() => {
                closeButton.click();
            });
        }).not.toThrow();

        unmount();
    });

    it("clicking cancel button handles onCancel true/false branches", async () => {
        const onOpenChange = jest.fn();
        const onCancel = jest
            .fn<() => Promise<boolean>>()
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true);

        const { container, unmount } = renderDialog({ onOpenChange, onCancel });

        const buttons = container.querySelectorAll("button");
        const cancelButton = buttons[0] as HTMLButtonElement;

        act(() => {
            cancelButton.click();
        });
        await flush();

        expect(onOpenChange).not.toHaveBeenCalled();

        act(() => {
            cancelButton.click();
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);

        unmount();
    });

    it("clicking cancel button ignores rejected onCancel promise", async () => {
        const onOpenChange = jest.fn();
        const onCancel = jest.fn<() => Promise<boolean>>().mockRejectedValue(new Error("cancel failed"));

        const { container, unmount } = renderDialog({ onOpenChange, onCancel });

        const buttons = container.querySelectorAll("button");
        const cancelButton = buttons[0] as HTMLButtonElement;

        act(() => {
            cancelButton.click();
        });
        await flush();

        expect(onCancel).toHaveBeenCalledTimes(1);
        expect(onOpenChange).not.toHaveBeenCalled();

        unmount();
    });

    it("clicking confirm button handles onConfirm true/false branches", async () => {
        const onOpenChange = jest.fn();
        const onConfirm = jest
            .fn<() => Promise<boolean>>()
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true);

        const { container, unmount } = renderDialog({ onOpenChange, onConfirm });

        const buttons = container.querySelectorAll("button");
        const confirmButton = buttons[1] as HTMLButtonElement;

        act(() => {
            confirmButton.click();
        });
        await flush();

        expect(onOpenChange).not.toHaveBeenCalled();

        act(() => {
            confirmButton.click();
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);

        unmount();
    });

    it("clicking confirm button does nothing when onConfirm is missing", () => {
        const onOpenChange = jest.fn();

        const { container, unmount } = renderDialog({
            onOpenChange,
            onConfirm: undefined,
        });

        const buttons = container.querySelectorAll("button");
        const confirmButton = buttons[1] as HTMLButtonElement;

        act(() => {
            confirmButton.click();
        });

        expect(onOpenChange).not.toHaveBeenCalled();

        unmount();
    });

    it("clicking dialog backdrop triggers cancel when click is outside", () => {
        const onOpenChange = jest.fn();
        const { getDialog, unmount } = renderDialog({ onOpenChange });

        const dialog = getDialog();
        Object.defineProperty(dialog, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                left: 100,
                right: 300,
                top: 100,
                bottom: 300,
            }),
        });

        act(() => {
            dialog.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                clientX: 50,
                clientY: 50,
            }));
        });

        expect(onOpenChange).toHaveBeenCalledWith(false);

        unmount();
    });

    it("clicking inside dialog calls onClick handler", () => {
        const onClick = jest.fn();
        const onOpenChange = jest.fn();
        const { getDialog, unmount } = renderDialog({ onClick, onOpenChange });

        const dialog = getDialog();
        Object.defineProperty(dialog, "getBoundingClientRect", {
            configurable: true,
            value: () => ({
                left: 100,
                right: 300,
                top: 100,
                bottom: 300,
            }),
        });

        act(() => {
            dialog.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                clientX: 150,
                clientY: 150,
            }));
        });

        expect(onClick).toHaveBeenCalledTimes(1);
        expect(onOpenChange).not.toHaveBeenCalled();

        unmount();
    });

    it("does nothing when dialog rect is unavailable", () => {
        const onClick = jest.fn();
        const onOpenChange = jest.fn();
        const { getDialog, unmount } = renderDialog({ onClick, onOpenChange });

        const dialog = getDialog();
        Object.defineProperty(dialog, "getBoundingClientRect", {
            configurable: true,
            value: () => undefined,
        });

        act(() => {
            dialog.dispatchEvent(new MouseEvent("click", {
                bubbles: true,
                cancelable: true,
                clientX: 10,
                clientY: 10,
            }));
        });

        expect(onClick).not.toHaveBeenCalled();
        expect(onOpenChange).not.toHaveBeenCalled();

        unmount();
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
            open: false,
            children: <Child />,
        });

        expect(mountCounter.value).toBe(1);
        withReset.rerender({ open: true });
        expect(mountCounter.value).toBe(2);
        withReset.unmount();

        const withoutReset = renderDialog({
            shouldResetContent: false,
            open: false,
            children: <Child />,
        });

        expect(mountCounter.value).toBe(3);
        withoutReset.rerender({ open: true });
        expect(mountCounter.value).toBe(3);
        withoutReset.unmount();
    });
});
