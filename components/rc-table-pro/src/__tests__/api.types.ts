import type { TableProProps } from '../table.js';
import type { Row, SortColumn } from '@crab-dev/rc-table';

export function verifyTableProStateContract(sortColumns: SortColumn[] | undefined): TableProProps<Row>[] {
    const data = { fetchColumns: async () => [], request: async () => ({ rows: [], total: 0 }) };
    const readOnly: TableProProps<Row> = { ...data, sortColumns: [] };
    const forwarding: TableProProps<Row> = { ...data, sortColumns };
    const initial: TableProProps<Row> = { ...data, defaultSortColumns: [] };
    // @ts-expect-error TablePro shares Table's sorting state/default exclusion.
    const sorting: TableProProps<Row> = { ...data, sortColumns: [], defaultSortColumns: [] };
    // @ts-expect-error Controlled grouping excludes the default expansion strategy.
    const grouping: TableProProps<Row> = { ...data, expandedGroupIds: new Set(), defaultExpandAll: true };
    return [readOnly, forwarding, initial, sorting, grouping];
}
