import React, { act, useEffect } from "react";
import { render } from "@testing-library/react";
import { describe, expect, it, jest, beforeEach } from "@jest/globals";

import Dialog, { type DialogProps } from "../dialog.tsx";

jest.mock("motion/react", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const mockReact = require("react");
    const MockDiv = mockReact.forwardRef((props: Record<string, unknown>, ref: unknown) => mockReact.createElement("div", { ...props, ref }));
    MockDiv.displayName = "MockMotionDiv";
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
    });
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

describe("Dialog", () => {
    it("renders title, content and default i18n texts", () => {
        const { container, unmount } = renderDialog({ open: true });

        expect(container.textContent).toContain("Dialog Title");
        expect(container.textContent).toContain("Dialog Content");
        expect(container.textContent).toContain("取消");
        expect(container.textContent).toContain("确定");

        unmount();
    });

    it("renders custom i18n texts", () => {
        const { container, unmount } = renderDialog({
            open: true,
            i18n: {
                cancelText: "Cancel",
                confirmText: "Confirm",
            },
        });

        expect(container.textContent).toContain("Cancel");
        expect(container.textContent).toContain("Confirm");

        unmount();
    });

    it("calls showModal when open=true and close via onExitComplete when open=false", () => {
        const { rerender, unmount } = renderDialog({ open: true });

        expect(HTMLDialogElement.prototype.showModal).toHaveBeenCalled();

        rerender({ open: false });

        expect(HTMLDialogElement.prototype.close).toHaveBeenCalled();

        unmount();
    });

    it("clicking close icon without onCancel closes dialog", async () => {
        const onOpenChange = jest.fn();
        const { container, unmount } = renderDialog({ open: true, onOpenChange });

        const closeIcon = container.querySelector('svg[data-icon="close"]') as SVGElement;
        const closeButton = closeIcon.parentElement as HTMLElement;

        act(() => {
            closeButton.click();
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);

        unmount();
    });

    it("clicking cancel button handles onCancel true/false branches", async () => {
        const onOpenChange = jest.fn();
        const onCancel = jest
            .fn<() => Promise<boolean>>()
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true);

        const { container, unmount } = renderDialog({ open: true, onOpenChange, onCancel });

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

    it("clicking confirm button handles onConfirm true/false branches", async () => {
        const onOpenChange = jest.fn();
        const onConfirm = jest
            .fn<() => Promise<boolean>>()
            .mockResolvedValueOnce(false)
            .mockResolvedValueOnce(true);

        const { container, unmount } = renderDialog({ open: true, onOpenChange, onConfirm });

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

    it("clicking confirm button does nothing when onConfirm is missing", async () => {
        const onOpenChange = jest.fn();

        const { container, unmount } = renderDialog({
            open: true,
            onOpenChange,
            onConfirm: undefined,
        });

        const buttons = container.querySelectorAll("button");
        const confirmButton = buttons[1] as HTMLButtonElement;

        act(() => {
            confirmButton.click();
        });
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);

        unmount();
    });

    it("clicking dialog backdrop triggers cancel when click is outside", async () => {
        const onOpenChange = jest.fn();
        const { getDialog, unmount } = renderDialog({ open: true, onOpenChange });

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
        await flush();

        expect(onOpenChange).toHaveBeenCalledWith(false);

        unmount();
    });

    it("clicking inside dialog calls onClick handler", () => {
        const onClick = jest.fn();
        const onOpenChange = jest.fn();
        const { getDialog, unmount } = renderDialog({ open: true, onClick, onOpenChange });

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
        const { getDialog, unmount } = renderDialog({ open: true, onClick, onOpenChange });

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
