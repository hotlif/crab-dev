export const meta = {
    title: "订单履约工作台：跨页查询与拣货",
    description: "模拟 960 笔多区域订单。尝试在右侧筛选「待发货」、按承诺日期排序、跨页选择订单并生成拣货单；金额汇总与 CSV 只针对当前页。request 真正处理分页、筛选、排序及 AbortSignal。",
};

import { useState, type Key } from "react";
import Button from "@crab-dev/rc-button";
import type { Row } from "@crab-dev/rc-table";
import TablePro from "../../src/table.js";
import type { DataTypeLoader, ProtocolColumnType, TableQuery } from "../../src/types.js";
import { formatCny, KeywordFilter, ScenarioFrame, scenarioTableStyle, StatusPill, waitForScenarioRequest } from "./scenario-shared.js";

type OrderStatus = "待审核" | "待发货" | "运输中" | "已完成" | "异常";
interface OrderRow extends Row {
    dataRef: {
        orderNo: string;
        merchant: string;
        region: string;
        channel: string;
        itemCount: number;
        amount: number;
        promiseDate: string;
        status: OrderStatus;
    };
}

const merchants = ["青禾数码", "远山家居", "星舟生活", "拾光电器", "北辰文具", "云岸户外"];
const regions = ["华北", "华东", "华南", "西南"];
const channels = ["官网", "门店", "企业采购"];
const statuses: OrderStatus[] = ["待发货", "待审核", "运输中", "已完成", "待发货", "待发货", "异常"];
const orders: OrderRow[] = Array.from({ length: 960 }, (_, index) => {
    const itemCount = index % 8 + 1;
    return {
        id: `ORD-26-${String(index + 1).padStart(5, "0")}`,
        dataRef: {
            orderNo: `ORD-26-${String(index + 1).padStart(5, "0")}`,
            merchant: merchants[(index * 7) % merchants.length],
            region: regions[(index * 3) % regions.length],
            channel: channels[(index * 5) % channels.length],
            itemCount,
            amount: itemCount * (189 + (index % 17) * 73),
            promiseDate: `2026-10-${String(index % 28 + 1).padStart(2, "0")}`,
            status: statuses[(index * 11) % statuses.length],
        },
    };
});

const columns: ProtocolColumnType[] = [
    { name: "$.orderNo", title: "订单编号", dataType: "order-id", width: 178, fixed: "left", sortable: true },
    { name: "$.merchant", title: "商户", dataType: "text", width: 142 },
    { name: "$.region", title: "区域", dataType: "region", width: 92, filterable: true },
    { name: "$.channel", title: "渠道", dataType: "channel", width: 110, filterable: true },
    { name: "$.itemCount", title: "件数", dataType: "number", width: 75, align: "right", sortable: true },
    { name: "$.amount", title: "应收金额", dataType: "money", width: 132, align: "right", sortable: true },
    { name: "$.promiseDate", title: "承诺送达", dataType: "text", width: 130, sortable: true },
    { name: "$.status", title: "履约状态", dataType: "status", width: 116, fixed: "right", filterable: true },
];
const fetchColumns = async (): Promise<ProtocolColumnType[]> => columns;

const typeLoaders: DataTypeLoader<OrderRow>[] = [
    { name: "order-id", render: undefined, filterEditor: undefined, editRender: undefined, summaryRender: () => "本页合计" },
    { name: "text", render: undefined, filterEditor: undefined, editRender: undefined },
    { name: "number", render: undefined, filterEditor: undefined, editRender: undefined },
    { name: "region", render: undefined, filterEditor: props => <KeywordFilter label="区域" {...props} />, editRender: undefined },
    { name: "channel", render: undefined, filterEditor: props => <KeywordFilter label="渠道" {...props} />, editRender: undefined },
    {
        name: "money",
        render: ({ row }) => formatCny(row.dataRef.amount),
        filterEditor: undefined,
        editRender: undefined,
        summaryRender: ({ rows }) => formatCny(rows.reduce((sum, row) => sum + row.dataRef.amount, 0)),
        exportValue: raw => String(raw ?? ""),
    },
    {
        name: "status",
        render: ({ row }) => {
            const status = row.dataRef.status;
            const tone = status === "已完成" ? "success" : status === "异常" ? "error" : status === "待发货" ? "warning" : "info";
            return <StatusPill tone={tone}>{status}</StatusPill>;
        },
        filterEditor: props => <KeywordFilter label="履约状态" {...props} />,
        editRender: undefined,
        getSearchText: row => row.dataRef.status,
    },
];

async function requestOrders({ page, pageSize, filters, sort, signal }: TableQuery) {
    await waitForScenarioRequest(signal);
    const filtered = orders.filter(row => Object.entries(filters).every(([column, term]) => {
        const field = column.replace(/^\$\./, "") as keyof OrderRow["dataRef"];
        return String(row.dataRef[field] ?? "").includes(term.trim());
    }));
    const sorted = [...filtered].sort((left, right) => {
        for (const item of sort) {
            const field = item.columnName.replace(/^\$\./, "") as keyof OrderRow["dataRef"];
            const a = left.dataRef[field];
            const b = right.dataRef[field];
            const comparison = typeof a === "number" && typeof b === "number"
                ? a - b : String(a).localeCompare(String(b), "zh-CN");
            if (comparison !== 0) return item.direction === "asc" ? comparison : -comparison;
        }
        return left.dataRef.orderNo.localeCompare(right.dataRef.orderNo);
    });
    return { rows: sorted.slice((page - 1) * pageSize, page * pageSize), total: sorted.length };
}

export default function OrderOperationsDemo() {
    const [selectedIds, setSelectedIds] = useState<Set<Key>>(new Set());
    const [feedback, setFeedback] = useState("从右侧过滤器选择区域、渠道或状态；表头可排序。");
    const selectedOrders = orders.filter(order => selectedIds.has(order.id));
    const pickable = selectedOrders.filter(order => order.dataRef.status === "待发货");

    return (
        <ScenarioFrame
            title="订单履约 · 当日拣货"
            description="查询与排序由模拟服务端完成；勾选可跨页保留，异常及非待发货订单不能选。"
            metrics={[
                { label: "全量订单池", value: `${orders.length} 笔` },
                { label: "全量待发货", value: `${orders.filter(order => order.dataRef.status === "待发货").length} 笔` },
                { label: "已选拣货", value: `${pickable.length} 笔` },
            ]}
            actions={<Button type="button" size="s" appearance="primary" disabled={pickable.length === 0} onClick={() => {
                setFeedback(`已生成模拟拣货单：${pickable.length} 笔、${pickable.reduce((sum, order) => sum + order.dataRef.itemCount, 0)} 件商品。`);
                setSelectedIds(new Set());
            }}>生成拣货单</Button>}
            feedback={feedback}
        >
            <TablePro<OrderRow>
                className={scenarioTableStyle}
                fetchColumns={fetchColumns}
                request={requestOrders}
                sortMode="server"
                defaultSortColumns={[{ columnName: "$.promiseDate", direction: "asc" }]}
                pagination={{ defaultPageSize: 20, pageSizeOptions: [10, 20, 50], showSizeChanger: true, showTotal: true }}
                typeLoaders={typeLoaders}
                rowSelection={{ type: "checkbox", selectedRowIds: selectedIds, onChange: ids => setSelectedIds(ids), getDisabled: row => row.dataRef.status !== "待发货" }}
                sideBar
                filterBar
                showSearchBar
                showSummary
                resizable
                exportFileName="履约订单-当前页"
            />
        </ScenarioFrame>
    );
}
