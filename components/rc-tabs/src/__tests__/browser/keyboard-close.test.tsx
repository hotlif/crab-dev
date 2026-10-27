import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import { useState } from 'react';
import Tabs from '../../../esm/index.mjs';
import type { TabsItem } from '../../types.js';

const initial: TabsItem[] = [
    { key: 'one', label: 'One', closable: true },
    { key: 'disabled', label: 'Disabled', disabled: true },
    { key: 'two', label: 'Two', closable: true },
    { key: 'three', label: 'Three', closable: true },
];

describe('Keyboard tab close focus ownership in the browser', () => {
    for (const [label, expected] of [['One', 'Two'], ['Two', 'Three'], ['Three', 'Two']] as const) {
        it(`moves from ${label} to eligible ${expected} without a selection notification`, async () => {
            const changed = mock.fn();
            const closed = mock.fn();
            function Fixture() {
                const [items, setItems] = useState(initial);
                return <Tabs items={items} defaultValue={label.toLowerCase()} onValueChange={changed}
                    onTabClose={(key, event) => {
                        closed(key, event);
                        setItems(current => current.filter(item => item.key !== key));
                    }} />;
            }
            const view = await render(<Fixture />);
            const source = [...view.container.querySelectorAll<HTMLButtonElement>('[role="tab"]')].find(tab => tab.textContent === label)!;
            await act(async () => { source.focus(); });
            await fireEvent.keyDown(source, { key: 'Delete' });
            const successor = [...view.container.querySelectorAll<HTMLButtonElement>('[role="tab"]')].find(tab => tab.textContent === expected)!;
            expect(document.activeElement).toBe(successor);
            expect(successor.matches(':focus-visible')).toBe(true);
            expect(source.isConnected).toBe(false);
            expect(closed).toHaveBeenCalledTimes(1);
            expect(changed).not.toHaveBeenCalled();
        });
    }

    for (const behavior of ['reject', 'blur', 'focus', 'unmount'] as const) {
        it(`respects ${behavior} and expires the request before later unrelated removal`, async () => {
            const closed = mock.fn();
            function Fixture() {
                const [items, setItems] = useState(initial);
                const [visible, setVisible] = useState(true);
                return <>
                    <button data-outside="" onClick={() => setItems(current => current.filter(item => item.key !== 'one'))}>External</button>
                    {visible && <Tabs items={items} defaultValue="one" onTabClose={(key, event) => {
                        closed(key, event);
                        if (behavior === 'blur') event.currentTarget.blur();
                        if (behavior === 'focus') document.querySelector<HTMLButtonElement>('[data-outside]')!.focus();
                        if (behavior === 'unmount') setVisible(false);
                        if (behavior !== 'reject') setItems(current => current.filter(item => item.key !== key));
                    }} />}
                </>;
            }
            const view = await render(<Fixture />);
            const source = view.container.querySelector<HTMLButtonElement>('[role="tab"]')!;
            await act(async () => { source.focus(); });
            await fireEvent.keyDown(source, { key: 'Backspace' });
            expect(closed).toHaveBeenCalledTimes(1);
            if (behavior === 'reject') {
                expect(document.activeElement).toBe(source);
                await fireEvent.click(view.container.querySelector<HTMLButtonElement>('[data-outside]')!);
                expect(document.activeElement?.getAttribute('role')).not.toBe('tab');
            } else if (behavior === 'focus') {
                expect(document.activeElement?.hasAttribute('data-outside')).toBe(true);
            } else {
                expect(document.activeElement).toBe(document.body);
            }
        });
    }
});
