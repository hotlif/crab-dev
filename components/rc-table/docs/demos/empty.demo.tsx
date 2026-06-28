
/**
 * title = "空状态"
 * description = "当 rows 为空数组时，表格 body 区域自动显示空状态。默认使用内置 Empty 组件；可通过 empty prop 传入自定义内容，或传 null 禁用。"
 */

import { useState } from "react";
import Empty from "@crab-dev/rc-empty";
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
    { title: "部门", name: "$.department", width: 130 },
    { title: "职位", name: "$.jobTitle", width: 150 },
    { title: "城市", name: "$.city", width: 100 },
];

const fullRows: DemoRow[] = makeEmployees(20).map((employee, index) => ({
    id: `${index + 1}`,
    dataRef: employee,
}));

const EmptyDemo = () => {
    const [rows, setRows] = useState<DemoRow[]>([]);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            <div style={{ display: "flex", gap: 8 }}>
                <button onClick={() => setRows([])}>清空数据（默认空状态）</button>
                <button onClick={() => setRows(fullRows)}>加载数据</button>
            </div>
            <Table
                width={700}
                height={320}
                columns={columns}
                rows={rows}
            />

            <p style={{ margin: "8px 0 4px", fontWeight: 600 }}>搜索无结果（search preset）</p>
            <Table
                width={700}
                height={240}
                columns={columns}
                rows={[]}
                empty={<Empty preset="search" />}
            />

            <p style={{ margin: "8px 0 4px", fontWeight: 600 }}>无权限（no-permission preset）</p>
            <Table
                width={700}
                height={240}
                columns={columns}
                rows={[]}
                empty={<Empty preset="no-permission" />}
            />
        </div>
    );
};

export default EmptyDemo;
