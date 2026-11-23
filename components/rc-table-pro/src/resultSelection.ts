import type { Row, RowSelection } from '@crab-dev/rc-table';
import type { ResultScope, ResultSelectionConfig } from './types.js';

export function sameScope(a: ResultScope, b: ResultScope): boolean {
    return (a.keyword ?? '') === (b.keyword ?? '') && Object.keys(a.filters).length === Object.keys(b.filters).length
        && Object.entries(a.filters).every(([key, value]) => Object.hasOwn(b.filters, key) && b.filters[key] === value);
}

/** The checkbox column projects one page of a possibly unbounded selection. */
export function pageSelection<T extends Row>(config: ResultSelectionConfig<T>, scope: ResultScope, rows: T[], blocked: boolean): RowSelection<T> {
    const value = config.value;
    const all = value.mode === 'all' && sameScope(value.scope, scope);
    const eligible = rows.filter(row => !config.getDisabled?.(row));
    const selectedRowIds = value.mode === 'ids' ? value.ids : new Set(eligible.filter(row => all && !value.excludedIds.has(row.id)).map(row => row.id));
    return {
        type: 'checkbox', selectedRowIds, getDisabled: row => blocked || !!config.getDisabled?.(row),
        onSelectedRowIdsChange: ids => {
            if (blocked) return;
            if (all) {
                const excludedIds = new Set(value.excludedIds);
                for (const row of eligible) {
                    if (ids.has(row.id)) excludedIds.delete(row.id);
                    else excludedIds.add(row.id);
                }
                config.onValueChange({ ...value, excludedIds });
            } else {
                const next = new Set(selectedRowIds);
                for (const row of eligible) {
                    if (ids.has(row.id)) next.add(row.id);
                    else next.delete(row.id);
                }
                config.onValueChange({ mode: 'ids', ids: next });
            }
        },
    };
}
