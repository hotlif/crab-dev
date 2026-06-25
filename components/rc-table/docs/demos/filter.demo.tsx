/**
 * title = "过滤栏"
 * description = "过滤栏只负责收集条件，筛选逻辑在外部实现"
 */

import { useMemo, useState } from "react";
import { fakerZH_CN as faker } from "@faker-js/faker";

import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";

interface DemoRow extends Row {
    dataRef: {
        recordNo: string
        customerName: string
        projectName: string
        businessUnit: string
        industry: string
        city: string
        accountManager: string
        channel: string
        customerLevel: string
        contractType: string
        paymentStatus: string
        deliveryMode: string
        priority: string
        quarter: string
        amount: number
        status: string
    }
}

const createColumns = (): ColumnType<DemoRow>[] => [
    {
        title: "记录号",
        name: "$.recordNo",
        width: 130,
        fixed: "left"
    },
    {
        title: "客户名称",
        name: "$.customerName",
        width: 180,
    },
    {
        title: "项目名称",
        name: "$.projectName",
        width: 200,
    },
    {
        title: "大区",
        name: "$.businessUnit",
        width: 140,
        filterEditor: ({ value, onValueChange }) => {
            return (
                <select
                    value={value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #ddd"
                    }}
                >
                    <option value="">全部大区</option>
                    <option value="华北">华北</option>
                    <option value="华东">华东</option>
                    <option value="华南">华南</option>
                    <option value="西南">西南</option>
                </select>
            );
        }
    },
    {
        title: "行业",
        name: "$.industry",
        width: 140,
        filterEditor: ({ value, onValueChange }) => {
            return (
                <select
                    value={value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #ddd"
                    }}
                >
                    <option value="">全部行业</option>
                    <option value="制造">制造</option>
                    <option value="互联网">互联网</option>
                    <option value="金融">金融</option>
                    <option value="零售">零售</option>
                </select>
            );
        }
    },
    {
        title: "城市",
        name: "$.city",
        width: 120
    },
    {
        title: "客户经理",
        name: "$.accountManager",
        width: 140
    },
    {
        title: "渠道",
        name: "$.channel",
        width: 140,
        filterEditor: ({ value, onValueChange }) => {
            return (
                <select
                    value={value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #ddd"
                    }}
                >
                    <option value="">全部渠道</option>
                    <option value="直营">直营</option>
                    <option value="伙伴">伙伴</option>
                    <option value="代理">代理</option>
                </select>
            );
        }
    },
    {
        title: "客户等级",
        name: "$.customerLevel",
        width: 140,
        filterEditor: ({ value, onValueChange }) => {
            return (
                <select
                    value={value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #ddd"
                    }}
                >
                    <option value="">全部等级</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                </select>
            );
        }
    },
    {
        title: "合同类型",
        name: "$.contractType",
        width: 140,
        filterEditor: ({ value, onValueChange }) => {
            return (
                <select
                    value={value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #ddd"
                    }}
                >
                    <option value="">全部合同</option>
                    <option value="新签">新签</option>
                    <option value="续约">续约</option>
                    <option value="增购">增购</option>
                </select>
            );
        }
    },
    {
        title: "回款状态",
        name: "$.paymentStatus",
        width: 140,
        filterEditor: ({ value, onValueChange }) => {
            return (
                <select
                    value={value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #ddd"
                    }}
                >
                    <option value="">全部状态</option>
                    <option value="未回款">未回款</option>
                    <option value="部分回款">部分回款</option>
                    <option value="已回款">已回款</option>
                </select>
            );
        }
    },
    {
        title: "交付方式",
        name: "$.deliveryMode",
        width: 140,
        filterEditor: ({ value, onValueChange }) => {
            return (
                <select
                    value={value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #ddd"
                    }}
                >
                    <option value="">全部方式</option>
                    <option value="远程">远程</option>
                    <option value="驻场">驻场</option>
                    <option value="混合">混合</option>
                </select>
            );
        }
    },
    {
        title: "优先级",
        name: "$.priority",
        width: 120,
        filterEditor: ({ value, onValueChange }) => {
            return (
                <select
                    value={value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #ddd"
                    }}
                >
                    <option value="">全部优先级</option>
                    <option value="P0">P0</option>
                    <option value="P1">P1</option>
                    <option value="P2">P2</option>
                </select>
            );
        }
    },
    {
        title: "季度",
        name: "$.quarter",
        width: 120,
        filterEditor: ({ value, onValueChange }) => {
            return (
                <select
                    value={value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #ddd"
                    }}
                >
                    <option value="">全部季度</option>
                    <option value="Q1">Q1</option>
                    <option value="Q2">Q2</option>
                    <option value="Q3">Q3</option>
                    <option value="Q4">Q4</option>
                </select>
            );
        }
    },
    {
        title: "金额",
        name: "$.amount",
        width: 140,
        align: "right"
    },
    {
        title: "状态",
        name: "$.status",
        width: 120,
        filterEditor: ({ value, onValueChange }) => {
            return (
                <select
                    value={value}
                    onChange={(event) => {
                        onValueChange(event.target.value);
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        boxSizing: "border-box",
                        border: "1px solid #ddd"
                    }}
                >
                    <option value="">全部状态</option>
                    <option value="进行中">进行中</option>
                    <option value="已完成">已完成</option>
                    <option value="风险">风险</option>
                </select>
            );
        },
        fixed: "right"
    }
]

const businessUnits = ["华北", "华东", "华南", "西南"];
const customerNames = ["星海科技", "云象数据", "启明制造", "远峰零售", "辰光金融", "中联物流", "博睿能源", "泰和医药"];
const projectNames = ["主数据平台", "经营分析看板", "供应链优化", "门店数字化", "风控中台", "物流协同平台", "能源巡检系统", "医药追溯平台"];
const industries = ["制造", "互联网", "金融", "零售"];
const cities = ["北京", "上海", "广州", "深圳", "杭州", "南京", "成都", "重庆"];
const accountManagers = ["李文博", "王若琳", "周子墨", "陈思远", "宋知行", "许安然", "唐予安", "谢知远"];
const channels = ["直营", "伙伴", "代理"];
const customerLevels = ["A", "B", "C"];
const contractTypes = ["新签", "续约", "增购"];
const paymentStatuses = ["未回款", "部分回款", "已回款"];
const deliveryModes = ["远程", "驻场", "混合"];
const priorities = ["P0", "P1", "P2"];
const quarters = ["Q1", "Q2", "Q3", "Q4"];
const statuses = ["进行中", "已完成", "风险"];

faker.seed(20260616);

const rows: DemoRow[] = Array.from({ length: 400 }, (_, index) => {
    const rowNumber = index + 1;
    return {
        id: `row-${rowNumber}`,
        dataRef: {
            recordNo: `R-${String(rowNumber).padStart(5, "0")}`,
            customerName: `${faker.helpers.arrayElement(customerNames)}${faker.helpers.arrayElement(["集团", "科技", "信息", "数字"])}`,
            projectName: `${faker.helpers.arrayElement(projectNames)}-${faker.number.int({ min: 1, max: 6 })}`,
            businessUnit: faker.helpers.arrayElement(businessUnits),
            industry: faker.helpers.arrayElement(industries),
            city: faker.helpers.arrayElement(cities),
            accountManager: faker.helpers.arrayElement(accountManagers),
            channel: faker.helpers.arrayElement(channels),
            customerLevel: faker.helpers.arrayElement(customerLevels),
            contractType: faker.helpers.arrayElement(contractTypes),
            paymentStatus: faker.helpers.arrayElement(paymentStatuses),
            deliveryMode: faker.helpers.arrayElement(deliveryModes),
            priority: faker.helpers.arrayElement(priorities),
            quarter: faker.helpers.arrayElement(quarters),
            amount: faker.number.int({ min: 20000, max: 500000 }),
            status: faker.helpers.arrayElement(statuses)
        }
    }
})

const FilterDemo = () => {
    const [filters, setFilters] = useState<Record<string, string>>({});

    const columns = useMemo(() => createColumns(), []);

    const filteredRows = useMemo(() => {
        return rows.filter((row) => {
            const recordNoKeyword = filters["$.recordNo"]?.trim() ?? "";
            const customerNameKeyword = filters["$.customerName"]?.trim() ?? "";
            const projectNameKeyword = filters["$.projectName"]?.trim() ?? "";
            const businessUnitKeyword = filters["$.businessUnit"]?.trim() ?? "";
            const industryKeyword = filters["$.industry"]?.trim() ?? "";
            const cityKeyword = filters["$.city"]?.trim() ?? "";
            const managerKeyword = filters["$.accountManager"]?.trim() ?? "";
            const channelKeyword = filters["$.channel"]?.trim() ?? "";
            const customerLevelKeyword = filters["$.customerLevel"]?.trim() ?? "";
            const contractTypeKeyword = filters["$.contractType"]?.trim() ?? "";
            const priorityKeyword = filters["$.priority"]?.trim() ?? "";
            const paymentStatusKeyword = filters["$.paymentStatus"]?.trim() ?? "";
            const deliveryModeKeyword = filters["$.deliveryMode"]?.trim() ?? "";
            const quarterKeyword = filters["$.quarter"]?.trim() ?? "";
            const amountKeyword = filters["$.amount"]?.trim() ?? "";
            const statusKeyword = filters["$.status"]?.trim() ?? "";

            if (recordNoKeyword !== "" && !row.dataRef.recordNo.includes(recordNoKeyword)) {
                return false;
            }
            if (customerNameKeyword !== "" && !row.dataRef.customerName.includes(customerNameKeyword)) {
                return false;
            }
            if (projectNameKeyword !== "" && !row.dataRef.projectName.includes(projectNameKeyword)) {
                return false;
            }
            if (businessUnitKeyword !== "" && !row.dataRef.businessUnit.includes(businessUnitKeyword)) {
                return false;
            }
            if (industryKeyword !== "" && !row.dataRef.industry.includes(industryKeyword)) {
                return false;
            }
            if (cityKeyword !== "" && !row.dataRef.city.includes(cityKeyword)) {
                return false;
            }
            if (managerKeyword !== "" && !row.dataRef.accountManager.includes(managerKeyword)) {
                return false;
            }
            if (channelKeyword !== "" && !row.dataRef.channel.includes(channelKeyword)) {
                return false;
            }
            if (customerLevelKeyword !== "" && !row.dataRef.customerLevel.includes(customerLevelKeyword)) {
                return false;
            }
            if (contractTypeKeyword !== "" && !row.dataRef.contractType.includes(contractTypeKeyword)) {
                return false;
            }
            if (paymentStatusKeyword !== "" && !row.dataRef.paymentStatus.includes(paymentStatusKeyword)) {
                return false;
            }
            if (deliveryModeKeyword !== "" && !row.dataRef.deliveryMode.includes(deliveryModeKeyword)) {
                return false;
            }
            if (priorityKeyword !== "" && !row.dataRef.priority.includes(priorityKeyword)) {
                return false;
            }
            if (quarterKeyword !== "" && !row.dataRef.quarter.includes(quarterKeyword)) {
                return false;
            }
            if (amountKeyword !== "" && !String(row.dataRef.amount).includes(amountKeyword)) {
                return false;
            }
            if (statusKeyword !== "" && !row.dataRef.status.includes(statusKeyword)) {
                return false;
            }
            return true;
        });
    }, [filters]);

    const filterSummary = useMemo(() => {
        const entries = Object.entries(filters);
        if (entries.length === 0) {
            return "当前过滤: 无";
        }
        return `当前过滤: ${entries.map(([key, value]) => `${key}=${value}`).join("; ")}`;
    }, [filters]);

    return (
        <div>
            <div
                style={{
                    marginBottom: 8,
                    color: "#555",
                    fontSize: 12,
                }}
            >
                {`${filterSummary} | 当前数据量: ${filteredRows.length}`}
            </div>
            <Table
                width={1200}
                height={320}
                columns={columns}
                rows={filteredRows}
                filterBar
                filters={filters}
                renderDefaultFilterEditor={({ columnIndex, value, onValueChange }) => {
                    return (
                        <input
                            value={value}
                            aria-label={`table-filter-input-${columnIndex}`}
                            placeholder="请输入"
                            style={{
                                width: "100%",
                                height: "100%",
                                boxSizing: "border-box",
                                border: "1px solid #ddd",
                                paddingInline: 8,
                            }}
                            onChange={(event) => {
                                onValueChange(event.target.value);
                            }}
                        />
                    );
                }}
                onFilterChange={setFilters}
            />
        </div>
    )
}

export default FilterDemo;
