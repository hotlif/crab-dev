
/**
 * title = "基础表格"
 * description = "一个简单的表格信息，展示基础的表格功能"
 */

import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";
import { makeEmployees, type Employee } from "./_mock.js";

interface DemoRow extends Row {
    dataRef: Employee
}

const columns: ColumnType<DemoRow>[] = [
    { title: "工号", name: "$.employeeNo", width: 120 },
    { title: "姓名", name: "$.name", width: 110 },
    { title: "性别", name: "$.gender", width: 80, align: "center" },
    { title: "年龄", name: "$.age", width: 80, align: "right" },
    { title: "部门", name: "$.department", width: 130 },
    { title: "职位", name: "$.jobTitle", width: 150 },
    { title: "职级", name: "$.position", width: 110 },
    { title: "城市", name: "$.city", width: 100 },
    { title: "公司", name: "$.company", width: 160 },
    { title: "邮箱", name: "$.email", width: 240 },
    { title: "电话", name: "$.phone", width: 150 },
    { title: "绩效", name: "$.performance", width: 80, align: "center" },
    { title: "状态", name: "$.status", width: 90 },
    { title: "月薪", name: "$.salary", width: 120, align: "right",
        render: ({ row }) => `¥${row.dataRef.salary.toLocaleString()}` },
    { title: "入职日期", name: "$.joinDate", width: 130 },
];

const rows: DemoRow[] = makeEmployees(2000).map((employee, index) => ({
    id: `${index + 1}`,
    dataRef: employee,
}));

const BasisDemo = () => {
    return (
        <Table
            width={1250}
            height={320}
            columns={columns}
            rows={rows}
        />
    );
};

export default BasisDemo;
