import { afterEach, beforeAll, beforeEach, clock, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, render, screen } from "@crab-dev/wake/test/react";
import useMessage from "../hooks/useMessage.js";
import type { MessageInstance } from "../types.js";

beforeAll(() => {
    Object.defineProperty(HTMLElement.prototype, "showPopover", { configurable: true, value: () => {} });
});
beforeEach(async () => { await clock.fake(); });
afterEach(async () => { await clock.restore(); });
const advance = (time: number) => act(async () => { await clock.advanceBy(time); });

async function host() {
    let api!: MessageInstance;
    function Host() {
        const [instance, content] = useMessage();
        api = instance;
        return <>{content}</>;
    }
    const view = await render(<Host />);
    return { api, view };
}

describe("useMessage CSS lifecycle", () => {
    it("pauses on hover and resumes the remaining deadline once", async () => {
        const { api, view } = await host();
        const onClose = mock.fn();
        await act(async () => api.open({ content: "Timed", duration: 1000, onClose }));
        await advance(400);
        await act(async () => { screen.getByRole("alert").dispatchEvent(new MouseEvent("mouseover", { bubbles: true })); });
        await advance(2000);
        expect(screen.getByText("Timed")).toBeTruthy();
        await act(async () => { screen.getByRole("alert").dispatchEvent(new MouseEvent("mouseout", { bubbles: true })); });
        await advance(599);
        expect(onClose).not.toHaveBeenCalled();
        await advance(1);
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(screen.queryByText("Timed")).toBeNull();
        await view.unmount();
    });

    it("pauses older stacked messages, keeps duration zero and clears timers on unmount", async () => {
        const { api, view } = await host();
        const firstClose = mock.fn();
        await act(async () => api.open({ content: "First", duration: 1000, onClose: firstClose }));
        await advance(400);
        await act(async () => api.info("Second", 1000));
        await advance(1000);
        expect(screen.queryByText("Second")).toBeNull();
        expect(firstClose).not.toHaveBeenCalled();
        await advance(599);
        expect(firstClose).not.toHaveBeenCalled();
        await advance(1);
        expect(firstClose).toHaveBeenCalledTimes(1);
        await act(async () => api.info("Persistent", 0));
        await advance(5000);
        expect(screen.getByText("Persistent")).toBeTruthy();
        expect(view.container.querySelector('[data-paused]')).toBeNull();
        const onClose = mock.fn();
        await act(async () => api.open({ content: "Unmounted", duration: 100, onClose }));
        await view.unmount();
        await advance(1000);
        expect(onClose).not.toHaveBeenCalled();
    });
});
