export const meta = {
    title: "表头合并",
    description: "通过 children 配置实现多级表头（头部合并）",
};

import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";
import { makeEmployees, type Employee } from "./_mock.js";

interface DemoRow extends Row {
	dataRef: Employee & { recordNo: string }
}

const columns: ColumnType<DemoRow>[] = [
    {
        title: "记录号",
        name: "$.recordNo",
        width: 120
    },
    {
        title: "员工信息",
        name: "$.employee",
        children: [
            {
                title: "工号",
                name: "$.employeeNo",
                width: 130
            },
            {
                title: "姓名",
                name: "$.name",
                width: 120
            },
            {
                title: "性别",
                name: "$.gender",
                width: 90
            },
            {
                title: "年龄",
                name: "$.age",
                width: 90,
                align: "right"
            }
        ]
    },
    {
        title: "联系方式",
        name: "$.contact",
        children: [
            {
                title: "电话",
                name: "$.phone",
                width: 170
            },
            {
                title: "邮箱",
                name: "$.email",
                width: 240
            },
            {
                title: "省份",
                name: "$.province",
                width: 120
            },
            {
                title: "城市",
                name: "$.city",
                width: 130
            },
            {
                title: "详细地址",
                name: "$.address",
                width: 280
            }
        ]
    },
    {
        title: "岗位信息",
        name: "$.position",
        children: [
            {
                title: "公司",
                name: "$.company",
                width: 220
            },
            {
                title: "部门",
                name: "$.department",
                width: 150
            },
            {
                title: "职位",
                name: "$.jobTitle",
                width: 180
            },
            {
                title: "绩效",
                name: "$.performance",
                width: 110
            },
            {
                title: "月薪",
                name: "$.salary",
                width: 130,
                align: "right"
            },
            {
                title: "奖金",
                name: "$.bonus",
                width: 130,
                align: "right"
            },
            {
                title: "状态",
                name: "$.status",
                width: 110
            },
            {
                title: "入职日期",
                name: "$.joinDate",
                width: 150
            }
        ]
    },
    {
        title: "标签",
        name: "$.tag",
        width: 130
    },
    {
        title: "工龄(年)",
        name: "$.yearsOfService",
        width: 120,
        align: "right"
    }
]

const rows: DemoRow[] = makeEmployees(2000, 20260304).map((employee, index) => ({
    id: `${index + 1}`,
    dataRef: {
        ...employee,
        recordNo: `R-${String(index + 1).padStart(5, "0")}`,
    },
}))

const MergeTableHeadersDemo = () => {
    return (
        <Table
            width={1250}
            height={320}
            columns={columns}
            rows={rows}
        />
    )
}

export default MergeTableHeadersDemo;
