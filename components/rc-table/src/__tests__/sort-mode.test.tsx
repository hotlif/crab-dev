import { describe, expect, it } from '@crab-dev/wake/test';
import { renderHook } from '@crab-dev/wake/test/react';
import { useColumnSort } from '../hooks/useColumnSort.js';
import type { Row } from '../types.js';

interface Item extends Row { dataRef: { amount: number } }

describe('Table sort mode', () => {
    it('sorts loaded rows in client mode and preserves server ordering in server mode', async () => {
        const rows: Item[] = [{ id: 'large', dataRef: { amount: 20 } }, { id: 'small', dataRef: { amount: 1 } }];
        const view = await renderHook(({ mode }: { mode: 'client' | 'server' }) => useColumnSort({
            rows, columns: [{ name: '$.amount', title: 'Amount', sortable: true }],
            sortColumns: [{ columnName: '$.amount', direction: 'asc' }], sortMode: mode,
        }), { initialProps: { mode: 'client' as 'client' | 'server' } });
        expect(view.result.current.sortedRows.map(row => row.id)).toEqual(['small', 'large']);
        await view.rerender({ mode: 'server' });
        expect(view.result.current.sortedRows).toBe(rows);
        expect(view.result.current.getSortState('$.amount')?.direction).toBe('asc');
    });
});
