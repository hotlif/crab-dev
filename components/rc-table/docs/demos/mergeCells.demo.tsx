/**
 * title = "合并单元格"
 * description = "按连续相同值自动合并单元格，展示更真实的业务台账数据"
 */

import Table from "../../src/index";
import type { ColumnType, Row } from "../../src/index";
import type { MergeCell } from "../../src/types";
import { fakerZH_CN as faker } from "@faker-js/faker";

interface DemoRow extends Row {
	dataRef: {
		businessUnit: string
		city: string
		accountManager: string
		customerName: string
		industry: string
		projectName: string
		stage: string
		contractAmount: number
		monthlyRevenue: number
		riskLevel: string
		nextVisitDate: string
	}
}

const columns: ColumnType<DemoRow>[] = [
	{
		title: "大区",
		name: "$.businessUnit",
		width: 120,
		fixed: "left"
	},
	{
		title: "城市",
		name: "$.city",
		width: 110,
		fixed: "left"
	},
	{
		title: "客户经理",
		name: "$.accountManager",
		width: 130
	},
	{
		title: "客户名称",
		name: "$.customerName",
		width: 220
	},
	{
		title: "行业",
		name: "$.industry",
		width: 120
	},
	{
		title: "项目",
		name: "$.projectName",
		width: 220
	},
	{
		title: "阶段",
		name: "$.stage",
		width: 100
	},
	{
		title: "合同额(元)",
		name: "$.contractAmount",
		width: 140,
		align: "right"
	},
	{
		title: "月回款(元)",
		name: "$.monthlyRevenue",
		width: 140,
		align: "right"
	},
	{
		title: "风险等级",
		name: "$.riskLevel",
		width: 110
	},
	{
		title: "下次拜访",
		name: "$.nextVisitDate",
		width: 130,
        fixed: "right"
	}
]

faker.seed(20260304)

const groupedStructure = [
	{
		businessUnit: "华北大区",
		cities: [
			{ city: "北京", managers: ["李文博", "王若琳", "高明轩"] },
			{ city: "天津", managers: ["韩沐阳", "林景行", "何知夏"] },
			{ city: "石家庄", managers: ["段临川", "沈嘉木", "陆星遥"] }
		]
	},
	{
		businessUnit: "华东大区",
		cities: [
			{ city: "上海", managers: ["周子墨", "陈思远", "宋知行"] },
			{ city: "杭州", managers: ["许安然", "乔慕白", "唐予安"] },
			{ city: "南京", managers: ["谢知远", "魏星河", "白子谦"] }
		]
	},
	{
		businessUnit: "华南大区",
		cities: [
			{ city: "深圳", managers: ["赵清禾", "孙嘉悦", "梁书宁"] },
			{ city: "广州", managers: ["冯凯歌", "蒋辰逸", "马天佑"] },
			{ city: "厦门", managers: ["邵云川", "顾承泽", "林景行"] }
		]
	},
	{
		businessUnit: "西南大区",
		cities: [
			{ city: "成都", managers: ["唐予安", "谢知远", "魏星河"] },
			{ city: "重庆", managers: ["蒋辰逸", "赵清禾", "孙嘉悦"] },
			{ city: "昆明", managers: ["梁书宁", "冯凯歌", "韩沐阳"] }
		]
	},
	{
		businessUnit: "西北大区",
		cities: [
			{ city: "西安", managers: ["顾承泽", "白子谦", "马天佑"] },
			{ city: "兰州", managers: ["邵云川", "段临川", "沈嘉木"] },
			{ city: "乌鲁木齐", managers: ["陆星遥", "乔慕白", "何知夏"] }
		]
	},
	{
		businessUnit: "华中大区",
		cities: [
			{ city: "武汉", managers: ["高明轩", "王若琳", "陈思远"] },
			{ city: "长沙", managers: ["宋知行", "许安然", "周子墨"] },
			{ city: "郑州", managers: ["李文博", "林景行", "唐予安"] }
		]
	}
]

const rawGroupConfigs = groupedStructure.flatMap((region) => {
	return region.cities.flatMap((cityConfig) => {
		return cityConfig.managers.map((accountManager) => {
			return {
				businessUnit: region.businessUnit,
				city: cityConfig.city,
				accountManager
			}
		})
	})
})

const totalRows = 200
const baseCount = Math.floor(totalRows / rawGroupConfigs.length)
const remainder = totalRows % rawGroupConfigs.length

const groupConfigs = rawGroupConfigs.map((config, index) => {
	return {
		...config,
		count: baseCount + (index < remainder ? 1 : 0)
	}
})

const rows: DemoRow[] = groupConfigs.flatMap((group, groupIndex) => {
	return Array.from({ length: group.count }, (_, index) => {
		const contractAmount = faker.number.int({ min: 120000, max: 3200000 })
		const monthlyRevenue = faker.number.int({ min: 10000, max: 380000 })
		const nextVisitDate = faker.date.soon({ days: 60 })
		const rowNumber = groupConfigs.slice(0, groupIndex).reduce((acc, item) => acc + item.count, 0) + index + 1

		return {
			id: `row-${rowNumber}`,
			dataRef: {
				businessUnit: group.businessUnit,
				city: group.city,
				accountManager: group.accountManager,
				customerName: `${faker.company.name()}${faker.helpers.arrayElement(["集团", "科技", "制造", "信息"])}`,
				industry: faker.helpers.arrayElement(["制造业", "医疗", "零售", "教育", "互联网", "物流"]),
				projectName: `${faker.helpers.arrayElement(["ERP升级", "供应链优化", "数据中台", "客服系统重构", "仓储自动化"])}-${faker.number.int({ min: 100, max: 999 })}`,
				stage: faker.helpers.arrayElement(["线索", "商机", "方案", "合同", "交付"]),
				contractAmount,
				monthlyRevenue,
				riskLevel: faker.helpers.arrayElement(["低", "中", "高"]),
				nextVisitDate: nextVisitDate.toISOString().slice(0, 10)
			}
		}
	})
})

const buildVerticalMergeCells = <T extends Row>(
	list: T[],
	columnIndex: number,
	getValue: (row: T) => string,
) => {
	const result: MergeCell[] = [];
	let start = 0;

	while (start < list.length) {
		let end = start;
		const current = getValue(list[start]);
		while (end + 1 < list.length && getValue(list[end + 1]) === current) {
			end += 1;
		}

		if (end > start) {
			result.push({
				rowIndex: start,
				columnIndex,
				rowSpan: end - start,
				colSpan: 0
			})
		}
		start = end + 1;
	}

	return result;
}

const mergeCells: MergeCell[] = [
	...buildVerticalMergeCells(rows, 0, (row) => row.dataRef.businessUnit),
	...buildVerticalMergeCells(rows, 1, (row) => `${row.dataRef.businessUnit}-${row.dataRef.city}`),
	...buildVerticalMergeCells(rows, 2, (row) => `${row.dataRef.businessUnit}-${row.dataRef.city}-${row.dataRef.accountManager}`)
]

const MergeCellsDemo = () => {
	return (
		<Table
			width={1250}
			height={320}
			columns={columns}
			rows={rows}
			mergeCells={mergeCells}
		/>
	)
}

export default MergeCellsDemo;
