import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import { usePresence } from '../../usePresence.js';

function Subject({ open, offset = 8, reduced = false, complete }: {
    open: boolean; offset?: number; reduced?: boolean; complete: () => void;
}) {
    const presence = usePresence<HTMLDivElement>(open, complete);
    return presence.present ? <div ref={presence.ref} data-state={presence.state} style={{
        opacity: open ? 1 : 0,
        translate: open ? '0 0' : `0 ${offset}px`,
        transition: reduced ? 'none' : 'opacity 80ms linear, translate 180ms linear',
    }}><span>Content</span></div> : null;
}

const frame = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

async function settle(element: HTMLElement) {
    await act(async () => {
        await Promise.allSettled(element.getAnimations().map(animation => animation.finished));
    });
}

describe('native presence lifecycle', () => {
    it('waits for a replacement exit and ignores an infinite child animation', async () => {
        const complete = mock.fn();
        const view = await render(<Subject open complete={complete} />);
        const element = view.container.firstElementChild as HTMLElement;
        const child = element.firstElementChild!;
        const loop = child.animate([{ opacity: 0.5 }, { opacity: 1 }], { duration: 100, iterations: Infinity });
        try {
            await frame();
            await view.rerender(<Subject open={false} complete={complete} />);
            await frame();
            expect(element.getAnimations().length).toBeGreaterThan(0);
            await view.rerender(<Subject open={false} offset={24} complete={complete} />);
            await frame();
            expect(view.container.firstElementChild).toBe(element);
            expect(complete).not.toHaveBeenCalled();
            await settle(element);
            expect(complete).toHaveBeenCalledTimes(1);
            expect(view.container.firstElementChild).toBeNull();
            expect(loop.playState).not.toBe('finished');
        } finally { loop.cancel(); }
    });

    it('keeps the node on rapid reopening and completes immediately when motion is removed', async () => {
        const complete = mock.fn();
        const view = await render(<Subject open complete={complete} />);
        const element = view.container.firstElementChild as HTMLElement;
        await frame();
        await view.rerender(<Subject open={false} complete={complete} />);
        await frame();
        await view.rerender(<Subject open complete={complete} />);
        await settle(element);
        expect(view.container.firstElementChild).toBe(element);
        expect(complete).not.toHaveBeenCalled();
        await view.rerender(<Subject open={false} complete={complete} />);
        await frame();
        await view.rerender(<Subject open={false} reduced complete={complete} />);
        await settle(element);
        expect(complete).toHaveBeenCalledTimes(1);
        expect(view.container.firstElementChild).toBeNull();
    });
});
