import { useEffect, useMemo, useRef, useState } from "react";
import type { VirtualHandle } from "@crab-dev/rc-virtual";
import type { ColumnType, Row } from "../types.js";
import { isInternalRow } from "../util.js";
import type { InternalExpandedRow, InternalGroupRow } from "../util.js";
import { getDataValueAccessor } from "../valueAccess.js";

interface MatchEntry {
    rowIndex: number
    columnIndex: number
    occurrenceInCell: number
}

interface MatchBucket extends MatchEntry {
    count: number
    endExclusive: number
}

interface MatchScanResult<T extends Row> {
    keyword: string
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>
    bottomColumns: ColumnType<T>[]
    skipCellSet: Set<string>
    getCellKey: (rowIndex: number, columnIndex: number) => string
    matchBuckets: MatchBucket[]
    matchCount: number
}

const SYNC_SCAN_CELL_LIMIT = 5_000;
const SCAN_CHUNK_CELL_LIMIT = 1_000;
const SCAN_CHUNK_TIME_BUDGET_MS = 6;

export function useKeywordMatch<T extends Row>(params: {
    highlightKeyword?: string
    activeMatchIndex?: number
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>
    bottomColumns: ColumnType<T>[]
    skipCellSet: Set<string>
    getCellKey: (rowIndex: number, columnIndex: number) => string
    reservedTopPx: number
    fixedLeftWidth: number
    onMatchCountChange?: (count: number) => void
}): {
    virtualRef: import("react").RefObject<VirtualHandle | null>;
    activeMatchMeta: MatchEntry | null;
} {
    const {
        highlightKeyword, activeMatchIndex, displayRows, bottomColumns,
        skipCellSet, getCellKey, reservedTopPx, fixedLeftWidth, onMatchCountChange
    } = params;

    const virtualRef = useRef<VirtualHandle | null>(null);

    const normalizedKeyword = highlightKeyword?.trim() ?? "";
    const columnAccessors = useMemo(
        () => bottomColumns.map(column => getDataValueAccessor(column.name)),
        [bottomColumns]
    );
    const [scanResult, setScanResult] = useState<MatchScanResult<T> | null>(null);

    useEffect(() => {
        let cancelled = false;
        let timerId: number | null = null;
        const lower = normalizedKeyword.toLowerCase();
        const buckets: MatchBucket[] = [];
        let totalCount = 0;
        let rowIndex = 0;
        let columnIndex = 0;

        const commit = () => {
            if (cancelled) return;
            setScanResult({
                keyword: normalizedKeyword,
                displayRows,
                bottomColumns,
                skipCellSet,
                getCellKey,
                matchBuckets: buckets,
                matchCount: totalCount,
            });
        };

        if (!normalizedKeyword) {
            commit();
            return () => { cancelled = true; };
        }

        const scanNextCell = (): boolean => {
            while (rowIndex < displayRows.length) {
                const row = displayRows[rowIndex];
                if (isInternalRow(row) || bottomColumns.length === 0) {
                    rowIndex += 1;
                    columnIndex = 0;
                    continue;
                }
                if (columnIndex >= bottomColumns.length) {
                    rowIndex += 1;
                    columnIndex = 0;
                    continue;
                }

                const currentColumnIndex = columnIndex;
                const column = bottomColumns[currentColumnIndex];
                columnIndex += 1;
                if (skipCellSet.has(getCellKey(rowIndex, currentColumnIndex))) return true;
                const searchText = column.getSearchText?.(row as T);
                const values = searchText != null
                    ? [searchText]
                    : columnAccessors[currentColumnIndex].getAll((row as T).dataRef);
                let countInCell = 0;
                values.forEach(item => {
                    const text = typeof item === "string" ? item : typeof item === "number" ? String(item): null;
                    if (text == null) return;
                    const normalizedText = text.toLowerCase();
                    let from = 0;
                    while (true) {
                        const idx = normalizedText.indexOf(lower, from);
                        if (idx === -1) break;
                        countInCell += 1;
                        from = idx + lower.length;
                    }
                });
                if (countInCell > 0) {
                    totalCount += countInCell;
                    buckets.push({
                        rowIndex,
                        columnIndex: currentColumnIndex,
                        occurrenceInCell: 0,
                        count: countInCell,
                        endExclusive: totalCount,
                    });
                }
                return true;
            }
            return false;
        };

        const totalCellCount = displayRows.length * bottomColumns.length;
        if (totalCellCount <= SYNC_SCAN_CELL_LIMIT) {
            while (scanNextCell()) { /* 同步小表，保持既有回调时序 */ }
            commit();
            return () => { cancelled = true; };
        }

        const runChunk = () => {
            if (cancelled) return;
            const startedAt = performance.now();
            let processed = 0;
            while (
                processed < SCAN_CHUNK_CELL_LIMIT
                && performance.now() - startedAt < SCAN_CHUNK_TIME_BUDGET_MS
                && scanNextCell()
            ) {
                processed += 1;
            }
            if (rowIndex >= displayRows.length) {
                commit();
            } else {
                timerId = globalThis.setTimeout(runChunk, 0) as unknown as number;
            }
        };
        timerId = globalThis.setTimeout(runChunk, 0) as unknown as number;

        return () => {
            cancelled = true;
            if (timerId != null) globalThis.clearTimeout(timerId);
        };
    }, [normalizedKeyword, displayRows, bottomColumns, columnAccessors, skipCellSet, getCellKey]);

    const isCurrentScan = scanResult != null
        && scanResult.keyword === normalizedKeyword
        && scanResult.displayRows === displayRows
        && scanResult.bottomColumns === bottomColumns
        && scanResult.skipCellSet === skipCellSet
        && scanResult.getCellKey === getCellKey;
    const matchBuckets = isCurrentScan ? scanResult.matchBuckets : [];
    const matchCount = isCurrentScan ? scanResult.matchCount : 0;

    useEffect(() => {
        if (isCurrentScan) onMatchCountChange?.(matchCount);
    }, [isCurrentScan, matchCount, onMatchCountChange]);

    const activeMatchMeta = useMemo((): MatchEntry | null => {
        if (activeMatchIndex == null || activeMatchIndex < 0 || activeMatchIndex >= matchCount) return null;
        let low = 0;
        let high = matchBuckets.length - 1;
        while (low < high) {
            const mid = low + Math.floor((high - low) / 2);
            if (matchBuckets[mid].endExclusive > activeMatchIndex) high = mid;
            else low = mid + 1;
        }
        const bucket = matchBuckets[low];
        if (!bucket) return null;
        return {
            rowIndex: bucket.rowIndex,
            columnIndex: bucket.columnIndex,
            occurrenceInCell: activeMatchIndex - (bucket.endExclusive - bucket.count),
        };
    }, [activeMatchIndex, matchBuckets, matchCount]);

    useEffect(() => {
        if (!activeMatchMeta) return;
        const col = bottomColumns[activeMatchMeta.columnIndex];
        virtualRef.current?.scrollToCell({
            rowIndex: activeMatchMeta.rowIndex,
            columnIndex: col?.fixed ? undefined : activeMatchMeta.columnIndex,
            topOffset: reservedTopPx,
            leftOffset: col?.fixed ? undefined : fixedLeftWidth,
        });
    }, [activeMatchMeta, bottomColumns, reservedTopPx, fixedLeftWidth]);

    return { virtualRef, activeMatchMeta };
}
