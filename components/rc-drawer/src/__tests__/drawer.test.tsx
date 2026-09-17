import { beforeAll, beforeEach, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import React from "react";
const cssExitTestState: { deferExit: boolean; finishExit?: () => void } = { deferExit: false };
let Drawer: (typeof import("../drawer.js"))["default"];
beforeAll(async () => {
    // The DOM runner has no CSS engine: model only native animation completion.
    Object.defineProperty(HTMLElement.prototype, "getAnimations", {
        configurable: true,
        value: () => cssExitTestState.deferExit ? [{
            playState: "running",
            finished: new Promise<void>(resolve => { cssExitTestState.finishExit = resolve; }),
        }] : [],
    });
    const drawerModule = await mock.import<typeof import("../drawer.js")>("../drawer.js");
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
    cssExitTestState.deferExit = false;
    cssExitTestState.finishExit = undefined;
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
    it("names the dialog from its title and preserves an explicit accessible name", async () => {
        const view = await render(<Drawer title="项目详情" open onOpenChange={() => {}}>Content</Drawer>);
        // Wake's DOM role matcher does not infer native dialog names; verify
        // the actual labelling relationship (browser coverage checks its AX name).
        const dialog = view.container.querySelector('dialog')!;
        const titleId = dialog.getAttribute('aria-labelledby');
        expect(dialog.hasAttribute('open')).toBe(true);
        expect(view.container.querySelector(`[id="${titleId}"]`)?.textContent).toBe('项目详情');
        await view.rerender(<Drawer title="项目详情" aria-label="编辑项目" open onOpenChange={() => {}}>Content</Drawer>);
        expect(dialog.getAttribute('aria-label')).toBe('编辑项目');
        expect(dialog.hasAttribute('aria-labelledby')).toBe(false);
    });
    it("keeps background scroll locked through exit and releases it on unmount", async () => {
        cssExitTestState.deferExit = true;
        const view = await render(<Drawer open onOpenChange={() => {}}>Content</Drawer>);
        expect(document.body.style.overflow).toBe("hidden");
        await view.rerender(<Drawer open={false} onOpenChange={() => {}}>Content</Drawer>);
        expect(document.body.style.overflow).toBe("hidden");
        expect(closeSpy).not.toHaveBeenCalled();
        expect(cssExitTestState.finishExit).toBeDefined();
        await act(async () => cssExitTestState.finishExit?.());
        expect(document.body.style.overflow).toBe("");
        expect(closeSpy).toHaveBeenCalled();
        await view.rerender(<Drawer open onOpenChange={() => {}}>Content</Drawer>);
        await view.unmount();
        expect(document.body.style.overflow).toBe("");
    });
    it("renders title and content when open", async () => {
        await render(<Drawer open onOpenChange={() => { }} title="详情">
            <p>Hello world</p>
        </Drawer>);
        expect(screen.getByText("详情")).toBeTruthy();
        expect(screen.getByText("Hello world")).toBeTruthy();
    });
    it("keeps content through exit and ignores a stale exit after reopening", async () => {
        cssExitTestState.deferExit = true;
        const view = await render(<Drawer open onOpenChange={() => {}}>Content</Drawer>);
        const panel = screen.getByRole("document");
        await view.rerender(<Drawer open={false} onOpenChange={() => {}}>Content</Drawer>);
        const finishExit = cssExitTestState.finishExit;
        expect(panel.getAttribute("data-state")).toBe("closed");
        expect(screen.getByText("Content")).toBeTruthy();
        await view.rerender(<Drawer open onOpenChange={() => {}}>Content</Drawer>);
        expect(screen.getByRole("document")).toBe(panel);
        await act(async () => finishExit?.());
        expect(panel.getAttribute("data-state")).toBe("open");
        expect(closeSpy).not.toHaveBeenCalled();
        expect(document.body.style.overflow).toBe("hidden");
        await view.unmount();
    });
    it("resets content only after exiting and mounts it on the next open", async () => {
        cssExitTestState.deferExit = true;
        const view = await render(<Drawer open onOpenChange={() => {}}>Content</Drawer>);
        const previousContent = screen.getByText("Content");
        await view.rerender(<Drawer open={false} onOpenChange={() => {}}>Content</Drawer>);
        expect(screen.getByText("Content")).toBe(previousContent);
        await act(async () => cssExitTestState.finishExit?.());
        expect(screen.queryByText("Content")).toBeNull();
        await view.rerender(<Drawer open onOpenChange={() => {}}>Content</Drawer>);
        expect(screen.getByText("Content")).not.toBe(previousContent);
        await view.unmount();
    });
    it("retains content across closing and reopening when reset is disabled", async () => {
        const view = await render(<Drawer open shouldResetContent={false} onOpenChange={() => {}}>Content</Drawer>);
        const content = screen.getByText("Content");
        await view.rerender(<Drawer open={false} shouldResetContent={false} onOpenChange={() => {}}>Content</Drawer>);
        expect(screen.getByText("Content")).toBe(content);
        await view.rerender(<Drawer open shouldResetContent={false} onOpenChange={() => {}}>Content</Drawer>);
        expect(screen.getByText("Content")).toBe(content);
        await view.unmount();
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
