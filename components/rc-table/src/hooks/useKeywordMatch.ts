import { JSONPath } from "jsonpath-plus";
import { useEffect, useMemo, useRef } from "react";
import type { VirtualHandle } from "@crab-dev/rc-virtual";
import type { ColumnType, Row } from "../types.js";
import { isGroupRow } from "../util.js";
import type { InternalGroupRow } from "../util.js";

interface MatchEntry {
    rowIndex: number
    columnIndex: number
    occurrenceInCell: number
}

export function useKeywordMatch<T extends Row>(params: {
    highlightKeyword?: string
    activeMatchIndex?: number
    displayRows: Array<T | InternalGroupRow<T>>
    bottomColumns: ColumnType<T>[]
    skipCellSet: Set<string>
    getCellKey: (rowIndex: number, columnIndex: number) => string
    reservedTopPx: number
    fixedLeftWidth: number
    onMatchCountChange?: (count: number) => void
}) {
    const {
        highlightKeyword, activeMatchIndex, displayRows, bottomColumns,
        skipCellSet, getCellKey, reservedTopPx, fixedLeftWidth, onMatchCountChange
    } = params;

    const virtualRef = useRef<VirtualHandle | null>(null);

    const allMatches = useMemo((): MatchEntry[] => {
        const kw = highlightKeyword?.trim();
        if (!kw) return [];
        const lower = kw.toLowerCase();
        const result: MatchEntry[] = [];
        displayRows.forEach((row, rowIndex) => {
            if (isGroupRow(row)) return;
            bottomColumns.forEach((column, columnIndex) => {
                if (skipCellSet.has(getCellKey(rowIndex, columnIndex))) return;
                const searchText = column.getSearchText?.(row as T);
                const arr: unknown[] = searchText != null
                    ? [searchText]
                    : (() => {
                        const r = JSONPath({ path: column.name, json: (row as T).dataRef });
                        return Array.isArray(r) ? r : [r];
                    })();
                let occurrenceInCell = 0;
                arr.forEach(item => {
                    const text = typeof item === "string" ? item : typeof item === "number" ? String(item) : null;
                    if (text == null) return;
                    let from = 0;
                    while (true) {
                        const idx = text.toLowerCase().indexOf(lower, from);
                        if (idx === -1) break;
                        result.push({ rowIndex, columnIndex, occurrenceInCell });
                        occurrenceInCell++;
                        from = idx + lower.length;
                    }
                });
            });
        });
        return result;
    }, [highlightKeyword, displayRows, bottomColumns, skipCellSet, getCellKey]);

    const allMatchesRef = useRef<MatchEntry[]>(allMatches);
    useEffect(() => { allMatchesRef.current = allMatches; }, [allMatches]);

    useEffect(() => {
        onMatchCountChange?.(allMatches.length);
    }, [allMatches.length, onMatchCountChange]);

    useEffect(() => {
        if (activeMatchIndex == null || allMatchesRef.current.length === 0) return;
        const match = allMatchesRef.current[activeMatchIndex];
        if (!match) return;
        const col = bottomColumns[match.columnIndex];
        virtualRef.current?.scrollToCell({
            rowIndex: match.rowIndex,
            columnIndex: col?.fixed ? undefined : match.columnIndex,
            topOffset: reservedTopPx,
            leftOffset: col?.fixed ? undefined : fixedLeftWidth,
        });
    }, [activeMatchIndex, bottomColumns, reservedTopPx, fixedLeftWidth]);

    const activeMatchMeta = useMemo((): MatchEntry | null => {
        if (activeMatchIndex == null || activeMatchIndex < 0 || allMatches.length === 0) return null;
        return allMatches[activeMatchIndex] ?? null;
    }, [activeMatchIndex, allMatches]);

    return { virtualRef, activeMatchMeta };
}
