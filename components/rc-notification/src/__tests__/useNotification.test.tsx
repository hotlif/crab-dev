import { afterEach, beforeAll, beforeEach, clock, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, fireEvent, render, screen } from "@crab-dev/wake/test/react";
import useNotification from "../hooks/useNotification.js";
import type { NotificationHandle } from '../types.js';

beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "showPopover", { configurable: true, value: () => {} });
});
beforeEach(async () => { await clock.fake(); });
afterEach(async () => { await clock.restore(); });
const advance = (time: number) => act(async () => { await clock.advanceBy(time); });

describe("notification deadlines", () => {
    it('updates a persistent notification and closes its handle exactly once', async () => {
        let api!: ReturnType<typeof useNotification>[0];
        let handle!: NotificationHandle;
        const onClose = mock.fn();
        function Host() { const [instance, content] = useNotification(); api = instance; return <>{content}</>; }
        const view = await render(<Host />);
        await act(() => { handle = api.open({ title: 'Working', description: 'Pending', duration: 0, onClose }); });
        await advance(5000);
        await act(() => handle.update({ title: 'Done', description: 'Saved', duration: 1000 }));
        expect(screen.getByText('Done')).toBeTruthy();
        expect(screen.queryByText('Working')).toBeNull();
        await advance(500);
        await act(() => { api.close(handle.id); handle.close(); handle.update({ title: 'Too late' }); });
        await advance(1000);
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Done')).toBeNull();
        expect(screen.queryByText('Too late')).toBeNull();
        await view.unmount();
    });
    it("keeps covered notifications inert and promotes the queue when the front closes", async () => {
        let api!: ReturnType<typeof useNotification>[0];
        function Host() {
            const [instance, content] = useNotification();
            api = instance;
            return <>{content}</>;
        }
        const view = await render(<Host />);
        await act(async () => {
            for (let index = 1; index <= 4; index += 1) {
                api.open({ title: `Notification ${index}`, description: `Body ${index}`, duration: 0 });
            }
        });
        expect(screen.queryByText("Notification 1")).toBeNull();
        expect(view.container.querySelectorAll('[data-stack]').length).toBe(3);
        for (const covered of view.container.querySelectorAll('[data-stack="2"], [data-stack="3"]')) {
            expect(covered.hasAttribute("inert")).toBe(true);
            expect(covered.getAttribute("aria-hidden")).toBe("true");
        }
        const front = view.container.querySelector('[data-stack="1"]')!;
        expect(front.textContent).toContain("Notification 4");
        expect(front.hasAttribute("inert")).toBe(false);
        await fireEvent.click(front.querySelector('button')!);
        const promoted = view.container.querySelector('[data-stack="1"]')!;
        expect(promoted.textContent).toContain("Notification 3");
        expect(promoted.hasAttribute("inert")).toBe(false);
        expect(promoted.hasAttribute("aria-hidden")).toBe(false);
        expect(screen.getByText("Notification 1")).toBeTruthy();
        expect(view.container.querySelectorAll('[data-stack]').length).toBe(3);
        await view.unmount();
    });
    it("times directions independently and pauses while a close action has keyboard focus", async () => {
        let api!: ReturnType<typeof useNotification>[0];
        function Host() {
            const [instance, content] = useNotification();
            api = instance;
            return <>{content}</>;
        }
        const view = await render(<Host />);
        await act(async () => {
            api.open({ title: "Left", description: "Left body", direction: "topLeft", duration: 1000 });
            api.open({ title: "Right", description: "Right body", direction: "bottomRight", duration: 1000 });
        });
        await advance(400);
        const close = screen.getAllByRole("button", { name: "关闭通知" })[0]!;
        await act(async () => { close.dispatchEvent(new FocusEvent("focusin", { bubbles: true })); });
        await advance(600);
        expect(screen.queryByText("Right")).toBeNull();
        expect(screen.getByText("Left")).toBeTruthy();
        await advance(1000);
        await act(async () => { close.dispatchEvent(new FocusEvent("focusout", { bubbles: true })); });
        await advance(599);
        expect(screen.getByText("Left")).toBeTruthy();
        await advance(1);
        expect(screen.queryByText("Left")).toBeNull();
        await view.unmount();
    });
});
