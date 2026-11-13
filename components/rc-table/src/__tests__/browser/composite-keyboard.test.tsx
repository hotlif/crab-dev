import { expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import Select from '@crab-dev/rc-select';
import Button from '@crab-dev/rc-button';
import type { ColumnType, Row } from '../../types.js';
// Interaction/layout exception: exercise published editor components and CSS.
import Table from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

// Native observer delivery can already be queued when a cell editor disappears.
// Release the owned view, then drain that finite delivery before the callback
// ends. Automatic cleanup and strict recurring-frame leak checks stay enabled.
async function releaseView(view: { unmount(): Promise<void> }) {
    await act(async () => {
        await view.unmount();
        await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
        await new Promise<void>(resolve => setTimeout(resolve, 0));
    });
}

interface RecordRow extends Row { dataRef: { team: string }; }
const rows: RecordRow[] = [{ id: 'team-row', dataRef: { team: 'design' } }];
const key = (node: Element, value: string) => fireEvent(node, new KeyboardEvent('keydown', { key: value, bubbles: true, cancelable: true }));
const doubleClick = async (node: Element) => {
    await fireEvent(node, new MouseEvent('mousedown', { bubbles: true, button: 0 }));
    await fireEvent(node, new MouseEvent('dblclick', { bubbles: true, button: 0 }));
};

for (const designSystem of ['md3', 'macos', 'shadcn'] as const)
for (const colorMode of ['light', 'dark'] as const)
it(`${designSystem}/${colorMode}: lets the cell combobox open and commit its own Enter selection`, async () => {
    const committed = mock.fn();
    const opened = mock.fn();
    const columns: ColumnType<RecordRow>[] = [{ name: '$.team', title: 'Team', width: 240,
        editRender: ({ row, editorValue, onEditorValueChange, onCommit }) => <Select aria-label="Team editor"
            value={String(editorValue ?? row.dataRef.team)} options={[{ value: 'design', label: 'Design' }, { value: 'engineering', label: 'Engineering' }]}
            onValueChange={value => { onEditorValueChange(value); onCommit?.(value); }} /> }];
    const view = await render(<><style>{compiledCss}</style><ConfigProvider designSystem={designSystem} colorMode={colorMode}>
        <Table width={320} height={160} columns={columns} rows={rows} editType="cell" onCellEditRecordsChange={committed} onRowClick={opened} />
    </ConfigProvider></>);
    try {
        const grid = view.container.querySelector<HTMLElement>('[role="grid"]')!;
        await doubleClick(grid.querySelector('[role="gridcell"]')!);
        const combo = view.container.querySelector<HTMLElement>('[role="combobox"]')!;
        await act(() => combo.focus());
        await key(combo, 'Enter');
        expect(combo.getAttribute('aria-expanded')).toBe('true');
        expect(committed).not.toHaveBeenCalled();
        expect(opened).not.toHaveBeenCalled();
        await key(combo, 'ArrowDown');
        await key(combo, 'Enter');
        expect(committed).toHaveBeenCalledWith([expect.objectContaining({ rowId: 'team-row', newValue: 'engineering' })]);
        expect(committed).toHaveBeenCalledTimes(1);
        expect(combo.isConnected).toBe(false);
        expect(document.activeElement === grid).toBe(true);
        expect(opened).not.toHaveBeenCalled();
    } finally { await releaseView(view); }
});

it('keeps native Enter activation on a cell editor action', async () => {
    const committed = mock.fn();
    const opened = mock.fn();
    const columns: ColumnType<RecordRow>[] = [{ name: '$.team', title: 'Team', width: 240,
        editRender: ({ onCommit }) => <Button onClick={() => onCommit?.('confirmed')}>Apply editor</Button> }];
    const view = await render(<><style>{compiledCss}</style><Table width={320} height={160} columns={columns} rows={rows}
        editType="cell" onCellEditRecordsChange={committed} onRowClick={opened} /></>);
    try {
        const grid = view.container.querySelector<HTMLElement>('[role="grid"]')!;
        await doubleClick(grid.querySelector('[role="gridcell"]')!);
        const action = screen.getByRole('button', { name: 'Apply editor' });
        await act(() => action.focus());
        // A synthetic keydown has no browser default click. Check non-cancellation
        // before delivering the corresponding keyboard/assistive click separately.
        const enter = new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true });
        await fireEvent(action, enter);
        expect(enter.defaultPrevented).toBe(false);
        expect(opened).not.toHaveBeenCalled();
        await fireEvent.click(action, { detail: 0 });
        expect(committed).toHaveBeenCalledWith([expect.objectContaining({ newValue: 'confirmed' })]);
        expect(committed).toHaveBeenCalledTimes(1);
        expect(document.activeElement === grid).toBe(true);
        expect(opened).not.toHaveBeenCalled();
    } finally { await releaseView(view); }
});
