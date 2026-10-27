import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import { StrictMode } from 'react';

// DOM has no layout engine. Compute the initial position once, without starting
// continuous resize/scroll/layout observers. Keep the actual useFloating,
// FloatingTree, FloatingPortal, interactions and useDismiss implementation.
mock.module('@floating-ui/react', async () => {
    const actual = await mock.actual<typeof import('@floating-ui/react')>('@floating-ui/react');
    const autoUpdate: typeof actual.autoUpdate = (_reference, _floating, update) => {
        update();
        return () => {};
    };
    return { ...actual, autoUpdate };
});
let DropdownContainer: typeof import('../dropdownContainer.js')['default'];
let useDropdownContext: typeof import('../context.js')['useDropdownContext'];
beforeAll(async () => {
    (globalThis as Record<string, unknown>).ResizeObserver ??= class {
        observe() {}
        unobserve() {}
        disconnect() {}
    };
    DropdownContainer = (await mock.import<typeof import('../dropdownContainer.js')>('../dropdownContainer.js')).default;
    useDropdownContext = (await mock.import<typeof import('../context.js')>('../context.js')).useDropdownContext;
});

function Trigger({ name }: { name: string }) {
    const { refs, dispatch } = useDropdownContext<HTMLButtonElement>();
    return <button type="button" ref={refs.setReference} onFocus={() => dispatch({ type: 'setOpen', payload: true })}>{name}</button>;
}
// Floating UI schedules computePosition after the opening commit. Flush that
// separate microtask boundary before assertions or automatic React cleanup.
// https://floating-ui.com/docs/react#testing
const waitForPosition = () => act(async () => {});
const focus = async (element: HTMLElement) => {
    await act(async () => { element.focus(); });
    await waitForPosition();
};
const releaseView = async (view: { unmount: () => void | Promise<void> }) => {
    // Release the real autoUpdate observer/refs before the test callback exits.
    // One task boundary drains pending computePosition promise callbacks while
    // cleanup is still inside act; Wake's automatic cleanup remains enabled.
    await act(async () => {
        await view.unmount();
        await new Promise<void>(resolve => setTimeout(resolve, 0));
    });
};

describe('Dropdown non-modal focus branches', () => {
    it('recognizes a related destination before its later focus event, including nested portal siblings', async () => {
        const outerChange = mock.fn();
        const innerChange = mock.fn();
        const view = await render(<DropdownContainer closeOnFocusOut onOpenChange={outerChange} overlay={<>
            <input aria-label="Outer editor" />
            <DropdownContainer closeOnFocusOut onOpenChange={innerChange} overlay={<input aria-label="Inner editor" />}>
                <Trigger name="Inner trigger" />
            </DropdownContainer>
        </>}><Trigger name="Outer trigger" /><button type="button">Field action</button></DropdownContainer>);
        try {
            const trigger = screen.getByRole('button', { name: 'Outer trigger' });
            await focus(trigger);
            for (const destination of [screen.getByRole('button', { name: 'Field action' }), screen.getByRole('textbox', { name: 'Outer editor' })]) {
                // Model the native blur microtask checkpoint separately from the
                // destination focus event. Direct element.focus() alone cannot.
                await fireEvent(trigger, new FocusEvent('focusout', { bubbles: true, relatedTarget: destination }));
                await waitForPosition();
                expect(outerChange).toHaveBeenCalledTimes(1);
                expect(destination.isConnected).toBe(true);
            }
            const innerTrigger = screen.getByRole('button', { name: 'Inner trigger' });
            await focus(innerTrigger);
            const innerEditor = screen.getByRole('textbox', { name: 'Inner editor' });
            await fireEvent(innerTrigger, new FocusEvent('focusout', { bubbles: true, relatedTarget: innerEditor }));
            await waitForPosition();
            expect(outerChange).toHaveBeenCalledTimes(1);
            expect(innerChange).toHaveBeenCalledTimes(1);
            expect(innerEditor.isConnected).toBe(true);
        } finally { await releaseView(view); }
    });

    it('restores Escape focus without turning the reference onFocus into a reopen', async () => {
        const changed = mock.fn();
        const view = await render(<DropdownContainer closeOnFocusOut onOpenChange={changed} overlay={<input aria-label="Editor" />}><Trigger name="Trigger" /></DropdownContainer>);
        try {
            const trigger = screen.getByRole('button', { name: 'Trigger' });
            await focus(trigger);
            const editor = screen.getByRole('textbox', { name: 'Editor' });
            await focus(editor);
            await fireEvent(editor, new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
            await waitForPosition();
            expect(document.activeElement).toBe(trigger);
            expect(screen.queryByRole('textbox', { name: 'Editor' })).toBeNull();
            expect(changed).toHaveBeenCalledTimes(2);
            expect(changed).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'escape' }));
        } finally { await releaseView(view); }
    });

    it('keeps internal controls and nested portals open, then closes the exited branches without restoring focus', async () => {
        const outerChange = mock.fn();
        const innerChange = mock.fn();
        const view = await render(<>
            <DropdownContainer closeOnFocusOut onOpenChange={outerChange} overlay={<>
                <input aria-label="Outer editor" />
                <DropdownContainer closeOnFocusOut onOpenChange={innerChange} overlay={<input aria-label="Inner editor" />}>
                    <Trigger name="Inner trigger" />
                </DropdownContainer>
            </>}><Trigger name="Outer trigger" /><button type="button">Field action</button></DropdownContainer>
            <button type="button">Next field</button>
        </>);
        try {
            await focus(screen.getByRole('button', { name: 'Outer trigger' }));
            await focus(screen.getByRole('textbox', { name: 'Outer editor' }));
            await focus(screen.getByRole('button', { name: 'Field action' }));
            expect(outerChange).toHaveBeenCalledTimes(1);
            await focus(screen.getByRole('button', { name: 'Inner trigger' }));
            await focus(screen.getByRole('textbox', { name: 'Inner editor' }));
            expect(outerChange).toHaveBeenCalledTimes(1);
            expect(innerChange).toHaveBeenCalledTimes(1);
            await focus(screen.getByRole('textbox', { name: 'Outer editor' }));
            expect(screen.queryByRole('textbox', { name: 'Inner editor' })).toBeNull();
            expect(outerChange).toHaveBeenCalledTimes(1);
            expect(innerChange).toHaveBeenCalledTimes(2);
            expect(innerChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'focus-out' }));
            await focus(screen.getByRole('button', { name: 'Inner trigger' }));
            await focus(screen.getByRole('textbox', { name: 'Inner editor' }));
            const outside = screen.getByRole('button', { name: 'Next field' });
            await focus(outside);
            expect(screen.queryByRole('textbox', { name: 'Outer editor' })).toBeNull();
            expect(screen.queryByRole('textbox', { name: 'Inner editor' })).toBeNull();
            expect(document.activeElement).toBe(outside);
            expect(outerChange).toHaveBeenCalledTimes(2);
            expect(outerChange).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'focus-out', event: expect.any(FocusEvent) }));
        } finally { await releaseView(view); }
    });

    it('leaves focus dismissal opt-in for consumers with their own focus model', async () => {
        const view = await render(<><DropdownContainer overlay={<input aria-label="Editor" />}><Trigger name="Trigger" /></DropdownContainer><button type="button">Outside</button></>);
        try {
            await focus(screen.getByRole('button', { name: 'Trigger' }));
            await focus(screen.getByRole('button', { name: 'Outside' }));
            expect(screen.getByRole('textbox', { name: 'Editor' })).toBeTruthy();
        } finally { await releaseView(view); }
    });

    it('only requests a controlled close and deduplicates the pointerdown/focusout of one exit', async () => {
        const changed = mock.fn();
        const view = await render(<>
            <DropdownContainer closeOnFocusOut open onOpenChange={changed} overlay={<input aria-label="Editor" />}><Trigger name="Trigger" /></DropdownContainer>
            <button type="button">Outside</button>
        </>);
        try {
            await waitForPosition();
            const editor = screen.getByRole('textbox', { name: 'Editor' });
            const outside = screen.getByRole('button', { name: 'Outside' });
            await focus(editor);
            await fireEvent(outside, new PointerEvent('pointerdown', { bubbles: true }));
            await focus(outside);
            expect(changed).toHaveBeenCalledTimes(1);
            expect(changed).toHaveBeenCalledWith(false, expect.objectContaining({ reason: 'outside-press' }));
            expect(screen.getByRole('textbox', { name: 'Editor' })).toBe(editor);
            expect(document.activeElement).toBe(outside);
            await focus(editor);
            await focus(outside);
            expect(changed).toHaveBeenCalledTimes(2);
            expect(changed).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'focus-out' }));
            await view.rerender(<DropdownContainer closeOnFocusOut open={false} onOpenChange={changed} overlay={<input aria-label="Editor" />}><Trigger name="Trigger" /></DropdownContainer>);
            await waitForPosition();
            expect(changed).toHaveBeenCalledTimes(2);
            expect(screen.queryByRole('textbox', { name: 'Editor' })).toBeNull();
        } finally { await releaseView(view); }
    });

    it('handles a null related target and releases cleanly in StrictMode', async () => {
        const changed = mock.fn();
        const view = await render(<StrictMode><DropdownContainer closeOnFocusOut onOpenChange={changed} overlay={<input aria-label="Editor" />}><Trigger name="Trigger" /></DropdownContainer></StrictMode>);
        try {
            await focus(screen.getByRole('button', { name: 'Trigger' }));
            const editor = screen.getByRole('textbox', { name: 'Editor' });
            await focus(editor);
            await act(async () => { editor.blur(); });
            await waitForPosition();
            expect(changed).toHaveBeenCalledTimes(2);
            expect(changed).toHaveBeenLastCalledWith(false, expect.objectContaining({ reason: 'focus-out' }));
            expect(document.activeElement).toBe(document.body);
        } finally { await releaseView(view); }
        expect(changed).toHaveBeenCalledTimes(2);
    });

});
