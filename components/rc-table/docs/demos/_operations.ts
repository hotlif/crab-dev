import type { Key } from "react";
import type { OrderRow } from "./_mock.js";

export function matchesNumber(value: number, query: string): boolean {
    const normalized = query.trim().replaceAll(",", "").replaceAll("，", "");
    if (!normalized) return true;
    const range = /^(\d+(?:\.\d+)?)\s*[-~～]\s*(\d+(?:\.\d+)?)$/.exec(normalized);
    if (range) return value >= Number(range[1]) && value <= Number(range[2]);
    const comparison = /^(>=|<=|>|<|=)?\s*(\d+(?:\.\d+)?)$/.exec(normalized);
    if (!comparison) return false;
    const target = Number(comparison[2]);
    switch (comparison[1]) {
        case ">=": return value >= target;
        case "<=": return value <= target;
        case ">": return value > target;
        case "<": return value < target;
        default: return value === target;
    }
}
export function filterOrders(rows: OrderRow[], filters: Record<string, string>): OrderRow[] {
    return rows.filter(row => Object.entries(filters).every(([path, value]) => {
        const query = value.trim().toLocaleLowerCase("zh-CN");
        if (!query) return true;
        const key = path.replace(/^\$\./, "");
        const entry = Object.entries(row.dataRef).find(([name]) => name === key)?.[1];
        if (typeof entry === "number") return matchesNumber(entry, query);
        if (["status", "region", "paymentStatus"].includes(key)) return entry === value.trim();
        return String(entry ?? "").toLocaleLowerCase("zh-CN").includes(query);
    }));
}
export function approveOrders(rows: OrderRow[], ids: Set<Key>): OrderRow[] {
    return rows.map(row => ids.has(row.id) && row.dataRef.status === "待审核"
        ? { ...row, dataRef: { ...row.dataRef, status: "待发货" } } : row);
}
export interface CopiedCell {
    rowId: Key; rowIndex: number; columnIndex: number; columnName: string; value: unknown;
}
export function buildTsv(cells: CopiedCell[]): string {
    if (!cells.length) return "";
    let minRow = Infinity, maxRow = -Infinity, minCol = Infinity, maxCol = -Infinity;
    const values = new Map<string, string>();
    for (const cell of cells) {
        minRow = Math.min(minRow, cell.rowIndex); maxRow = Math.max(maxRow, cell.rowIndex);
        minCol = Math.min(minCol, cell.columnIndex); maxCol = Math.max(maxCol, cell.columnIndex);
        const value = String(cell.value ?? "");
        values.set(cell.rowIndex + ":" + cell.columnIndex,
            /[\t\r\n"]/.test(value) ? '"' + value.replaceAll('"', '""') + '"' : value);
    }
    return Array.from({ length: maxRow - minRow + 1 }, (_, r) =>
        Array.from({ length: maxCol - minCol + 1 }, (_, c) =>
            values.get((r + minRow) + ":" + (c + minCol)) ?? "").join("\t")).join("\n");
}
