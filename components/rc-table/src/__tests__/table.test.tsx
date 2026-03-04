import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it, jest } from "@jest/globals";

import Table from "../table";
import type { ColumnType, MergeCell, Row } from "../types";

interface DemoRow extends Row {
    dataRef: {
        recordNo: string;
        businessUnit: string;
        city: string;
        accountManager: string;
        amount: number;
    }
}

const groupedColumns: ColumnType<DemoRow>[] = [
    {
        title: "记录号",
        name: "$.recordNo",
        width: 120
    },
    {
        title: "客户信息",
        name: "$.customer",
        children: [
            {
                title: "大区",
                name: "$.businessUnit",
                width: 120
            },
            {
                title: "城市",
                name: "$.city",
                width: 120
            },
            {
                title: "客户经理",
                name: "$.accountManager",
                width: 140
            }
        ]
    },
    {
        title: "金额",
        name: "$.amount",
        width: 120,
        align: "right"
    }
];

const fixedColumns: ColumnType<DemoRow>[] = [
    {
        title: "记录号",
        name: "$.recordNo",
        width: 120
    },
    {
        title: "大区",
        name: "$.businessUnit",
        width: 120,
        fixed: "left"
    },
    {
        title: "城市",
        name: "$.city",
        width: 120,
        fixed: "left"
    },
    {
        title: "客户经理",
        name: "$.accountManager",
        width: 140
    },
    {
        title: "金额",
        name: "$.amount",
        width: 120,
        align: "right"
    }
];

const renderTable = (element: React.ReactElement) => render(element);

(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const buildRows = (): DemoRow[] => {
    return [
        {
            id: "1",
            dataRef: {
                recordNo: "R-0001",
                businessUnit: "华北大区",
                city: "北京",
                accountManager: "李文博",
                amount: 120000
            }
        },
        {
            id: "2",
            dataRef: {
                recordNo: "R-0002",
                businessUnit: "华北大区",
                city: "北京",
                accountManager: "王若琳",
                amount: 98000
            }
        },
        {
            id: "3",
            dataRef: {
                recordNo: "R-0003",
                businessUnit: "华东大区",
                city: "上海",
                accountManager: "周子墨",
                amount: 188000
            }
        }
    ];
};

describe("Table", () => {
    afterEach(() => {
        cleanup();
    });

    it("renders grouped headers and basic cell content", () => {
        const { container, unmount } = renderTable(
            <Table
                width={700}
                height={260}
                columns={groupedColumns}
                rows={buildRows()}
            />
        );

        const text = container.textContent ?? "";
        expect(text).toContain("记录号");
        expect(text).toContain("客户信息");
        expect(text).toContain("客户经理");
        expect(text).toContain("R-0001");
        expect(text).toContain("李文博");

        unmount();
    });

    it("renders merged text when mergeCells and fixed columns are used together", () => {
        const mergeCells: MergeCell[] = [
            { rowIndex: 0, columnIndex: 1, rowSpan: 1, colSpan: 0 },
            { rowIndex: 0, columnIndex: 2, rowSpan: 1, colSpan: 0 }
        ];

        const { container, unmount } = renderTable(
            <Table
                width={700}
                height={260}
                columns={fixedColumns}
                rows={buildRows()}
                mergeCells={mergeCells}
            />
        );

        const text = container.textContent ?? "";
        expect(text).toContain("华北大区");
        expect(text).toContain("北京");

        unmount();
    });

    it("supports getRowHeight and headerRowHeight props", () => {
        const getRowHeight = jest.fn((row: DemoRow, rowIndex: number) => {
            if (rowIndex === 1) {
                return 52;
            }
            return undefined;
        });

        const { container, unmount } = renderTable(
            <Table
                width={700}
                height={260}
                columns={groupedColumns}
                rows={buildRows()}
                getRowHeight={getRowHeight}
                headerRowHeight={40}
            />
        );

        expect(getRowHeight).toHaveBeenCalledWith(expect.objectContaining({ id: "1" }), 0);
        expect(getRowHeight).toHaveBeenCalledWith(expect.objectContaining({ id: "2" }), 1);
        expect(getRowHeight).toHaveBeenCalledWith(expect.objectContaining({ id: "3" }), 2);
        expect(getRowHeight.mock.calls.length).toBeGreaterThanOrEqual(3);

        const root = container.firstElementChild as HTMLElement;
        expect(root.getAttribute("style")).toContain("--crab-rc-virtual-top-padding-height-offset: 80px");

        unmount();
    });
});
