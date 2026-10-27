import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import { useEffect, useRef, useState } from 'react';
import InlineEditDemo, { useKeyboardEditFocus } from '../../../docs/demos/inline-edit.demo.js';

const settle = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});
function required<T extends Element>(root: ParentNode, selector: string): T {
    const result = root.querySelector<T>(selector);
    if (!result) throw new Error(`Missing actual editor node: ${selector}`);
    return result;
}

describe('actual custom inline editor example, native focus lifecycle', () => {
    for (const key of ['Enter', 'Escape'] as const) {
        it(`returns focus to the same tree after ${key}`, async () => {
            const view = await render(<div style={{ width: 640 }}><InlineEditDemo /></div>);
            await settle();
            const tree = required<HTMLElement>(view.container, '[role="tree"]');
            const row = required<HTMLElement>(tree, '[role="treeitem"][id$="-quick-start"]');
            await fireEvent(row, new MouseEvent('dblclick', { bubbles: true, cancelable: true, detail: 2 }));
            await settle();
            const input = required<HTMLInputElement>(row, 'input[aria-label="节点名称"]');
            expect(document.activeElement).toBe(input);
            await act(() => Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, 'Renamed.md'));
            await fireEvent.input(input);
            await fireEvent.keyDown(input, { key });
            await settle();
            expect(input.isConnected).toBe(false);
            expect(required<HTMLElement>(tree, '[role="treeitem"][id$="-quick-start"]')).toBe(row);
            expect(row.textContent).toContain(key === 'Enter' ? 'Renamed.md' : '快速开始.md');
            expect(document.activeElement).toBe(tree);
            expect(row.getAttribute('aria-selected')).toBe('true');
        });
    }

    it('keeps an invalid editor focused and respects a later external focus target', async () => {
        const view = await render(<><button data-outside="">Outside</button><div style={{ width: 640 }}><InlineEditDemo /></div></>);
        await settle();
        const row = required<HTMLElement>(view.container, '[role="treeitem"][id$="-quick-start"]');
        await fireEvent(row, new MouseEvent('dblclick', { bubbles: true, cancelable: true, detail: 2 }));
        await settle();
        const input = required<HTMLInputElement>(row, 'input');
        await act(() => Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')!.set!.call(input, ''));
        await fireEvent.input(input);
        await fireEvent.keyDown(input, { key: 'Enter' });
        expect(input.isConnected).toBe(true);
        expect(document.activeElement).toBe(input);
        expect(input.getAttribute('aria-invalid')).toBe('true');
        const outside = required<HTMLElement>(view.container, '[data-outside]');
        await act(() => outside.focus());
        await settle();
        expect(input.isConnected).toBe(false);
        expect(document.activeElement).toBe(outside);
        expect(row.textContent).toContain('快速开始.md');
    });
});

type Decision = 'focus' | 'blur' | 'reject' | 'unmount';
function OwnershipFixture({ decision, externalClose = false, completed }: {
    decision: Decision;
    externalClose?: boolean;
    completed: () => void;
}) {
    const finish = useKeyboardEditFocus();
    const [editing, setEditing] = useState(true);
    const [present, setPresent] = useState(true);
    const inputRef = useRef<HTMLInputElement>(null);
    const outsideRef = useRef<HTMLButtonElement>(null);
    useEffect(() => { inputRef.current?.focus(); }, []);
    return <>
        <button ref={outsideRef} data-outside="">Outside</button>
        {present && <div role="tree" tabIndex={0}><div role="treeitem">
            {editing && !externalClose ? <input ref={inputRef} aria-label="Owner editor" defaultValue="Name"
                onKeyDown={event => {
                    if (event.key !== 'Enter') return;
                    event.preventDefault();
                    finish(event.currentTarget, () => {
                        completed();
                        if (decision === 'focus') outsideRef.current?.focus();
                        if (decision === 'blur') inputRef.current?.blur();
                        if (decision === 'unmount') setPresent(false);
                        if (decision !== 'reject') setEditing(false);
                    });
                }} /> : 'Name'}
        </div></div>}
    </>;
}

describe('actual demo focus helper ownership boundaries', () => {
    for (const decision of ['focus', 'blur', 'reject', 'unmount'] as const) {
        it(`does not reclaim focus after consumer ${decision}`, async () => {
            const completed = mock.fn();
            const view = await render(<OwnershipFixture decision={decision} completed={completed} />);
            const input = required<HTMLInputElement>(view.container, 'input');
            expect(document.activeElement).toBe(input);
            await fireEvent.keyDown(input, { key: 'Enter' });
            await settle();
            expect(completed).toHaveBeenCalledTimes(1);
            if (decision === 'reject') {
                expect(document.activeElement).toBe(input);
                await view.rerender(<OwnershipFixture decision={decision} externalClose completed={completed} />);
                await settle();
            }
            expect(input.isConnected).toBe(false);
            expect(document.activeElement).toBe(decision === 'focus'
                ? required<HTMLElement>(view.container, '[data-outside]') : document.body);
        });
    }
});
