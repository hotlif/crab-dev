import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import { createPortal } from 'react-dom';
import type { DropdownOpenChangeDetails } from '../../dropdownContainer.js';

// Real Window/Document focus and all actual Floating UI code, including
// autoUpdate. Only Crab CSS extraction is handled by this root's shared setup.
let DropdownContainer: typeof import('../../dropdownContainer.js')['default'];
let useDropdownContext: typeof import('../../context.js')['useDropdownContext'];
beforeAll(async () => {
    DropdownContainer = (await mock.import<typeof import('../../dropdownContainer.js')>('../../dropdownContainer.js')).default;
    useDropdownContext = (await mock.import<typeof import('../../context.js')>('../../context.js')).useDropdownContext;
});

function Trigger({ name }: { name: string }) {
    const { refs, dispatch } = useDropdownContext<HTMLButtonElement>();
    return <button type="button" ref={refs.setReference} onFocus={() => dispatch({ type: 'setOpen', payload: true })}>{name}</button>;
}
const focus = async (element: HTMLElement) => {
    await act(async () => { element.focus(); });
    // Drain the actual browser's position computation after the opening commit.
    await act(async () => {});
};
const releaseView = async (view: { unmount: () => void | Promise<void> }) => {
    await act(async () => {
        await view.unmount();
        // Drain native ResizeObserver/Floating UI work already queued by the
        // last layout before unmount. Recurring frames still fail leak checks.
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        await new Promise<void>(resolve => setTimeout(resolve, 0));
    });
};

describe('Dropdown focus across actual document realms', () => {
    it('registers an initially open portal for native Escape after its floating element mounts', async () => {
        const changed = mock.fn<(open: boolean, details: DropdownOpenChangeDetails) => void>();
        function InitialTrigger() {
            const { refs } = useDropdownContext<HTMLButtonElement>();
            return <button ref={refs.setReference}>Initial trigger</button>;
        }
        const view = await render(<DropdownContainer defaultOpen onOpenChange={changed} overlay={<input aria-label="Initially open editor" />}>
            <InitialTrigger />
        </DropdownContainer>);
        try {
            await act(async () => {
                await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
            });
            const editor = document.querySelector<HTMLInputElement>('input[aria-label="Initially open editor"]')!;
            expect(editor).toBeTruthy();
            await focus(editor);
            const escape = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
            await act(() => { editor.dispatchEvent(escape); });
            expect(escape.defaultPrevented).toBe(true);
            expect(changed).toHaveBeenCalledTimes(1);
            expect(changed.calls.calls[0][0]).toBe(false);
            expect(changed.calls.calls[0][1].reason).toBe('escape');
            expect(changed.calls.calls[0][1].event).toBe(escape);
        } finally { await releaseView(view); }
    });
    it('keeps iframe focus resources local to the reference document', async () => {
        const frame = document.createElement('iframe');
        document.body.append(frame);
        const owner = frame.contentDocument!;
        const changed = mock.fn<(open: boolean, details: DropdownOpenChangeDetails) => void>();
        try {
            const view = await render(createPortal(<>
                <DropdownContainer closeOnFocusOut onOpenChange={changed} overlay={<input aria-label="Frame editor" />}><Trigger name="Frame trigger" /></DropdownContainer>
                <button type="button">Frame outside</button>
            </>, owner.body));
            try {
                const trigger = owner.querySelector<HTMLButtonElement>('button')!;
                await focus(trigger);
                const editor = owner.querySelector<HTMLInputElement>('input')!;
                expect(editor?.ownerDocument).toBe(owner);
                expect(editor instanceof HTMLElement).toBe(false);
                await focus(editor);
                const outside = Array.from(owner.querySelectorAll('button')).find(button => button.textContent === 'Frame outside')!;
                await focus(outside);
                expect(owner.querySelector('input')).toBeNull();
                expect(owner.activeElement).toBe(outside);
                expect(changed).toHaveBeenCalledTimes(2);
                expect(changed).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'focus-out' }));
                expect(changed.calls.calls[1][1].event instanceof owner.defaultView!.FocusEvent).toBe(true);
            } finally { await releaseView(view); }
        } finally {
            frame.remove();
        }
    });
});
