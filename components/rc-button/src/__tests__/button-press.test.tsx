import { afterEach, beforeEach, clock, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import Button from '../button.js';

beforeEach(async () => { await clock.fake(); });
afterEach(async () => { await clock.restore(); });
const advance = (time: number) => act(async () => { await clock.advanceBy(time); });
const hasFeedback = (element: HTMLElement) => element.hasAttribute('data-press-feedback');

describe('Button activation feedback', () => {
    it('keeps synthesized clicks visible without delaying the action or changing toggle semantics', async () => {
        const onClick = mock.fn();
        await render(<Button appearance="primary" onClick={onClick}>Save</Button>);
        const button = screen.getByRole('button', { name: 'Save' });
        // Native Enter/Space and assistive clicks use detail=0.
        await fireEvent.click(button, { detail: 0 });
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(hasFeedback(button)).toBe(true);
        expect(button.hasAttribute('aria-pressed')).toBe(false);
        await advance(224);
        expect(hasFeedback(button)).toBe(true);
        await advance(1);
        expect(hasFeedback(button)).toBe(false);
    });

    it('extends feedback from the latest activation and preserves link events', async () => {
        const onClick = mock.fn();
        await render(<Button href="#settings" onClick={event => {
            event.preventDefault();
            onClick(event.currentTarget);
        }}>Settings</Button>);
        const link = screen.getByRole('link', { name: 'Settings' });
        await fireEvent.click(link, { detail: 0 });
        await advance(200);
        await fireEvent.click(link, { detail: 0 });
        expect(onClick).toHaveBeenCalledTimes(2);
        expect(onClick).toHaveBeenCalledWith(link);
        await advance(25);
        expect(hasFeedback(link)).toBe(true);
        await advance(200);
        expect(hasFeedback(link)).toBe(false);
    });

    it('clears feedback on loading or disabled changes and does not restore stale feedback', async () => {
        const onClick = mock.fn();
        const { rerender } = await render(<Button onClick={onClick}>Save</Button>);
        const button = screen.getByRole('button', { name: 'Save' });
        for (const state of [{ loading: true }, { disabled: true }]) {
            await fireEvent.click(button, { detail: 0 });
            expect(hasFeedback(button)).toBe(true);
            await rerender(<Button {...state} onClick={onClick}>Save</Button>);
            expect(hasFeedback(button)).toBe(false);
            await fireEvent.click(button, { detail: 0 });
            expect(hasFeedback(button)).toBe(false);
            await rerender(<Button onClick={onClick}>Save</Button>);
            expect(hasFeedback(button)).toBe(false);
        }
        expect(onClick).toHaveBeenCalledTimes(2);
        await advance(1000);
        expect(hasFeedback(button)).toBe(false);
    });

    it('leaves pointer presses native and cancels pending feedback when unmounted', async () => {
        const { unmount } = await render(<Button>Save</Button>);
        const button = screen.getByRole('button', { name: 'Save' });
        await fireEvent.click(button, { detail: 1 });
        expect(hasFeedback(button)).toBe(false);
        await fireEvent.click(button, { detail: 0 });
        expect(hasFeedback(button)).toBe(true);
        await unmount();
        await advance(1000);
    });
});
