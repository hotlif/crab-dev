
/**
 * title = "基础表格"
 * description = "一个简单的表格信息，展示基础的表格功能"
 */

import Table from "../../src/index";
import type { ColumnType, Row } from "../../src/index";
import { fakerZH_CN as faker } from "@faker-js/faker";


interface DemoRow extends Row {
    dataRef: {
        employeeNo: string
        name: string
        age: number
        email: string
        phone: string
        company: string
        department: string
        jobTitle: string
        city: string
        salary: number
        createdAt: string
    }
}

const columns: ColumnType<DemoRow>[] = [
    {
        title: "工号",
        name: "$.employeeNo",
        width: 140
    },
    {
        title: "姓名",
        name: "$.name",
        width: 140
    },
    {
        title: "年龄",
        name: "$.age",
        width: 100,
        align: "right"
    },
    {
        title: "邮箱",
        name: "$.email",
        width: 260
    },
    {
        title: "电话",
        name: "$.phone",
        width: 180
    },
    {
        title: "公司",
        name: "$.company",
        width: 220
    },
    {
        title: "部门",
        name: "$.department",
        width: 160
    },
    {
        title: "职位",
        name: "$.jobTitle",
        width: 180
    },
    {
        title: "城市",
        name: "$.city",
        width: 140
    },
    {
        title: "月薪",
        name: "$.salary",
        width: 140,
        align: "right"
    },
    {
        title: "入职日期",
        name: "$.createdAt",
        width: 160
    }
]

faker.seed(20260304)

const rows: DemoRow[] = Array.from({ length: 2000 }, (_, index) => {
    const salary = faker.number.int({ min: 8000, max: 50000 })
    const hireDate = faker.date.past({ years: 8 })

    return {
        id: `${index + 1}`,
        dataRef: {
            employeeNo: `EMP-${String(index + 1).padStart(4, "0")}`,
            name: faker.person.fullName(),
            age: faker.number.int({ min: 22, max: 55 }),
            email: faker.internet.email(),
            phone: `1${faker.string.numeric(10)}`,
            company: faker.company.name(),
            department: faker.commerce.department(),
            jobTitle: faker.person.jobTitle(),
            city: faker.location.city(),
            salary,
            createdAt: hireDate.toISOString().slice(0, 10)
        }
    }
})

const BasisDemo = () => {
    return (
        <Table
            width={1250}
            height={320}
            columns={columns}
            rows={rows}
        />
    )
}

export default BasisDemo;