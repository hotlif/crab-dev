
/**
 * title = "底部汇总行"
 * description = "通过 showSummary 开启底部固定汇总行，各列由 summaryRender 提供合计 / 平均等聚合内容；汇总行始终贴住底部，固定列横向同步固定。"
 */

import Table from "../../src/index.js";
import type { ColumnType, Row, SummaryCellParam } from "../../src/index.js";
import { fakerZH_CN as faker } from "@faker-js/faker";

interface DemoRow extends Row {
    dataRef: {
        employeeNo: string
        name: string
        age: number
        department: string
        city: string
        salary: number
    }
}

const sum = (rows: DemoRow[], pick: (row: DemoRow) => number) =>
    rows.reduce((acc, row) => acc + pick(row), 0);

const columns: ColumnType<DemoRow>[] = [
    {
        title: "工号",
        name: "$.employeeNo",
        width: 140,
        fixed: "left",
        summaryRender: () => "合计"
    },
    {
        title: "姓名",
        name: "$.name",
        width: 140,
        summaryRender: ({ rows }: SummaryCellParam<DemoRow>) => `${rows.length} 人`
    },
    {
        title: "年龄",
        name: "$.age",
        width: 120,
        align: "right",
        summaryRender: ({ rows }: SummaryCellParam<DemoRow>) =>
            `平均 ${(sum(rows, (row) => row.dataRef.age) / rows.length).toFixed(1)}`
    },
    {
        title: "部门",
        name: "$.department",
        width: 180
    },
    {
        title: "城市",
        name: "$.city",
        width: 160
    },
    {
        title: "月薪",
        name: "$.salary",
        width: 160,
        fixed: "right",
        align: "right",
        render: ({ row }) => `¥${row.dataRef.salary.toLocaleString()}`,
        summaryRender: ({ rows }: SummaryCellParam<DemoRow>) =>
            `¥${sum(rows, (row) => row.dataRef.salary).toLocaleString()}`
    }
];

faker.seed(20260625)

const rows: DemoRow[] = Array.from({ length: 200 }, (_, index) => ({
    id: `${index + 1}`,
    dataRef: {
        employeeNo: `EMP-${String(index + 1).padStart(4, "0")}`,
        name: faker.person.fullName(),
        age: faker.number.int({ min: 22, max: 55 }),
        department: faker.commerce.department(),
        city: faker.location.city(),
        salary: faker.number.int({ min: 8000, max: 50000 })
    }
}))

const SummaryDemo = () => {
    return (
        <Table
            width={900}
            height={320}
            columns={columns}
            rows={rows}
            showSummary
        />
    )
}

export default SummaryDemo;
