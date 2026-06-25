
/**
 * title = "列宽拖拽调整"
 * description = "在表头右边缘拖拽可调整列宽。设置 Table resizable 全局开启，也可通过 ColumnType.resizable 逐列控制。"
 */

import { useState } from "react";
import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";
import { makeEmployees, type Employee } from "./_mock.js";

interface DemoRow extends Row {
    dataRef: Employee
}

const rows: DemoRow[] = makeEmployees(500, 20260601).map((employee, index) => ({
    id: `${index + 1}`,
    dataRef: employee,
}))

const ColumnResizeDemo = () => {
    const [columns, setColumns] = useState<ColumnType<DemoRow>[]>([
        { title: "姓名", name: "$.name", width: 140, fixed: "left" },
        { title: "年龄", name: "$.age", width: 80, align: "right" },
        { title: "邮箱", name: "$.email", width: 260 },
        { title: "部门", name: "$.department", width: 160 },
        { title: "职位", name: "$.jobTitle", width: 200 },
        { title: "城市", name: "$.city", width: 120 },
        { title: "月薪", name: "$.salary", width: 120, align: "right", resizable: false },
    ])

    return (
        <div>
            <p style={{ marginBottom: 8, color: "#666", fontSize: 13 }}>
                拖拽列头右边缘调整列宽；「月薪」列通过 <code>resizable: false</code> 单独禁用了拖拽
            </p>
            <Table
                width={900}
                height={360}
                columns={columns}
                rows={rows}
                resizable
                onColumnResize={(columnName, width) => {
                    setColumns(prev => prev.map(col =>
                        col.name === columnName ? { ...col, width } : col
                    ))
                }}
            />
        </div>
    )
}

export default ColumnResizeDemo;