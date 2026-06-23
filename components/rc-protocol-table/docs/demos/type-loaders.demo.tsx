/**
 * title = "自定义类型渲染"
 * description = "通过 typeLoaders 为不同 dataType 注入自定义渲染器，实现状态标签、金额格式化和日期格式化等效果。"
 */

import { css } from "@linaria/core";
import ProtocolTable from "../../src/table.js";
import type { DataTypeLoader, ProtocolColumnType } from "../../src/types.js";
import type { Row } from "@crab-dev/rc-table";

interface OrderRow extends Row {
    dataRef: {
        orderNo:     string;
        customer:    string;
        product:     string;
        amount:      number;
        status:      string;
        createdAt:   string;
    };
}

const COLUMNS: ProtocolColumnType[] = [
    { name: "$.orderNo",   title: "订单编号", dataType: "text",     width: 160, fixed: "left" },
    { name: "$.customer",  title: "客户名称", dataType: "text",     width: 160 },
    { name: "$.product",   title: "产品",    dataType: "text",     width: 200 },
    { name: "$.amount",    title: "金额",    dataType: "currency", width: 140, align: "right" },
    { name: "$.status",    title: "状态",    dataType: "status",   width: 110, align: "center" },
    { name: "$.createdAt", title: "下单日期", dataType: "date",     width: 140 },
];

const STATUSES = ["待确认", "处理中", "已完成", "已取消"];
const PRODUCTS = ["企业版 SaaS", "数据分析平台", "云存储套餐", "API 调用包", "技术支持服务"];
const CUSTOMERS = ["北京科技有限公司", "上海信息系统公司", "广州数字科技", "深圳创新集团", "杭州互联网有限公司"];

const ROWS: OrderRow[] = Array.from({ length: 300 }, (_, index) => ({
    id: String(index + 1),
    dataRef: {
        orderNo:   `ORD-2024-${String(index + 1).padStart(5, "0")}`,
        customer:  CUSTOMERS[index % CUSTOMERS.length],
        product:   PRODUCTS[index % PRODUCTS.length],
        amount:    5000 + (index % 50) * 2000,
        status:    STATUSES[index % STATUSES.length],
        createdAt: `2024-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
    },
}));

const fetchColumns = (): Promise<ProtocolColumnType[]> =>
    new Promise((resolve) => setTimeout(() => resolve(COLUMNS), 200));

const fetchData = (): Promise<OrderRow[]> =>
    new Promise((resolve) => setTimeout(() => resolve(ROWS), 300));

const statusTagStyle = css`
    display: inline-block;
    padding: 2px 8px;
    border-radius: 4px;
    font-size: 12px;
    line-height: 1.6;
    white-space: nowrap;
`;

const STATUS_COLOR_MAP: Record<string, { background: string; color: string }> = {
    "待确认": { background: "#fff7e6", color: "#d46b08" },
    "处理中": { background: "#e6f4ff", color: "#0958d9" },
    "已完成": { background: "#f6ffed", color: "#389e0d" },
    "已取消": { background: "#fff1f0", color: "#cf1322" },
};

const TYPE_LOADERS: DataTypeLoader[] = [
    {
        name: "status",
        render: ({ row }) => {
            const status = (row as OrderRow).dataRef.status;
            const colorConfig = STATUS_COLOR_MAP[status] ?? { background: "#f5f5f5", color: "#666" };
            return (
                <span
                    className={statusTagStyle}
                    style={{ background: colorConfig.background, color: colorConfig.color }}
                >
                    {status}
                </span>
            );
        },
        filterEditor: undefined,
        editRender: undefined,
    },
    {
        name: "currency",
        render: ({ row }) => {
            const value: number = row.dataRef.amount;
            return (
                <span>
                    {value.toLocaleString("zh-CN", { style: "currency", currency: "CNY", minimumFractionDigits: 2 })}
                </span>
            );
        },
        filterEditor: undefined,
        editRender: undefined,
    },
    {
        name: "date",
        render: ({ row }) => {
            const value: string = row.dataRef.createdAt;
            const date = new Date(value);
            return (
                <span>
                    {date.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })}
                </span>
            );
        },
        filterEditor: undefined,
        editRender: undefined,
    },
];

const containerStyle = css`
    width: 100%;
    height: 360px;
`;

const TypeLoadersDemo = () => {
    return (
        <ProtocolTable<OrderRow>
            className={containerStyle}
            fetchColumns={fetchColumns}
            fetchData={fetchData}
            typeLoaders={TYPE_LOADERS}
        />
    );
};

export default TypeLoadersDemo;
