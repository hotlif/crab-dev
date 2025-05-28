import { describe, it, expect } from "@jest/globals";
import type { ColumnType } from "../types";

import {
    sortColumns,
    getSkippedCells,
    getMergedCellSize,
    calculateHeaderStructure
} from "../util";

describe("sortColumns", () => {
    it("should not change order if all columns are unfixed", () => {
        const testData: ColumnType<any>[] = [
            { name: "a", title: "A" },
            { name: "b", title: "B" },
            { name: "c", title: "C" }
        ];
        const result = sortColumns([...testData]);
        expect(result.map(col => col.name)).toEqual(["a", "b", "c"]);
    });

    it("should move left fixed columns to the front", () => {
        const testData: ColumnType<any>[] = [
            { name: "a", title: "A" },
            { name: "b", title: "B", fixed: "left" },
            { name: "c", title: "C" }
        ];
        const result = sortColumns([...testData]);
        expect(result.map(col => col.name)).toEqual(["b", "a", "c"]);
    });

    it("should move right fixed columns to the end", () => {
        const testData: ColumnType<any>[] = [
            { name: "a", title: "A" },
            { name: "b", title: "B", fixed: "right" },
            { name: "c", title: "C" }
        ];
        const result = sortColumns([...testData]);
        expect(result.map(col => col.name)).toEqual(["a", "c", "b"]);
    });

    it("should order left, normal, right columns correctly", () => {
        const testData: ColumnType<any>[] = [
            { name: "a", title: "A", fixed: "right" },
            { name: "b", title: "B" },
            { name: "c", title: "C", fixed: "left" },
            { name: "d", title: "D" }
        ];
        const result = sortColumns([...testData]);
        expect(result.map(col => col.name)).toEqual(["c", "b", "d", "a"]);
    });

    it("should handle multiple left and right fixed columns", () => {
        const testData: ColumnType<any>[] = [
            { name: "a", title: "A", fixed: "right" },
            { name: "b", title: "B", fixed: "left" },
            { name: "c", title: "C" },
            { name: "d", title: "D", fixed: "left" },
            { name: "e", title: "E", fixed: "right" },
            { name: "f", title: "F" }
        ];
        const result = sortColumns([...testData]);
        expect(result.map(col => col.name)).toEqual(["b", "d", "c", "f", "a", "e"]);
    });

    it("should not mutate the original array", () => {
        const testData: ColumnType<any>[] = [
            { name: "a", title: "A", fixed: "right" },
            { name: "b", title: "B", fixed: "left" },
            { name: "c", title: "C" }
        ];
        const copy = testData;
        sortColumns(copy);
        expect(copy).toEqual(testData);
    });
});

describe("getSkippedCells", () => {
    it("should return empty array when mergeCells is empty", () => {
        expect(getSkippedCells([])).toEqual([]);
    });

    it("should skip correct cells for a single mergeCell with rowSpan and colSpan", () => {
        const mergeCells = [
            { rowIndex: 1, columnIndex: 2, rowSpan: 1, colSpan: 1 }
        ];

        expect(getSkippedCells(mergeCells)).toEqual([
            { rowIndex: 2, columnIndex: 2 },
            { rowIndex: 1, columnIndex: 3 },
            { rowIndex: 2, columnIndex: 3 }
        ]);
    });

    it("should skip correct cells for multiple mergeCells", () => {
        const mergeCells = [
            { rowIndex: 0, columnIndex: 0, rowSpan: 1, colSpan: 1 },
            { rowIndex: 2, columnIndex: 2, rowSpan: 0, colSpan: 2 }
        ];
        expect(getSkippedCells(mergeCells)).toEqual([
            { rowIndex: 1, columnIndex: 0 },
            { rowIndex: 0, columnIndex: 1 },
            { rowIndex: 1, columnIndex: 1 },
            { rowIndex: 2, columnIndex: 3 },
            { rowIndex: 2, columnIndex: 4 }
        ]);
    });

    it("should handle mergeCell with zero rowSpan and colSpan (no skipped cells)", () => {
        const mergeCells = [
            { rowIndex: 1, columnIndex: 1, rowSpan: 0, colSpan: 0 }
        ];
        expect(getSkippedCells(mergeCells)).toEqual([]);
    });

    it("should handle mergeCell with only rowSpan", () => {
        const mergeCells = [
            { rowIndex: 0, columnIndex: 0, rowSpan: 2, colSpan: 0 }
        ];
        expect(getSkippedCells(mergeCells)).toEqual([
            { rowIndex: 1, columnIndex: 0 },
            { rowIndex: 2, columnIndex: 0 }
        ]);
    });

    it("should handle mergeCell with only colSpan", () => {
        const mergeCells = [
            { rowIndex: 0, columnIndex: 0, rowSpan: 0, colSpan: 2 }
        ];
        expect(getSkippedCells(mergeCells)).toEqual([
            { rowIndex: 0, columnIndex: 1 },
            { rowIndex: 0, columnIndex: 2 }
        ]);
    });

})


describe("getMergedCellSize", () => {
    it("should calculate merged cell size for single cell (rowSpan=0, colSpan=0)", () => {
        const mergeCell = { rowIndex: 1, columnIndex: 2, rowSpan: 0, colSpan: 0 };
        const gridTemplateRows = [10, 20, 30, 40];
        const gridTemplateColumns = [5, 15, 25, 35];
        const result = getMergedCellSize({ mergeCell, gridTemplateRows, gridTemplateColumns });
        expect(result).toEqual({ height: 20, width: 25 });
    });

    it("should calculate merged cell size for rowSpan only", () => {
        const mergeCell = { rowIndex: 0, columnIndex: 1, rowSpan: 2, colSpan: 0 };
        const gridTemplateRows = [10, 20, 30, 40];
        const gridTemplateColumns = [5, 15, 25, 35];
        // height = rows[0] + rows[0+0] + rows[0+1] = 10 + 10 + 20 = 40
        // width = columns[1] = 15
        const result = getMergedCellSize({ mergeCell, gridTemplateRows, gridTemplateColumns });
        expect(result).toEqual({ height: 40, width: 15 });
    });

    it("should calculate merged cell size for colSpan only", () => {
        const mergeCell = { rowIndex: 2, columnIndex: 0, rowSpan: 0, colSpan: 2 };
        const gridTemplateRows = [10, 20, 30, 40];
        const gridTemplateColumns = [5, 15, 25, 35];
        // height = rows[2] = 30
        // width = columns[0] + columns[0+0] + columns[0+1] = 5 + 5 + 15 = 25
        const result = getMergedCellSize({ mergeCell, gridTemplateRows, gridTemplateColumns });
        expect(result).toEqual({ height: 30, width: 25 });
    });

    it("should calculate merged cell size for both rowSpan and colSpan", () => {
        const mergeCell = { rowIndex: 1, columnIndex: 1, rowSpan: 2, colSpan: 2 };
        const gridTemplateRows = [10, 20, 30, 40];
        const gridTemplateColumns = [5, 15, 25, 35];
        // height = rows[1] + rows[1+0] + rows[1+1] = 20 + 20 + 30 = 70
        // width = columns[1] + columns[1+0] + columns[1+1] = 15 + 15 + 25 = 55
        const result = getMergedCellSize({ mergeCell, gridTemplateRows, gridTemplateColumns });
        expect(result).toEqual({ height: 70, width: 55 });
    });
})

describe("calculateHeaderStructure", () => {
    it("should calculate header structure for flat columns", () => {
        const columns = [
            { name: "a", title: "A" },
            { name: "b", title: "B" },
            { name: "c", title: "C" }
        ];
        const result = calculateHeaderStructure(columns as any);
        expect(result.rowCount).toBe(1);
        expect(result.headerCells.length).toBe(3);
        expect(result.leafColumns.length).toBe(3);
        expect(result.headerCells.map(cell => cell.colSpan)).toEqual([1, 1, 1]);
        expect(result.headerCells.map(cell => cell.rowSpan)).toEqual([1, 1, 1]);
    });

    it("should calculate header structure for nested columns", () => {
        const columns = [
            {
                name: "a", title: "A", children: [
                    { name: "a1", title: "A1" },
                    { name: "a2", title: "A2" }
                ]
            },
            { name: "b", title: "B" }
        ];
        const result = calculateHeaderStructure(columns as any);
        expect(result.rowCount).toBe(2);
        expect(result.headerCells.length).toBe(4);
        // Top-level "a" should have colSpan 2, rowSpan 1
        expect(result.headerCells[0].colSpan).toBe(2);
        expect(result.headerCells[0].rowSpan).toBe(1);
        // "a1" and "a2" should have colSpan 1, rowSpan 1
        expect(result.headerCells[1].colSpan).toBe(1);
        expect(result.headerCells[1].rowSpan).toBe(1);
        expect(result.headerCells[2].colSpan).toBe(1);
        expect(result.headerCells[2].rowSpan).toBe(1);
        // "b" should have colSpan 1, rowSpan 2
        expect(result.headerCells[3].colSpan).toBe(1);
        expect(result.headerCells[3].rowSpan).toBe(2);
        // leafColumns should be a1, a2, b
        expect(result.leafColumns.map(col => col.name)).toEqual(["a1", "a2", "b"]);
    });

    it("should calculate header structure for deeply nested columns", () => {
        const columns = [
            {
                name: "a", title: "A", children: [
                    {
                        name: "a1", title: "A1", children: [
                            { name: "a1a", title: "A1A" },
                            { name: "a1b", title: "A1B" }
                        ]
                    }
                ]
            },
            { name: "b", title: "B" }
        ];
        const result = calculateHeaderStructure(columns as any);
        expect(result.rowCount).toBe(3);
        // "a" colSpan 2, rowSpan 1
        expect(result.headerCells[0].colSpan).toBe(2);
        expect(result.headerCells[0].rowSpan).toBe(1);
        // "a1" colSpan 2, rowSpan 1
        expect(result.headerCells[1].colSpan).toBe(2);
        expect(result.headerCells[1].rowSpan).toBe(1);
        // "a1a" and "a1b" colSpan 1, rowSpan 1
        expect(result.headerCells[2].colSpan).toBe(1);
        expect(result.headerCells[2].rowSpan).toBe(1);
        expect(result.headerCells[3].colSpan).toBe(1);
        expect(result.headerCells[3].rowSpan).toBe(1);
        // "b" colSpan 1, rowSpan 3
        expect(result.headerCells[4].colSpan).toBe(1);
        expect(result.headerCells[4].rowSpan).toBe(3);
        // leafColumns should be a1a, a1b, b
        expect(result.leafColumns.map(col => col.name)).toEqual(["a1a", "a1b", "b"]);
    });

    it("should handle empty columns", () => {
        const result = calculateHeaderStructure([]);
        expect(result.rowCount).toBe(1);
        expect(result.headerCells).toEqual([]);
        expect(result.leafColumns).toEqual([]);
    });

    it("should set correct colIndex and rowIndex for header cells", () => {
        const columns = [
            {
                name: "a", title: "A", children: [
                    { name: "a1", title: "A1" },
                    { name: "a2", title: "A2" }
                ]
            },
            { name: "b", title: "B" }
        ];
        const result = calculateHeaderStructure(columns as any);
        // "a" colIndex 0, rowIndex 0
        expect(result.headerCells[0].colIndex).toBe(0);
        expect(result.headerCells[0].rowIndex).toBe(0);
        // "a1" colIndex 0, rowIndex 1
        expect(result.headerCells[1].colIndex).toBe(0);
        expect(result.headerCells[1].rowIndex).toBe(1);
        // "a2" colIndex 1, rowIndex 1
        expect(result.headerCells[2].colIndex).toBe(1);
        expect(result.headerCells[2].rowIndex).toBe(1);
        // "b" colIndex 2, rowIndex 0
        expect(result.headerCells[3].colIndex).toBe(2);
        expect(result.headerCells[3].rowIndex).toBe(0);
    });
});
