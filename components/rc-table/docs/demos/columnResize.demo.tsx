
/**
 * title = "列宽拖拽调整"
 * description = "在表头右边缘拖拽可调整列宽。设置 Table resizable 全局开启，也可通过 ColumnType.resizable 逐列控制。"
 */

import { useState } from "react";
import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";
import { fakerZH_CN as faker } from "@faker-js/faker";

interface DemoRow extends Row {
    dataRef: {
        name: string
        age: number
        email: string
        department: string
        jobTitle: string
        city: string
        salary: number
    }
}

faker.seed(20260601)

const rows: DemoRow[] = Array.from({ length: 500 }, (_, index) => ({
    id: `${index + 1}`,
    dataRef: {
        name: faker.person.fullName(),
        age: faker.number.int({ min: 22, max: 55 }),
        email: faker.internet.email(),
        department: faker.commerce.department(),
        jobTitle: faker.person.jobTitle(),
        city: faker.location.city(),
        salary: faker.number.int({ min: 8000, max: 50000 }),
    }
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