import { describe, it, expect } from "@jest/globals";
import type { ColumnType } from "../types";

import {
    sortColumns,
    getSkippedCells,
    getMergedCellSize,
    getMaxDepth,
    calculateColumnDepth,
    getBottomColumns,
    getHeaderCells
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

describe("calculateColumnDepth", () => {
    it("should return 1 for a column with no children", () => {
        const column = { name: "a", title: "A" };
        expect(calculateColumnDepth(column, 1)).toBe(1);
    });

    it("should return correct depth for a column with one level of children", () => {
        const column = {
            name: "a",
            title: "A",
            children: [
                { name: "b", title: "B" },
                { name: "c", title: "C" }
            ]
        };
        expect(calculateColumnDepth(column, 1)).toBe(2);
    });

    it("should return correct depth for a column with nested children", () => {
        const column = {
            name: "a",
            title: "A",
            children: [
                {
                    name: "b",
                    title: "B",
                    children: [
                        { name: "c", title: "C" }
                    ]
                }
            ]
        };
        expect(calculateColumnDepth(column, 1)).toBe(3);
    });

    it("should return the maximum depth among all children", () => {
        const column = {
            name: "a",
            title: "A",
            children: [
                { name: "b", title: "B" },
                {
                    name: "c",
                    title: "C",
                    children: [
                        { name: "d", title: "D" }
                    ]
                }
            ]
        };
        expect(calculateColumnDepth(column, 1)).toBe(3);
    });

    it("should handle empty children array", () => {
        const column = {
            name: "a",
            title: "A",
            children: []
        };
        expect(calculateColumnDepth(column, 1)).toBe(1);
    });
});


describe("getMaxDepth", () => {
    it("should return 1 for columns with no children", () => {
        const columns = [
            { name: "a", title: "A" },
            { name: "b", title: "B" }
        ];
        expect(getMaxDepth(columns)).toBe(1);
    });

    it("should return correct max depth for columns with one level of children", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: [
                    { name: "a1", title: "A1" }
                ]
            },
            { name: "b", title: "B" }
        ];
        expect(getMaxDepth(columns)).toBe(2);
    });

    it("should return correct max depth for columns with nested children", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: [
                    {
                        name: "a1",
                        title: "A1",
                        children: [
                            { name: "a1a", title: "A1A" }
                        ]
                    }
                ]
            },
            { name: "b", title: "B" }
        ];
        expect(getMaxDepth(columns)).toBe(3);
    });

    it("should return the maximum depth among all columns", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: [
                    { name: "a1", title: "A1" }
                ]
            },
            {
                name: "b",
                title: "B",
                children: [
                    {
                        name: "b1",
                        title: "B1",
                        children: [
                            { name: "b1a", title: "B1A" }
                        ]
                    }
                ]
            }
        ];
        expect(getMaxDepth(columns)).toBe(3);
    });

    it("should handle columns with empty children arrays", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: []
            },
            { name: "b", title: "B" }
        ];
        expect(getMaxDepth(columns)).toBe(1);
    });

    it("should handle deeply nested columns", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: [
                    {
                        name: "a1",
                        title: "A1",
                        children: [
                            {
                                name: "a1a",
                                title: "A1A",
                                children: [
                                    { name: "a1a1", title: "A1A1" }
                                ]
                            }
                        ]
                    }
                ]
            },
            { name: "b", title: "B" }
        ];
        expect(getMaxDepth(columns)).toBe(4);
    });
});

describe("getBottomColumns", () => {
    it("should return the same columns if there are no children", () => {
        const columns = [
            { name: "a", title: "A" },
            { name: "b", title: "B" }
        ];
        const result = getBottomColumns(columns);
        expect(result).toEqual(columns);
    });

    it("should return only leaf columns for one level of children", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: [
                    { name: "a1", title: "A1" },
                    { name: "a2", title: "A2" }
                ]
            },
            { name: "b", title: "B" }
        ];
        const result = getBottomColumns(columns);
        expect(result).toEqual([
            { name: "a1", title: "A1" },
            { name: "a2", title: "A2" },
            { name: "b", title: "B" }
        ]);
    });

    it("should return only leaf columns for nested children", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: [
                    {
                        name: "a1",
                        title: "A1",
                        children: [
                            { name: "a1a", title: "A1A" }
                        ]
                    }
                ]
            },
            { name: "b", title: "B" }
        ];
        const result = getBottomColumns(columns);
        expect(result).toEqual([
            { name: "a1a", title: "A1A" },
            { name: "b", title: "B" }
        ]);
    });

    it("should handle columns with empty children arrays", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: []
            },
            { name: "b", title: "B" }
        ];
        const result = getBottomColumns(columns);
        expect(result).toEqual([
            {
                name: "a",
                title: "A",
                children: []
            },
            { name: "b", title: "B" }
        ]);
    });

    it("should handle deeply nested columns", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: [
                    {
                        name: "a1",
                        title: "A1",
                        children: [
                            {
                                name: "a1a",
                                title: "A1A",
                                children: [
                                    { name: "a1a1", title: "A1A1" }
                                ]
                            }
                        ]
                    }
                ]
            },
            { name: "b", title: "B" }
        ];
        const result = getBottomColumns(columns);
        expect(result).toEqual([
            { name: "a1a1", title: "A1A1" },
            { name: "b", title: "B" }
        ]);
    });
});

describe("getHeaderCells", () => {
    it("should return correct header cells for flat columns", () => {
        const columns = [
            { name: "a", title: "A" },
            { name: "b", title: "B" }
        ];
        const result = getHeaderCells(columns);
        expect(result).toEqual([
            {
                column: { name: "a", title: "A" },
                colSpan: 0,
                rowSpan: 0,
                rowIndex: 0,
                columnIndex: 0
            },
            {
                column: { name: "b", title: "B" },
                colSpan: 0,
                rowSpan: 0,
                rowIndex: 0,
                columnIndex: 1
            }
        ]);
    });

    it("should return correct header cells for columns with one level of children", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: [
                    { name: "a1", title: "A1" },
                    { name: "a2", title: "A2" }
                ]
            },
            { name: "b", title: "B" }
        ];


        //   [AAAAA(colSpan[1])  BB(rowSpan[1]) ]
        //   [A1 A2              BB             ]
        const result = getHeaderCells(columns);
        expect(result).toEqual([
            {
                column: {
                    name: "a",
                    title: "A",
                    children: [
                        { name: "a1", title: "A1" },
                        { name: "a2", title: "A2" }
                    ]
                },
                colSpan: 1,
                rowSpan: 0,
                rowIndex: 0,
                columnIndex: 0
            },
            {
                column: { name: "a1", title: "A1" },
                colSpan: 0,
                rowSpan: 0,
                rowIndex: 1,
                columnIndex: 0
            },
            {
                column: { name: "a2", title: "A2" },
                colSpan: 0,
                rowSpan: 0,
                rowIndex: 1,
                columnIndex: 1
            },
            {
                column: { name: "b", title: "B" },
                colSpan: 0,
                rowSpan: 1,
                rowIndex: 0,
                columnIndex: 2
            },
        ]);
    });

    it("should return correct header cells for deeply nested columns", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: [
                    {
                        name: "a1",
                        title: "A1",
                        children: [
                            { name: "a1a", title: "A1A" }
                        ]
                    }
                ]
            },
            { name: "b", title: "B" }
        ];
        const result = getHeaderCells(columns);
        expect(result).toEqual([
            {
                column: {
                    name: "a",
                    title: "A",
                    children: [
                        {
                            name: "a1",
                            title: "A1",
                            children: [
                                { name: "a1a", title: "A1A" }
                            ]
                        }
                    ]
                },
                colSpan: 0,
                rowSpan: 0,
                rowIndex: 0,
                columnIndex: 0
            },
            {
                column: {
                    name: "a1",
                    title: "A1",
                    children: [
                        { name: "a1a", title: "A1A" }
                    ]
                },
                colSpan: 0,
                rowSpan: 0,
                rowIndex: 1,
                columnIndex: 0
            },
            {
                column: { name: "a1a", title: "A1A" },
                colSpan: 0,
                rowSpan: 0,
                rowIndex: 2,
                columnIndex: 0
            },
            {
                column: { name: "b", title: "B" },
                colSpan: 0,
                rowSpan: 2,
                rowIndex: 0,
                columnIndex: 1
            }
        ]);
    });

    it("should handle columns with empty children arrays", () => {
        const columns = [
            {
                name: "a",
                title: "A",
                children: []
            },
            { name: "b", title: "B" }
        ];
        const result = getHeaderCells(columns);
        expect(result).toEqual([
            {
                column: {
                    name: "a",
                    title: "A",
                    children: []
                },
                colSpan: 0,
                rowSpan: 0,
                rowIndex: 0,
                columnIndex: 0
            },
            {
                column: { name: "b", title: "B" },
                colSpan: 0,
                rowSpan: 0,
                rowIndex: 0,
                columnIndex: 1
            }
        ]);
    });
});
