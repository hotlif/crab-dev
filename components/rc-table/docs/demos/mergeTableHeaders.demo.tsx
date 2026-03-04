/**
 * title = "表头合并"
 * description = "通过 children 配置实现多级表头（头部合并）"
 */

import Table from "../../src/index";
import type { ColumnType, Row } from "../../src/index";
import { fakerZH_CN as faker } from "@faker-js/faker";

interface DemoRow extends Row {
	dataRef: {
		recordNo: string
		employeeNo: string
		name: string
		gender: string
		age: number
		phone: string
		email: string
		province: string
		address: string
		company: string
		department: string
		jobTitle: string
		city: string
		performance: string
		salary: number
		bonus: number
		status: string
		createdAt: string
		tag: string
		yearsOfService: number
	}
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
				name: "$.createdAt",
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

faker.seed(20260304)

const rows: DemoRow[] = Array.from({ length: 2000 }, (_, index) => {
	const salary = faker.number.int({ min: 8000, max: 50000 })
	const bonus = faker.number.int({ min: 1000, max: 20000 })
	const hireDate = faker.date.past({ years: 8 })

	return {
		id: `${index + 1}`,
		dataRef: {
			recordNo: `R-${String(index + 1).padStart(5, "0")}`,
			employeeNo: `EMP-${String(index + 1).padStart(4, "0")}`,
			name: faker.person.fullName(),
			gender: faker.helpers.arrayElement(["男", "女"]),
			age: faker.number.int({ min: 22, max: 55 }),
			phone: `1${faker.string.numeric(10)}`,
			email: faker.internet.email(),
			province: faker.location.state(),
			address: faker.location.streetAddress(),
			company: faker.company.name(),
			department: faker.commerce.department(),
			jobTitle: faker.person.jobTitle(),
			city: faker.location.city(),
			performance: faker.helpers.arrayElement(["A", "B", "C"]),
			salary,
			bonus,
			status: faker.helpers.arrayElement(["在职", "试用", "离职中"]),
			createdAt: hireDate.toISOString().slice(0, 10),
			tag: faker.helpers.arrayElement(["核心", "候选", "稳定"]),
			yearsOfService: faker.number.int({ min: 0, max: 12 })
		}
	}
})

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
