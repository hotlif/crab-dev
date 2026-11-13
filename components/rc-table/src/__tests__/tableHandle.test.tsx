import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, render } from '@crab-dev/wake/test/react';
import { createRef, StrictMode } from 'react';
import Table from '../table.js';
import type { ColumnType, Row, TableHandle, TableScrollToRowOptions } from '../types.js';
import { getRowScrollTop } from '../hooks/useTableHandle.js';

const columns: ColumnType<Row>[] = [{ name: '$.name', title: 'Name', width: 200 }];
const rows: Row[] = Array.from({ length: 100 }, (_, index) => ({ id: index, dataRef: { name: `Row ${index}` } }));

describe('Table imperative view commands', () => {
    it.each([
        ['start', 300, 40, 0, 300], ['center', 300, 40, 0, 220], ['end', 300, 40, 0, 140],
        ['nearest', 300, 40, 0, 140], ['nearest', 300, 40, 300, 300],
        ['nearest', 300, 40, 320, 300], ['nearest', 300, 40, 120, 140],
        ['nearest', 100, 400, 200, 200], ['nearest', 100, 400, 50, 100],
        ['nearest', 100, 400, 450, 300], ['center', 0, 40, 100, 0], ['start', 960, 40, 0, 800],
    ] satisfies Array<[TableScrollToRowOptions['align'], number, number, number, number]>)('aligns %s at %s with size %s from %s to %s', (align, start, size, current, expected) => {
        expect(getRowScrollTop(start, size, current, 200, 1000, align)).toBe(expected);
    });

    it('keeps a stable handle and locates newly committed rows by typed ID', async () => {
        const ref = createRef<TableHandle>();
        const selection = mock.fn();
        const view = await render(<StrictMode><Table ref={ref} width={400} height={240} rows={rows} columns={columns}
            onSelectCellsChange={selection} /></StrictMode>);
        const handle = ref.current!;
        let completion!: Promise<boolean>;
        await act(() => { completion = handle.scrollToRow('90'); });
        expect(await completion).toBe(false);
        await act(() => { completion = handle.scrollToRow(90, { align: 'center' }); });
        expect(await completion).toBe(true);
        expect(view.container.textContent).toContain('Row 90');
        await view.rerender(<StrictMode><Table ref={ref} width={400} height={240}
            rows={[{ id: 'new', dataRef: { name: 'New row' } }, ...rows]} columns={columns} onSelectCellsChange={selection} /></StrictMode>);
        await act(() => { completion = handle.scrollToRow('new'); });
        expect(await completion).toBe(true);
        expect(view.container.textContent).toContain('New row');
        expect(ref.current).toBe(handle);
        expect(selection).not.toHaveBeenCalled();
        await view.unmount();
        expect(ref.current).toBeNull();
        expect(await handle.scrollToRow(0).catch(error => error)).toEqual(expect.objectContaining({ name: 'AbortError' }));
        handle.focus();
    });

    it('does not expand hidden tree or group rows to find a target', async () => {
        const ref = createRef<TableHandle>();
        const expand = mock.fn();
        const child = { id: 'child', dataRef: { name: 'Child' } };
        const view = await render(<Table ref={ref} width={400} height={240} columns={columns} rows={[rows[0]]}
            treeData getChildRows={row => row.id === 0 ? [child] : undefined} onExpandedRowIdsChange={expand} />);
        let completion!: Promise<boolean>;
        await act(() => { completion = ref.current!.scrollToRow('child'); });
        expect(await completion).toBe(false);
        expect(expand).not.toHaveBeenCalled();
        await view.rerender(<Table ref={ref} width={400} height={240} columns={columns} rows={rows} groupBy={['$.name']} expandedGroupIds={new Set()} />);
        await act(() => { completion = ref.current!.scrollToRow(90); });
        expect(await completion).toBe(false);
    });

    it('rejects superseded and unmounted pending commands without leaving promises pending', async () => {
        const ref = createRef<TableHandle>();
        const view = await render(<Table ref={ref} width={400} height={240} rows={rows} columns={columns} />);
        let first!: Promise<unknown>;
        let last!: Promise<boolean>;
        await act(() => {
            first = ref.current!.scrollToRow(80).catch(error => error);
            last = ref.current!.scrollToRow(10);
        });
        expect(await first).toEqual(expect.objectContaining({ name: 'AbortError' }));
        expect(await last).toBe(true);
        let unmounted!: Promise<unknown>;
        await act(async () => {
            unmounted = ref.current!.scrollToRow(90).catch(error => error);
            await view.unmount();
        });
        expect(await unmounted).toEqual(expect.objectContaining({ name: 'AbortError' }));
    });

    it('restores a valid descendant focus and falls back when it is disabled or removed', async () => {
        const ref = createRef<TableHandle>();
        const filterColumn: ColumnType<Row>[] = [{ ...columns[0], filterable: true, filterEditor: () => <input aria-label="Filter" /> }];
        const view = await render(<><button>Outside</button><Table ref={ref} width={400} height={240}
            rows={rows} columns={filterColumn} filterBar /></>);
        const root = view.container.querySelector<HTMLElement>('[role="grid"]')!;
        const outside = view.container.querySelector('button')!;
        const input = view.container.querySelector('input')!;
        await act(() => ref.current!.focus());
        expect(document.activeElement).toBe(root);
        await act(() => { input.focus(); outside.focus(); ref.current!.focus(); });
        expect(document.activeElement).toBe(input);
        input.disabled = true;
        await act(() => { outside.focus(); ref.current!.focus(); });
        expect(document.activeElement).toBe(root);
        input.disabled = false;
        await act(() => input.focus());
        await view.rerender(<><button>Outside</button><Table ref={ref} width={400} height={240} rows={rows} columns={columns} /></>);
        await act(() => ref.current!.focus());
        expect(document.activeElement).toBe(root);
    });
});
