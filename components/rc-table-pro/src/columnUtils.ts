import { OverStateEnum } from "@crab-dev/rc-tree";
import type { Row } from "@crab-dev/rc-table";
import type { DataTypeLoader, ProtocolColumnType, ProtocolTableState } from "./types.js";

// ─── 叶子列收集 ───

export function collectAllLeafColumnNames(columns: ProtocolColumnType[]): (string | number)[] {
    return columns.flatMap(col =>
        col.children?.length ? collectAllLeafColumnNames(col.children) : [col.name as string | number]
    );
}

export function collectLeafColumns(columns: ProtocolColumnType[]): ProtocolColumnType[] {
    return columns.flatMap(col =>
        col.children?.length ? collectLeafColumns(col.children) : [col]
    );
}

export function collectVisibleLeafColumnNames(columns: ProtocolColumnType[]): (string | number)[] {
    return columns.flatMap(col =>
        col.children?.length
            ? collectVisibleLeafColumnNames(col.children)
            : col.hidden ? [] : [col.name as string | number]
    );
}

export function applyHiddenToColumns(
    columns: ProtocolColumnType[],
    hiddenNames: Set<string | number>
): ProtocolColumnType[] {
    return columns.map(col => {
        if (col.children?.length) {
            return { ...col, children: applyHiddenToColumns(col.children, hiddenNames) };
        }
        return { ...col, hidden: hiddenNames.has(col.name as string | number) };
    });
}

// ─── 列宽 ───

export function buildInitWidthMap(cols: ProtocolColumnType[]): Map<string | number, number | undefined> {
    const map = new Map<string | number, number | undefined>();
    const walk = (cs: ProtocolColumnType[]) => cs.forEach(c => {
        map.set(c.name as string | number, c.width);
        if (c.children?.length) walk(c.children);
    });
    walk(cols);
    return map;
}

export function resetColumnWidths(
    cols: ProtocolColumnType[],
    initMap: Map<string | number, number | undefined>
): ProtocolColumnType[] {
    return cols.map(col => {
        const next = { ...col, width: initMap.get(col.name as string | number) };
        if (col.children?.length) return { ...next, children: resetColumnWidths(col.children, initMap) };
        return next;
    });
}

// ─── 列排序 ───

export function reorderColumnsByDrag(
    columns: ProtocolColumnType[],
    dragId: string | number,
    targetId: string | number,
    position: OverStateEnum
): ProtocolColumnType[] {
    const dragIdx = columns.findIndex(c => c.name === dragId);
    const targetIdx = columns.findIndex(c => c.name === targetId);

    if (dragIdx !== -1 && targetIdx !== -1) {
        const next = [...columns];
        const [removed] = next.splice(dragIdx, 1);
        const insertAt = next.findIndex(c => c.name === targetId);
        next.splice(position === OverStateEnum.UPWARD ? insertAt : insertAt + 1, 0, removed);
        return next;
    }

    return columns.map(col => {
        if (!col.children?.length) return col;
        return { ...col, children: reorderColumnsByDrag(col.children, dragId, targetId, position) };
    });
}

// ─── 状态持久化 ───

export function flattenColumnNames(cols: ProtocolColumnType[]): (string | number)[] {
    return cols.flatMap(col =>
        col.children?.length
            ? [col.name as string | number, ...flattenColumnNames(col.children)]
            : [col.name as string | number]
    );
}

export function reorderColumnsByState(
    cols: ProtocolColumnType[],
    nameIndex: Map<string | number, number>
): ProtocolColumnType[] {
    const sorted = [...cols].sort((a, b) => {
        const ai = nameIndex.get(a.name as string | number) ?? Infinity;
        const bi = nameIndex.get(b.name as string | number) ?? Infinity;
        return ai - bi;
    });
    return sorted.map(col =>
        col.children?.length ? { ...col, children: reorderColumnsByState(col.children, nameIndex) } : col
    );
}

export function buildCurrentState(
    cols: ProtocolColumnType[],
    filters: Record<string, string>
): ProtocolTableState {
    const columnProps: ProtocolTableState["columnProps"] = {};
    const walk = (cs: ProtocolColumnType[]) => cs.forEach(col => {
        columnProps[String(col.name)] = {
            hidden: col.hidden,
            width: col.width,
            fixed: col.fixed,
            sortable: col.sortable,
        };
        if (col.children?.length) walk(col.children);
    });
    walk(cols);
    return {
        columnProps,
        columnOrder: flattenColumnNames(cols),
        filters: Object.keys(filters).length > 0 ? { ...filters } : undefined,
    };
}

export function applyInitialState(
    cols: ProtocolColumnType[],
    state: ProtocolTableState
): ProtocolColumnType[] {
    const nameIndex = state.columnOrder
        ? new Map(state.columnOrder.map((n, i) => [n, i]))
        : null;
    const ordered = nameIndex ? reorderColumnsByState(cols, nameIndex) : cols;

    const applyProps = (cs: ProtocolColumnType[]): ProtocolColumnType[] =>
        cs.map(col => {
            const p = state.columnProps[String(col.name)];
            const base = p ? {
                ...col,
                ...(p.hidden !== undefined && { hidden: p.hidden }),
                ...(p.width !== undefined && { width: p.width }),
                ...(p.fixed !== undefined && { fixed: p.fixed }),
                ...(p.sortable !== undefined && { sortable: p.sortable }),
            } : col;
            return base.children?.length ? { ...base, children: applyProps(base.children) } : base;
        });
    return applyProps(ordered);
}

// ─── CSV 导出 ───

export function exportToCSV<T extends Row>(
    rawCols: ProtocolColumnType[],
    rows: T[],
    loaders: DataTypeLoader[] | undefined,
    fileName: string
) {
    const visibleLeafs = collectLeafColumns(rawCols).filter(col => !col.hidden);
    const escape = (v: string) => `"${v.replace(/"/g, '""')}"`;
    const header = visibleLeafs.map(col => escape(String(col.title ?? col.name))).join(",");
    const body = rows.map(row => {
        const dataRef = (row as unknown as { dataRef: Record<string, unknown> }).dataRef ?? {};
        return visibleLeafs.map(col => {
            const fieldName = String(col.name).replace(/^\$\./, "");
            const rawVal = dataRef[fieldName] ?? "";
            const loader = loaders?.find(l => l.name === col.dataType);
            const text = loader?.exportValue ? loader.exportValue(rawVal, row) : String(rawVal);
            return escape(text);
        }).join(",");
    });
    const csv = "﻿" + [header, ...body].join("\r\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}
