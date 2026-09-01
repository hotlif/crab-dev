import { describe, expect, it, renderHook } from "@crab-dev/wake/test/react";
import useVirtualItemRange from "../../hooks/useVirtualItemRange.js";

const renderVirtualItemRange = async (params: Parameters<typeof useVirtualItemRange>[0]) => {
    const { result } = await renderHook(() => useVirtualItemRange(params));
    return result.current;
};

describe('useVirtualItemRange', () => {
    it('should return correct range for simple grid and no scroll', async () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 0,
            currentScrollPositionLeft: 0,
            gridTemplateColumns: [50, 50, 50],
            gridTemplateRows: [50, 50, 50],
        };
        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange).toEqual([0, 1]);
        expect(columnRange).toEqual([0, 1]);
    });

    it('should return correct range when scrolled to middle cell', async () => {
        const params = {
            viewportHeight: 50,
            viewportWidth: 50,
            currentScrollPositionTop: 50,
            currentScrollPositionLeft: 50,
            gridTemplateColumns: [50, 50, 50],
            gridTemplateRows: [50, 50, 50],
        };
        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange[0]).toBeGreaterThanOrEqual(1);
        expect(columnRange[0]).toBeGreaterThanOrEqual(1);
    });

    it('should handle uneven grid sizes', async () => {
        const params = {
            viewportHeight: 120,
            viewportWidth: 80,
            currentScrollPositionTop: 30,
            currentScrollPositionLeft: 20,
            gridTemplateColumns: [20, 30, 40, 50],
            gridTemplateRows: [60, 30, 50, 40],
        };
        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange[0]).toBeGreaterThanOrEqual(0);
        expect(rowRange[1]).toBeLessThanOrEqual(3);
        expect(columnRange[0]).toBeGreaterThanOrEqual(0);
        expect(columnRange[1]).toBeLessThanOrEqual(3);
    });

    it('should handle scroll beyond grid', async () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 200,
            currentScrollPositionLeft: 200,
            gridTemplateColumns: [50, 50, 50],
            gridTemplateRows: [50, 50, 50],
        };
        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange[0]).toBeLessThanOrEqual(2);
        expect(columnRange[0]).toBeLessThanOrEqual(2);
    });

    it('should handle single row and column', async () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 0,
            currentScrollPositionLeft: 0,
            gridTemplateColumns: [100],
            gridTemplateRows: [100],
        };
        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange).toEqual([0, 0]);
        expect(columnRange).toEqual([0, 0]);
    });

    it('should handle empty grid', async () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 0,
            currentScrollPositionLeft: 0,
            gridTemplateColumns: [],
            gridTemplateRows: [],
        };
        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange).toEqual([0, 0]);
        expect(columnRange).toEqual([0, 0]);
    });

    it('should clamp start and end index when scroll is beyond total size', async () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 10000,
            currentScrollPositionLeft: 10000,
            gridTemplateColumns: [50, 50, 50],
            gridTemplateRows: [50, 50, 50],
        };

        const {
            rowRange,
            columnRange,
            effectiveScrollPositionTop,
            effectiveScrollPositionLeft,
        } = await renderVirtualItemRange(params);
        expect(effectiveScrollPositionTop).toBe(50);
        expect(effectiveScrollPositionLeft).toBe(50);
        expect(rowRange).toEqual([1, 2]);
        expect(columnRange).toEqual([1, 2]);
    });

    it('should normalize invalid numeric inputs to safe values', async () => {
        const params = {
            viewportHeight: Number.NaN,
            viewportWidth: Number.POSITIVE_INFINITY,
            currentScrollPositionTop: -100,
            currentScrollPositionLeft: Number.NaN,
            gridTemplateColumns: [10, -20, Number.NaN, 30],
            gridTemplateRows: [20, Number.POSITIVE_INFINITY, -10],
        };

        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange).toEqual([0, 0]);
        expect(columnRange).toEqual([0, 0]);
    });

    it('should move start to next item when scroll lands on exact boundary', async () => {
        const params = {
            viewportHeight: 50,
            viewportWidth: 50,
            currentScrollPositionTop: 50,
            currentScrollPositionLeft: 50,
            gridTemplateColumns: [50, 50, 50],
            gridTemplateRows: [50, 50, 50],
        };

        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange).toEqual([1, 1]);
        expect(columnRange).toEqual([1, 1]);
    });

    it('should fallback end to start when duplicated boundaries make end less than start', async () => {
        const params = {
            viewportHeight: 0,
            viewportWidth: 0,
            currentScrollPositionTop: 0,
            currentScrollPositionLeft: 0,
            gridTemplateColumns: [0, 0, 10],
            gridTemplateRows: [0, 0, 10],
        };

        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange).toEqual([2, 2]);
        expect(columnRange).toEqual([2, 2]);
    });

    it('should handle large number of items efficiently', async () => {
        const sizes = Array.from({ length: 100000 }, () => 20);
        const params = {
            viewportHeight: 500,
            viewportWidth: 500,
            currentScrollPositionTop: 50000,
            currentScrollPositionLeft: 50000,
            gridTemplateColumns: sizes,
            gridTemplateRows: sizes,
        };

        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange[0]).toBeGreaterThan(0);
        expect(rowRange[1]).toBeGreaterThan(rowRange[0]);
        expect(rowRange[1] - rowRange[0]).toBeLessThan(100);
        expect(columnRange[0]).toBeGreaterThan(0);
        expect(columnRange[1]).toBeGreaterThan(columnRange[0]);
    });

    it('should handle viewport larger than total content', async () => {
        const params = {
            viewportHeight: 1000,
            viewportWidth: 1000,
            currentScrollPositionTop: 0,
            currentScrollPositionLeft: 0,
            gridTemplateColumns: [50, 50],
            gridTemplateRows: [50, 50],
        };

        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange).toEqual([0, 1]);
        expect(columnRange).toEqual([0, 1]);
    });

    it('should return last item for scroll at end of content', async () => {
        const params = {
            viewportHeight: 50,
            viewportWidth: 50,
            currentScrollPositionTop: 100,
            currentScrollPositionLeft: 100,
            gridTemplateColumns: [50, 50, 50],
            gridTemplateRows: [50, 50, 50],
        };

        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange[1]).toBe(2);
        expect(columnRange[1]).toBe(2);
    });

    it('should handle all zero-sized items', async () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 0,
            currentScrollPositionLeft: 0,
            gridTemplateColumns: [0, 0, 0],
            gridTemplateRows: [0, 0, 0],
        };

        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        expect(rowRange[0]).toBeLessThanOrEqual(rowRange[1]);
        expect(columnRange[0]).toBeLessThanOrEqual(columnRange[1]);
    });

    it('should handle mixed valid and invalid sizes', async () => {
        const params = {
            viewportHeight: 100,
            viewportWidth: 100,
            currentScrollPositionTop: 0,
            currentScrollPositionLeft: 0,
            gridTemplateColumns: [50, -10, NaN, 50],
            gridTemplateRows: [30, Infinity, -5, 30],
        };

        const { rowRange, columnRange } = await renderVirtualItemRange(params);
        // Invalid sizes normalized to 0, so total columns = 50+0+0+50=100, rows = 30+0+0+30=60
        expect(rowRange[0]).toBeGreaterThanOrEqual(0);
        expect(columnRange[0]).toBeGreaterThanOrEqual(0);
    });

    it('should reuse precomputed axis metrics when only scroll positions change', async () => {
        const gridTemplateColumns = Array.from({ length: 1000 }, () => 40);
        const gridTemplateRows = Array.from({ length: 100000 }, () => 20);
        const { result, rerender } = await renderHook(
            ({ top, left }: { top: number; left: number }) => useVirtualItemRange({
                viewportHeight: 500,
                viewportWidth: 500,
                currentScrollPositionTop: top,
                currentScrollPositionLeft: left,
                gridTemplateColumns,
                gridTemplateRows,
            }),
            { initialProps: { top: 0, left: 0 } }
        );
        const firstRowMetrics = result.current.rowMetrics;
        const firstColumnMetrics = result.current.columnMetrics;

        await rerender({ top: 50000, left: 10000 });

        expect(result.current.rowMetrics).toBe(firstRowMetrics);
        expect(result.current.columnMetrics).toBe(firstColumnMetrics);
        expect(result.current.rowRange[0]).toBeGreaterThan(0);
        expect(result.current.columnRange[0]).toBeGreaterThan(0);
    });

    it('should rebuild only the axis whose template reference changes', async () => {
        const gridTemplateColumns = [50, 50];
        const gridTemplateRows = [20, 20, 20];
        const { result, rerender } = await renderHook(
            ({ rows }: { rows: number[] }) => useVirtualItemRange({
                viewportHeight: 40,
                viewportWidth: 50,
                currentScrollPositionTop: 0,
                currentScrollPositionLeft: 0,
                gridTemplateColumns,
                gridTemplateRows: rows,
            }),
            { initialProps: { rows: gridTemplateRows } }
        );
        const firstRowMetrics = result.current.rowMetrics;
        const firstColumnMetrics = result.current.columnMetrics;

        await rerender({ rows: [...gridTemplateRows, 20] });

        expect(result.current.rowMetrics).not.toBe(firstRowMetrics);
        expect(result.current.rowMetrics.totalSize).toBe(80);
        expect(result.current.columnMetrics).toBe(firstColumnMetrics);
    });

    it('should use uniform axis metadata and expand the visible range with overscan', async () => {
        const sizes = Array.from({ length: 10 }, () => 20);
        const result = await renderVirtualItemRange({
            viewportHeight: 40,
            viewportWidth: 40,
            currentScrollPositionTop: 80,
            currentScrollPositionLeft: 80,
            gridTemplateColumns: sizes,
            gridTemplateRows: sizes,
            overscanRowCount: 2,
            overscanColumnCount: 1,
        });

        expect(result.rowMetrics.uniformSize).toBe(20);
        expect(result.columnMetrics.uniformSize).toBe(20);
        expect(result.rowRange).toEqual([2, 7]);
        expect(result.columnRange).toEqual([3, 6]);
    });

    it('should fall back to binary search metadata for variable item sizes', async () => {
        const result = await renderVirtualItemRange({
            viewportHeight: 40,
            viewportWidth: 40,
            currentScrollPositionTop: 20,
            currentScrollPositionLeft: 20,
            gridTemplateColumns: [20, 30, 20],
            gridTemplateRows: [20, 30, 20],
        });

        expect(result.rowMetrics.uniformSize).toBeNull();
        expect(result.columnMetrics.uniformSize).toBeNull();
        expect(result.rowRange).toEqual([1, 2]);
        expect(result.columnRange).toEqual([1, 2]);
    });
});
