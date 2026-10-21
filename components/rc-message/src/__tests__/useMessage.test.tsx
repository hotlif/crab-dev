import { afterEach, beforeAll, beforeEach, clock, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, render, screen } from "@crab-dev/wake/test/react";
import { createPortal } from "react-dom";
import ConfigProvider from '@crab-dev/rc-config-provider';
import useMessage from "../hooks/useMessage.js";
import type { MessageInstance, MessageHandle } from "../types.js";

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
    it('does not force a local light theme on a body holder without a provider', async () => {
        let api!: MessageInstance;
        function Host() {
            const [instance, content] = useMessage();
            api = instance;
            return createPortal(content, document.body);
        }
        const view = await render(<Host />);
        await act(() => { api.info('Unconfigured message', 0); });
        const holder = screen.getByRole('alert').closest('[popover]');
        expect(holder?.parentElement).toBe(document.body);
        expect(holder?.hasAttribute('data-theme')).toBe(false);
        expect(holder?.hasAttribute('data-crab-design')).toBe(false);
        await view.unmount();
    });
    it('keeps the hook design when its holder is portaled to body', async () => {
        let api!: MessageInstance;
        function Host() {
            const [instance, content] = useMessage();
            api = instance;
            return createPortal(content, document.body);
        }
        const view = await render(<ConfigProvider design="shadcn" theme="dark" brandColor="#6750a4"><Host /></ConfigProvider>);
        await act(() => { api.info('Scoped message', 0); });
        const holder = screen.getByRole('alert').closest('[popover]');
        expect(holder?.parentElement).toBe(document.body);
        expect(holder?.getAttribute('data-crab-design')).toBe('shadcn');
        expect(holder?.getAttribute('data-theme')).toBe('dark');
        expect(holder?.getAttribute('data-crab-brand')).toBeTruthy();
        expect(holder?.querySelector('[data-crab-brand-style]')?.textContent).toContain('--token-semantic-color-brand-primary:');
        await view.rerender(<ConfigProvider design="material" theme="dark" brandColor="#6750a4"><Host /></ConfigProvider>);
        expect(holder?.getAttribute('data-crab-design')).toBe('material');
        await view.unmount();
    });
    it('updates loading in place, restarts the same deadline and ignores expired handles', async () => {
        const { api, view } = await host();
        let handle!: MessageHandle;
        const onClose = mock.fn();
        await act(() => { handle = api.loading('Working', 0); });
        await advance(5000);
        await act(() => handle.update({ type: 'success', content: 'Saved', duration: 1000, onClose }));
        expect(screen.queryByText('Working')).toBeNull();
        expect(screen.getAllByRole('alert').length).toBe(1);
        await advance(600);
        await act(() => api.update(handle.id, { content: 'Done', duration: 1000 }));
        await advance(999);
        expect(screen.getByText('Done')).toBeTruthy();
        expect(onClose).not.toHaveBeenCalled();
        await advance(1);
        expect(onClose).toHaveBeenCalledTimes(1);
        await act(() => { handle.close(); api.close(handle.id); handle.update({ content: 'Too late' }); });
        expect(onClose).toHaveBeenCalledTimes(1);
        expect(screen.queryByText('Too late')).toBeNull();
        await view.unmount();
    });
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
