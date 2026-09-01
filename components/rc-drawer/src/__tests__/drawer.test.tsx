import { act, beforeAll, beforeEach, describe, expect, it, mock, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import React from "react";
mock.module("motion/react", async () => {

    const mockReact = await mock.actual<typeof import("react")>("react");
    const MockDiv = mockReact.forwardRef((props: Record<string, unknown>, ref: unknown) => mockReact.createElement("div", { ...props, ref }));
    MockDiv.displayName = "MockMotionDiv";
    return {
        motion: new Proxy({}, {
            get: () => MockDiv,
        }),
        AnimatePresence: ({ children, onExitComplete, }: {
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
let Drawer: (typeof import("../drawer.tsx"))["default"];
beforeAll(async () => {
    const drawerModule = await mock.import<typeof import("../drawer.tsx")>("../drawer.tsx");
    Drawer = drawerModule.default;
});
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
let showModalSpy = mock.fn(function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
});
let closeSpy = mock.fn(function (this: HTMLDialogElement) {
    this.removeAttribute("open");
});
beforeEach(() => {
    showModalSpy = mock.fn(function (this: HTMLDialogElement) {
        this.setAttribute("open", "");
    });
    closeSpy = mock.fn(function (this: HTMLDialogElement) {
        this.removeAttribute("open");
    });
    Object.defineProperty(HTMLDialogElement.prototype, "showModal", {
        configurable: true,
        writable: true,
        value: showModalSpy,
    });
    Object.defineProperty(HTMLDialogElement.prototype, "close", {
        configurable: true,
        writable: true,
        value: closeSpy,
    });
});
describe("Drawer", () => {
    it("renders title and content when open", async () => {
        await render(<Drawer open onOpenChange={() => { }} title="详情">
            <p>Hello world</p>
        </Drawer>);
        expect(screen.getByText("详情")).toBeTruthy();
        expect(screen.getByText("Hello world")).toBeTruthy();
    });
    it("calls showModal when open becomes true", async () => {
        const { rerender } = await render(<Drawer open={false} onOpenChange={() => { }}>
            <p>content</p>
        </Drawer>);
        expect(showModalSpy).not.toHaveBeenCalled();
        await act(async () => {
            await rerender(<Drawer open onOpenChange={() => { }}>
                <p>content</p>
            </Drawer>);
        });
        expect(showModalSpy).toHaveBeenCalledTimes(1);
    });
    it("calls close after exit animation when open becomes false", async () => {
        const { rerender } = await render(<Drawer open onOpenChange={() => { }}>
            <p>content</p>
        </Drawer>);
        await act(async () => {
            await rerender(<Drawer open={false} onOpenChange={() => { }}>
                <p>content</p>
            </Drawer>);
            await Promise.resolve();
        });
        expect(closeSpy).toHaveBeenCalled();
    });
    it("invokes onOpenChange(false) when close button is clicked", async () => {
        const handleOpenChange = mock.fn();
        await render(<Drawer open onOpenChange={handleOpenChange} title="Header">
            <p>content</p>
        </Drawer>);
        await act(async () => {
            await fireEvent.click(screen.getByRole("button", { name: "Close" }));
            await Promise.resolve();
        });
        expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
    it("closes when overlay is clicked and maskClosable is true", async () => {
        const handleOpenChange = mock.fn();
        await render(<Drawer open onOpenChange={handleOpenChange}>
            <p>content</p>
        </Drawer>);
        await act(async () => {
            await fireEvent.click(screen.getByTestId("drawer-overlay"));
            await Promise.resolve();
        });
        expect(handleOpenChange).toHaveBeenCalledWith(false);
    });
    it("does not close when maskClosable is false", async () => {
        const handleOpenChange = mock.fn();
        await render(<Drawer open maskClosable={false} onOpenChange={handleOpenChange}>
            <p>content</p>
        </Drawer>);
        await act(async () => {
            await fireEvent.click(screen.getByTestId("drawer-overlay"));
            await Promise.resolve();
        });
        expect(handleOpenChange).not.toHaveBeenCalled();
    });
    it("does not render close button when closable is false", async () => {
        await render(<Drawer open closable={false} onOpenChange={() => { }} title="x">
            <p>content</p>
        </Drawer>);
        expect(screen.queryByRole("button", { name: "Close" })).toBeNull();
    });
    it("renders footer slot when provided", async () => {
        await render(<Drawer open onOpenChange={() => { }} footer={<span>footer</span>}>
            <p>content</p>
        </Drawer>);
        expect(screen.getByText("footer")).toBeTruthy();
    });
    it("applies placement data attribute", async () => {
        await render(<Drawer open onOpenChange={() => { }} placement="left">
            <p>content</p>
        </Drawer>);
        const panel = screen.getByRole("document");
        expect(panel.getAttribute("data-placement")).toBe("left");
    });
    it("blocks close when onClose resolves false", async () => {
        const handleOpenChange = mock.fn();
        const handleClose = mock.fn(() => false);
        await render(<Drawer open onClose={handleClose} onOpenChange={handleOpenChange}>
            <p>content</p>
        </Drawer>);
        await act(async () => {
            await fireEvent.click(screen.getByTestId("drawer-overlay"));
            await Promise.resolve();
        });
        expect(handleClose).toHaveBeenCalled();
        expect(handleOpenChange).not.toHaveBeenCalled();
    });
});
void React;
