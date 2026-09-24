import type { Row } from '@crab-dev/rc-table';
import type { DataTypeLoader, TableDataSource } from '../types.js';

interface CustomerRow extends Row { dataRef: { name: string } }
export const customerLoader: DataTypeLoader<CustomerRow> = {
    name: 'customer',
    render: ({ row }) => row.dataRef.name,
    editRender: undefined,
    filterEditor: undefined,
    exportValue: (_raw, row) => row.dataRef.name,
};

// @ts-expect-error 服务端排序需要能接收完整查询的 request。
export const invalidSource: TableDataSource<CustomerRow> = { fetchData: async () => [], sortMode: 'server' };
