export const meta = {
    title: "库存补货决策：仓库分组与汇总",
    description: "模拟 720 条真实库存组合。按仓库分组，查看可用库存、7 日需求及补货建议；展开行看供应商和采购提前期，筛选缺货风险后勾选并生成模拟采购建议。底部汇总随筛选结果变化。",
};

import { useState, type Key } from "react";
import Button from "@crab-dev/rc-button";
import type { Row } from "@crab-dev/rc-table";
import TablePro from "../../src/table.js";
import type { DataTypeLoader, ProtocolColumnType, TableQuery } from "../../src/types.js";
import { KeywordFilter, ScenarioFrame, scenarioTableStyle, StatusPill, waitForScenarioRequest } from "./scenario-shared.js";

type StockHealth = "需补货" | "关注" | "充足";
interface InventoryRow extends Row {
    dataRef: {
        sku: string;
        product: string;
        warehouse: string;
        supplier: string;
        leadDays: number;
        onHand: number;
        reserved: number;
        available: number;
        demand7d: number;
        reorderPoint: number;
        suggestedBuy: number;
        health: StockHealth;
    };
}

const warehouses = ["上海一号仓", "北京中心仓", "广州南区仓", "成都西区仓"];
const suppliers = ["晨光供应链", "景行制造", "北辰工厂", "远航贸易"];
const products = ["便携显示器", "机械键盘", "无线耳机", "升降桌", "智能台灯", "视频会议摄像头", "笔记本支架", "扩展坞"];
const inventory: InventoryRow[] = Array.from({ length: 720 }, (_, index) => {
    const skuIndex = Math.floor(index / warehouses.length);
    const warehouseIndex = index % warehouses.length;
    const onHand = 12 + (index * 19) % 180;
    const reserved = (index * 7) % 45;
    const available = Math.max(0, onHand - reserved);
    const demand7d = 24 + (index * 11) % 94;
    const reorderPoint = Math.ceil(demand7d * 1.25);
    const suggestedBuy = Math.max(0, reorderPoint + demand7d - available);
    const health: StockHealth = available < reorderPoint ? "需补货" : available < reorderPoint + 28 ? "关注" : "充足";
    return {
        id: `SKU-${String(skuIndex + 1).padStart(5, "0")}-${warehouseIndex}`,
        dataRef: {
            sku: `SKU-${String(skuIndex + 1).padStart(5, "0")}`,
            product: products[skuIndex % products.length],
            warehouse: warehouses[warehouseIndex],
            supplier: suppliers[(skuIndex * 5) % suppliers.length],
            leadDays: 3 + skuIndex % 12,
            onHand, reserved, available, demand7d, reorderPoint, suggestedBuy, health,
        },
    };
});

const columns: ProtocolColumnType[] = [
    { name: "$.sku", title: "SKU", dataType: "sku", width: 142, fixed: "left" },
    { name: "$.product", title: "商品", dataType: "text", width: 176 },
    { name: "$.warehouse", title: "仓库", dataType: "warehouse", width: 136, filterable: true },
    { name: "stock", title: "库存", dataType: "group", children: [
        { name: "$.onHand", title: "现货", dataType: "number", width: 78, align: "right" },
        { name: "$.reserved", title: "占用", dataType: "number", width: 78, align: "right" },
        { name: "$.available", title: "可用", dataType: "available", width: 84, align: "right" },
    ] },
    { name: "planning", title: "补货测算", dataType: "group", children: [
        { name: "$.demand7d", title: "7 日需求", dataType: "demand", width: 96, align: "right" },
        { name: "$.reorderPoint", title: "补货点", dataType: "number", width: 88, align: "right" },
        { name: "$.suggestedBuy", title: "建议采购", dataType: "suggested", width: 104, align: "right" },
    ] },
    { name: "$.health", title: "库存判断", dataType: "health", width: 106, fixed: "right", filterable: true },
];
const fetchColumns = async (): Promise<ProtocolColumnType[]> => columns;

const typeLoaders: DataTypeLoader<InventoryRow>[] = [
    { name: "sku", render: undefined, filterEditor: undefined, editRender: undefined, summaryRender: () => "筛选后合计" },
    { name: "text", render: undefined, filterEditor: undefined, editRender: undefined },
    { name: "number", render: undefined, filterEditor: undefined, editRender: undefined },
    { name: "group", render: undefined, filterEditor: undefined, editRender: undefined },
    { name: "warehouse", render: undefined, filterEditor: props => <KeywordFilter label="仓库" {...props} />, editRender: undefined },
    { name: "available", render: undefined, filterEditor: undefined, editRender: undefined, summaryRender: ({ rows }) => rows.reduce((sum, row) => sum + row.dataRef.available, 0).toLocaleString("zh-CN") },
    { name: "demand", render: undefined, filterEditor: undefined, editRender: undefined, summaryRender: ({ rows }) => rows.reduce((sum, row) => sum + row.dataRef.demand7d, 0).toLocaleString("zh-CN") },
    { name: "suggested", render: undefined, filterEditor: undefined, editRender: undefined, summaryRender: ({ rows }) => rows.reduce((sum, row) => sum + row.dataRef.suggestedBuy, 0).toLocaleString("zh-CN") },
    {
        name: "health",
        render: ({ row }) => <StatusPill tone={row.dataRef.health === "需补货" ? "error" : row.dataRef.health === "关注" ? "warning" : "success"}>{row.dataRef.health}</StatusPill>,
        filterEditor: props => <KeywordFilter label="库存判断" {...props} />,
        editRender: undefined,
        getSearchText: row => row.dataRef.health,
    },
];

async function requestInventory({ filters, signal }: TableQuery) {
    await waitForScenarioRequest(signal);
    const rows = inventory.filter(row => Object.entries(filters).every(([column, term]) => {
        const field = column.replace(/^\$\./, "") as keyof InventoryRow["dataRef"];
        return String(row.dataRef[field] ?? "").includes(term.trim());
    })).sort((left, right) => left.dataRef.warehouse.localeCompare(right.dataRef.warehouse, "zh-CN")
        || left.dataRef.sku.localeCompare(right.dataRef.sku));
    return { rows, total: rows.length };
}

export default function InventoryPlanningDemo() {
    const [selectedIds, setSelectedIds] = useState<Set<Key>>(new Set());
    const [feedback, setFeedback] = useState("展开任意商品可查看供应商和采购提前期；汇总显示当前筛选结果。");
    const selected = inventory.filter(row => selectedIds.has(row.id));
    const suggestedUnits = selected.reduce((sum, row) => sum + row.dataRef.suggestedBuy, 0);

    return (
        <ScenarioFrame
            title="供应链 · 补货决策"
            description="仓库分组 + 多级表头 + 虚拟滚动；当前库存快照可直接筛选和汇总。"
            metrics={[
                { label: "全量 SKU × 仓库", value: `${inventory.length} 条` },
                { label: "全量需补货", value: `${inventory.filter(row => row.dataRef.health === "需补货").length} 条` },
                { label: "已选建议采购", value: `${suggestedUnits.toLocaleString("zh-CN")} 件` },
            ]}
            actions={<Button type="button" size="s" appearance="primary" disabled={selected.length === 0} onClick={() => {
                setFeedback(`已生成模拟采购建议：${selected.length} 个库存组合，建议采购 ${suggestedUnits.toLocaleString("zh-CN")} 件。`);
                setSelectedIds(new Set());
            }}>生成采购建议</Button>}
            feedback={feedback}
        >
            <TablePro<InventoryRow>
                className={scenarioTableStyle}
                fetchColumns={fetchColumns}
                request={requestInventory}
                pagination={false}
                typeLoaders={typeLoaders}
                groupBy={["$.warehouse"]}
                defaultExpandAll
                showSummary
                rowSelection={{ type: "checkbox", selectedRowIds: selectedIds, onChange: ids => setSelectedIds(ids), getDisabled: row => row.dataRef.health !== "需补货" }}
                expandedRowRender={row => <div>供应商：{row.dataRef.supplier}　·　采购提前期：{row.dataRef.leadDays} 天　·　补货点：{row.dataRef.reorderPoint} 件</div>}
                expandedRowHeight={72}
                sideBar
                filterBar
                resizable
                draggableColumns
                showSearchBar
                exportFileName="库存补货-筛选结果"
            />
        </ScenarioFrame>
    );
}
