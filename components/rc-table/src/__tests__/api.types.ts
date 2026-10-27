import type { Row, RowSelection, TableStateProps } from '../types.js';
import type { Key } from 'react';
import type { SortColumn } from '../types.js';

export function verifySelectionStateContract(): {
    readOnly: RowSelection<Row>;
    uncontrolled: RowSelection<Row>;
    conflicting: RowSelection<Row>;
} {
    const readOnly: RowSelection<Row> = { type: 'checkbox', selectedRowIds: new Set() };
    const uncontrolled: RowSelection<Row> = { type: 'checkbox', defaultSelectedRowIds: new Set() };
    // @ts-expect-error Controlled selection and its initial default are mutually exclusive.
    const conflicting: RowSelection<Row> = { type: 'checkbox', selectedRowIds: new Set(), defaultSelectedRowIds: new Set() };
    return { readOnly, uncontrolled, conflicting };
}

export function verifyTableStateContract(): TableStateProps[] {
    const readOnly: TableStateProps = { sortColumns: [], editingRowId: null, expandedGroupIds: new Set(), expandedRowIds: new Set(), expandedRowKeys: new Set() };
    const initial: TableStateProps = { defaultSortColumns: [], defaultEditingRowId: null, defaultExpandedGroupIds: new Set(), defaultExpandedRowIds: new Set(), defaultExpandedRowKeys: new Set() };
    // @ts-expect-error Controlled sorting excludes its initial default.
    const sorting: TableStateProps = { sortColumns: [], defaultSortColumns: [] };
    // @ts-expect-error Controlled grouping excludes its initial expansion strategy.
    const grouping: TableStateProps = { expandedGroupIds: new Set(), defaultExpandAll: true };
    // @ts-expect-error Null is a controlled editing value and excludes its initial default.
    const editing: TableStateProps = { editingRowId: null, defaultEditingRowId: 'initial' };
    // @ts-expect-error Controlled tree expansion excludes its initial default.
    const tree: TableStateProps = { expandedRowIds: new Set(), defaultExpandedRowIds: new Set() };
    // @ts-expect-error Controlled detail expansion excludes its initial default.
    const details: TableStateProps = { expandedRowKeys: new Set(), defaultExpandedRowKeys: new Set() };
    return [readOnly, initial, sorting, grouping, editing, tree, details];
}

export function verifyOptionalStateForwarding(sortColumns: SortColumn[] | undefined, ids: Set<Key> | undefined, editingRowId: Key | null | undefined): {
    state: TableStateProps;
    selection: RowSelection<Row>;
} {
    const state: TableStateProps = { sortColumns, expandedGroupIds: ids, expandedRowIds: ids, expandedRowKeys: ids, editingRowId };
    const selection: RowSelection<Row> = { type: 'checkbox', selectedRowIds: ids };
    return { state, selection };
}
