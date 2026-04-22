import React, { act } from "react";
import { afterEach, describe, expect, it, jest } from "@jest/globals";
import { cleanup, fireEvent, render, screen } from "@testing-library/react";

import Drawer from "../drawer.tsx";

jest.mock("motion/react", () => {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, no-undef
    const mockReact = require("react");
    const MockDiv = mockReact.forwardRef(
        (props: Record<string, unknown>, ref: unknown) =>
            mockReact.createElement("div", { ...props, ref }),
    );
    MockDiv.displayName = "MockMotionDiv";
    return {
        motion: new Proxy(
            {},
            {
                get: () => MockDiv,
            },
        ),
        AnimatePresence: ({
            children,
            onExitComplete,
        }: {
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

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

if (!HTMLDialogElement.prototype.showModal) {
    HTMLDialogElement.prototype.showModal = function () {};
}
if (!HTMLDialogElement.prototype.close) {
    HTMLDialogElement.prototype.close = function () {};
}

const showModalSpy = jest
    .spyOn(HTMLDialogElement.prototype, "showModal")
    .mockImplementation(function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
    });

const closeSpy = jest
    .spyOn(HTMLDialogElement.prototype, "close")
    .mockImplementation(function (this: HTMLDialogElement) {
        this.removeAttribute("open");
    });

afterEach(() => {
    cleanup();
    showModalSpy.mockClear();
    closeSpy.mockClear();
});

describe("Drawer", () => {
    it("renders title and content when open", () => {
        render(
            <Drawer open onOpenChange={() => {}} title="详情">
                <p>Hello world</p>
            </Drawer>,
        );
        expect(screen.getByText("详情")).toBeTruthy();
        expect(screen.getByText("Hello world")).toBeTruthy();
    });

    it("calls showModal when open becomes true", () => {
        const { rerender } = render(
            <Drawer open={false} onOpenChange={() => {}}>
                <p>content</p>
            </Drawer>,
        );
        expect(showModalSpy).not.toHaveBeenCalled();
        act(() => {
            rerender(
                <Drawer open onOpenChange={() => {}}>
                    <p>content</p>
                </Drawer>,
            );
        });
        expect(showModalSpy).toHaveBeenCalledTimes(1);
    });

    it("calls close after exit animation when open becomes false", async () => {
        const { rerender } = render(
            <Drawer open onOpenChange={() => {}}>
                <p>content</p>
            </Drawer>,
        );
        await act(async () => {
            rerender(
                <Drawer open={false} onOpenChange={() => {}}>
                    <p>content</p>
                </Drawer>,
            );
            await Promise.resolve();
        });
        expect(closeSpy).toHaveBeenCalled();
    });

    it("invokes onOpenChange(false) when close button is clicked", async () => {
        const handleOpenChange = jest.fn();
        render(
            <Drawer open onOpenChange={handleOpenChange} title="Header">
                <p>content</p>
            </Drawer>,
        );
        await act(async () => {
            fireEvent.click(screen.getByRole("button", { name: "Close" }));
            await Promise.resolve();
        });
        expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it("closes when overlay is clicked and maskClosable is true", async () => {
        const handleOpenChange = jest.fn();
        render(
            <Drawer open onOpenChange={handleOpenChange}>
                <p>content</p>
            </Drawer>,
        );
        await act(async () => {
            fireEvent.click(screen.getByTestId("drawer-overlay"));
            await Promise.resolve();
        });
        expect(handleOpenChange).toHaveBeenCalledWith(false);
    });

    it("does not close when maskClosable is false", async () => {
        const handleOpenChange = jest.fn();
        render(
            <Drawer open maskClosable={false} onOpenChange={handleOpenChange}>
                <p>content</p>
            </Drawer>,
        );
        await act(async () => {
            fireEvent.click(screen.getByTestId("drawer-overlay"));
            await Promise.resolve();
        });
        expect(handleOpenChange).not.toHaveBeenCalled();
    });

    it("does not render close button when closable is false", () => {
        render(
            <Drawer open closable={false} onOpenChange={() => {}} title="x">
                <p>content</p>
            </Drawer>,
        );
        expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    });

    it("renders footer slot when provided", () => {
        render(
            <Drawer open onOpenChange={() => {}} footer={<span>footer</span>}>
                <p>content</p>
            </Drawer>,
        );
        expect(screen.getByText("footer")).toBeTruthy();
    });

    it("applies placement data attribute", () => {
        render(
            <Drawer open onOpenChange={() => {}} placement="left">
                <p>content</p>
            </Drawer>,
        );
        const panel = screen.getByRole("document");
        expect(panel.getAttribute("data-placement")).toBe("left");
    });

    it("blocks close when onClose resolves false", async () => {
        const handleOpenChange = jest.fn();
        const handleClose = jest.fn(() => false);
        render(
            <Drawer open onClose={handleClose} onOpenChange={handleOpenChange}>
                <p>content</p>
            </Drawer>,
        );
        await act(async () => {
            fireEvent.click(screen.getByTestId("drawer-overlay"));
            await Promise.resolve();
        });
        expect(handleClose).toHaveBeenCalled();
        expect(handleOpenChange).not.toHaveBeenCalled();
    });
});

void React;
