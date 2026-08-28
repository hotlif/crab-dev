
export const meta = {
    title: "行分组",
    description: "通过 groupBy 按列名进行多级分组。分组 banner 渲染在对应列的位置，叶子行中已分组的列保持空白以避免信息重复（与 react-data-grid 行为一致）。",
};

import { useMemo, useState, type Key } from "react";
import { fakerZH_CN as faker } from "@faker-js/faker";
import Table from "../../src/index.js";
import type { ColumnType, GroupCellRenderParam, Row } from "../../src/index.js";

interface DemoRow extends Row {
    dataRef: {
        country: string
        city: string
        department: string
        title: string
        name: string
        salary: number
        bonus: number
        stock: number
        totalComp: number
    }
}

const columns: ColumnType<DemoRow>[] = [
    { title: "国家", name: "$.country", width: 200 },
    { title: "城市", name: "$.city", width: 200 },
    { title: "部门", name: "$.department", width: 180 },
    { title: "职级", name: "$.title", width: 140 },
    { title: "姓名", name: "$.name", width: 160 },
    { title: "月薪", name: "$.salary", width: 140, align: "right" },
    { title: "奖金", name: "$.bonus", width: 140, align: "right" },
    { title: "股权折算", name: "$.stock", width: 150, align: "right" },
    { title: "总包", name: "$.totalComp", width: 140, align: "right" }
];

faker.seed(20260604);

const countries = ["中国", "日本", "美国"];
const citiesByCountry: Record<string, string[]> = {
    中国: ["上海", "北京", "深圳"],
    日本: ["东京", "大阪"],
    美国: ["纽约", "旧金山"]
};
const departments = ["研发", "设计", "市场"];
const titles = ["P5", "P6", "P7", "M1"];

// 分组按"相邻同值合并"，需保证同一分组的数据相邻
const sourceRows: DemoRow[] = countries.flatMap((country, ci) =>
    citiesByCountry[country].flatMap((city, cityIdx) =>
        departments.flatMap((department, di) => {
            const count = faker.number.int({ min: 1, max: 3 });
            return Array.from({ length: count }, (_, k) => ({
                id: `${ci}-${cityIdx}-${di}-${k}`,
                dataRef: (() => {
                    const salary = faker.number.int({ min: 8000, max: 50000 });
                    const bonus = faker.number.int({ min: 1000, max: 20000 });
                    const stock = faker.number.int({ min: 0, max: 15000 });
                    return {
                        country,
                        city,
                        department,
                        title: faker.helpers.arrayElement(titles),
                        name: faker.person.fullName(),
                        salary,
                        bonus,
                        stock,
                        totalComp: salary + bonus + stock
                    };
                })()
            }));
        })
    )
);

const RowGroupingDemo = () => {
    // 受控演示：默认全部收起；点击 banner 可逐个展开
    const [expandedGroupIds, setExpandedGroupIds] = useState<Set<Key>>(() => new Set());

    const columnsWithRender = useMemo<ColumnType<DemoRow>[]>(() => columns.map((column) => {
        if (column.name === "$.salary" || column.name === "$.bonus" || column.name === "$.stock" || column.name === "$.totalComp") {
            return {
                ...column,
                render: ({ row }) => {
                    const value = column.name === "$.salary"
                        ? row.dataRef.salary
                        : column.name === "$.bonus"
                            ? row.dataRef.bonus
                            : column.name === "$.stock"
                                ? row.dataRef.stock
                                : row.dataRef.totalComp;
                    return `¥ ${value.toLocaleString()}`;
                }
            };
        }
        return column;
    }), []);

    const renderGroupCell = ({
        group,
        currentColumn,
        isGroupColumn,
        originalElement
    }: GroupCellRenderParam<DemoRow>) => {
        if (isGroupColumn) {
            return originalElement;
        }

        const count = group.leafRows.length;
        const sum = (selector: (row: DemoRow) => number) => group.leafRows.reduce((acc, row) => acc + selector(row), 0);

        if (currentColumn.name === "$.name") {
            return `${count} 人`;
        }

        if (currentColumn.name === "$.salary") {
            const avg = Math.round(sum((row) => row.dataRef.salary) / Math.max(count, 1));
            return `均值 ¥ ${avg.toLocaleString()} (${count})`;
        }

        if (currentColumn.name === "$.bonus") {
            return `合计 ¥ ${sum((row) => row.dataRef.bonus).toLocaleString()}`;
        }

        if (currentColumn.name === "$.stock") {
            return `合计 ¥ ${sum((row) => row.dataRef.stock).toLocaleString()}`;
        }

        if (currentColumn.name === "$.totalComp") {
            return `合计 ¥ ${sum((row) => row.dataRef.totalComp).toLocaleString()}`;
        }

        return null;
    };

    return (
        <Table
            width={1000}
            height={420}
            columns={columnsWithRender}
            rows={sourceRows}
            groupBy={["$.country", "$.city", "$.department"]}
            expandedGroupIds={expandedGroupIds}
            onExpandedGroupIdsChange={setExpandedGroupIds}
            renderGroupCell={renderGroupCell}
        />
    );
};

export default RowGroupingDemo;
