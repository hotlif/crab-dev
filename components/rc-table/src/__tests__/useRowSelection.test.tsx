import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, renderHook } from '@crab-dev/wake/test/react';
import { useRowSelection } from '../hooks/useRowSelection.js';
import type { Row, RowSelection } from '../types.js';

describe('Table row selection operations', () => {
    it('does not fabricate an event for programmatic row, all, and clear changes', async () => {
        const rows: Row[] = [{ id: 'first', dataRef: {} }, { id: 'second', dataRef: {} }];
        const changed = mock.fn<NonNullable<RowSelection<Row>['onSelectedRowIdsChange']>>();
        const view = await renderHook(() => useRowSelection({
            dataRows: rows,
            rowSelection: { type: 'checkbox', onSelectedRowIdsChange: changed },
        }));

        await act(() => view.result.current.toggleRow('first'));
        await act(() => view.result.current.selectAllRows());
        await act(() => view.result.current.clearAllRows());

        expect(changed).toHaveBeenCalledTimes(3);
        expect(changed.calls.calls.map(([ids, details]) => ({ ids, details }))).toEqual([
            { ids: new Set(['first']), details: { rows: [rows[0]], reason: 'row' } },
            { ids: new Set(['first', 'second']), details: { rows, reason: 'all' } },
            { ids: new Set(), details: { rows: [], reason: 'clear' } },
        ]);
    });
});
