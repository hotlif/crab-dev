import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render, userEvent } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import DropdownContainer, { useDropdownContext } from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

function Trigger({ name }: { name: string }) {
    const { refs, dispatch, state } = useDropdownContext<HTMLDivElement>();
    return <div ref={refs.setReference}>
        <input aria-label={name} aria-haspopup="dialog" aria-expanded={state.open}
            onFocus={() => dispatch({ type: 'setOpen', payload: true })} />
        <button type="button" aria-label={`${name} action`}>Open</button>
    </div>;
}

const settle = () => act(async () => {
    // Observe normal browser commits/positioning, without finishing animations,
    // setting reduced motion or synthesizing destination focus events.
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});
function required<T extends HTMLElement>(selector: string): T {
    const element = document.querySelector<T>(selector);
    if (!element) throw new Error(`Missing published focus fixture: ${selector}`);
    return element;
}
async function release(view: { unmount: () => void | Promise<void> }) {
    await act(async () => { await view.unmount(); });
    await settle();
}

describe('Published Dropdown native Tab and Escape', () => {
    it('keeps native Tab inside descendant portals and only escapes the topmost branch', async () => {
        const outerChange = mock.fn();
        const innerChange = mock.fn();
        const view = await render(<ConfigProvider><style>{compiledCss}</style>
            <button data-testid="before">Before</button>
            <DropdownContainer closeOnFocusOut onOpenChange={outerChange} overlay={<div role="dialog" aria-label="Outer panel">
                <DropdownContainer closeOnFocusOut onOpenChange={innerChange} overlay={<div role="dialog" aria-label="Inner panel">
                    <button data-testid="inner-action">Inner action</button>
                </div>}><Trigger name="Inner" /></DropdownContainer>
            </div>}><Trigger name="Outer" /></DropdownContainer>
        </ConfigProvider>);
        try {
            const user = userEvent.setup();
            await act(() => required('[data-testid="before"]').focus());
            await act(() => user.tab());
            await settle();
            const outer = required<HTMLInputElement>('input[aria-label="Outer"]');
            for (let step = 0; step < 12 && !(document.activeElement instanceof HTMLElement && document.activeElement.matches('[data-testid="inner-action"]')); step += 1) {
                await act(() => user.tab());
                await settle();
                expect(outer.getAttribute('aria-expanded')).toBe('true');
            }
            expect(document.activeElement).toBe(required('[data-testid="inner-action"]'));
            const inner = required<HTMLInputElement>('input[aria-label="Inner"]');
            expect(inner.getAttribute('aria-expanded')).toBe('true');
            expect(outerChange).toHaveBeenCalledTimes(1);
            expect(innerChange).toHaveBeenCalledTimes(1);
            await act(() => user.keyboard('{Escape}'));
            await settle();
            expect(document.activeElement).toBe(inner);
            expect(inner.getAttribute('aria-expanded')).toBe('false');
            expect(outer.getAttribute('aria-expanded')).toBe('true');
            expect(innerChange).toHaveBeenCalledTimes(2);
            expect(innerChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'escape' }));
            expect(outerChange).toHaveBeenCalledTimes(1);
            await act(() => user.keyboard('{Escape}'));
            await settle();
            expect(document.activeElement).toBe(outer);
            expect(outer.getAttribute('aria-expanded')).toBe('false');
            expect(outerChange).toHaveBeenCalledTimes(2);
            expect(outerChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'escape' }));
        } finally { await release(view); }
    });

    for (const designSystem of ['md3', 'apple', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`${designSystem}/${colorMode}: tabs through suffix and portalled panel, then restores without reopening`, async () => {
                const changed = mock.fn();
                const view = await render(<ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                    <style>{compiledCss}</style>
                    {/* The portal appends after the field in its configuration
                        boundary. Keep external controls before that field so a
                        forward Tab can enter the panel before leaving it. */}
                    <button data-testid="after">Outside</button>
                    <button data-testid="before">Before</button>
                    <DropdownContainer closeOnFocusOut onOpenChange={changed} overlay={<div role="dialog" aria-label="Picker panel">
                        <input aria-label="Panel editor" /><button type="button" data-testid="cancel">Cancel</button>
                    </div>}><Trigger name="Picker" /></DropdownContainer>
                </ConfigProvider>);
                try {
                    const user = userEvent.setup();
                    // Establish only the starting point; all branch movement uses
                    // Wake browser userEvent's trusted CDP keyboard input.
                    await act(() => required('[data-testid="before"]').focus());
                    await act(() => user.tab());
                    await settle();
                    const input = required<HTMLInputElement>('input[aria-label="Picker"]');
                    expect(document.activeElement).toBe(input);
                    expect(input.getAttribute('aria-expanded')).toBe('true');
                    await act(() => user.tab());
                    expect(document.activeElement).toBe(required('button[aria-label="Picker action"]'));
                    expect(input.getAttribute('aria-expanded')).toBe('true');
                    const cancel = required('[data-testid="cancel"]');
                    for (let step = 0; step < 8 && document.activeElement !== cancel; step += 1) {
                        await act(() => user.tab());
                        expect(input.getAttribute('aria-expanded')).toBe('true');
                    }
                    expect(document.activeElement).toBe(cancel);
                    expect(cancel.matches(':focus-visible')).toBe(true);
                    expect(changed).toHaveBeenCalledTimes(1);
                    await act(() => user.keyboard('{Escape}'));
                    await settle();
                    expect(document.activeElement).toBe(input);
                    expect(input.getAttribute('aria-expanded')).toBe('false');
                    expect(document.querySelector('[role="dialog"]')?.closest('[data-state]')?.getAttribute('data-state') ?? 'closed').toBe('closed');
                    expect(changed).toHaveBeenCalledTimes(2);
                    expect(changed).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'escape' }));
                    // A later genuine focus entry still opens normally.
                    await act(() => user.tab({ shift: true }));
                    await act(() => user.tab());
                    await settle();
                    expect(input.getAttribute('aria-expanded')).toBe('true');
                    const after = required('[data-testid="after"]');
                    for (let step = 0; step < 10 && document.activeElement !== after; step += 1) await act(() => user.tab());
                    await settle();
                    expect(document.activeElement).toBe(after);
                    expect(input.getAttribute('aria-expanded')).toBe('false');
                    expect(changed).toHaveBeenCalledTimes(4);
                    expect(changed).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'focus-out' }));
                } finally { await release(view); }
            });
        }
    }
});
