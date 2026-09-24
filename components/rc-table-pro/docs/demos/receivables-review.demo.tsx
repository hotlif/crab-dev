export const meta = {
    title: "应收账款复核：持久化视图与催收清单",
    description: "模拟 840 张企业发票（固定快照日 2026-09-24）。筛选客户、负责人或风险等级；拖拽和固定列会写入 localStorage，刷新页面仍保留视图。底部汇总和 CSV 涵盖全部筛选结果，选择逾期发票生成模拟催收计划。",
};

import { useEffect, useState, type Key } from "react";
import Button from "@crab-dev/rc-button";
import type { Row } from "@crab-dev/rc-table";
import TablePro from "../../src/table.js";
import type { DataTypeLoader, ProtocolColumnType, ProtocolTableState, TableQuery } from "../../src/types.js";
import { formatCny, KeywordFilter, ScenarioFrame, scenarioActionsStyle, scenarioTableStyle, StatusPill, waitForScenarioRequest } from "./scenario-shared.js";

type Risk = "高风险" | "需关注" | "正常";
interface InvoiceRow extends Row {
    dataRef: {
        invoiceNo: string;
        customer: string;
        owner: string;
        contract: string;
        invoiceDate: string;
        dueDate: string;
        invoiceAmount: number;
        receivedAmount: number;
        outstanding: number;
        overdueDays: number;
        risk: Risk;
    };
}

const customers = ["上海启明科技", "北京云翎制造", "深圳泛舟物流", "杭州柏川软件", "广州微澜医疗", "成都万象能源"];
const owners = ["王倩", "张宁", "李扬", "陈璐", "赵敏"];
const snapshotDay = Date.UTC(2026, 8, 24);
const invoices: InvoiceRow[] = Array.from({ length: 840 }, (_, index) => {
    const invoiceAmount = 4800 + index % 37 * 1560;
    const receivedAmount = index % 9 === 0 ? invoiceAmount : index % 4 === 0 ? Math.round(invoiceAmount * 0.6) : 0;
    const outstanding = invoiceAmount - receivedAmount;
    const dueDay = Date.UTC(2026, 7, 20 + index % 70);
    const overdueDays = outstanding > 0 ? Math.max(0, Math.floor((snapshotDay - dueDay) / 86400000)) : 0;
    const risk: Risk = overdueDays >= 21 ? "高风险" : overdueDays > 0 ? "需关注" : "正常";
    return {
        id: `INV-26-${String(index + 1).padStart(5, "0")}`,
        dataRef: {
            invoiceNo: `INV-26-${String(index + 1).padStart(5, "0")}`,
            customer: customers[(index * 7) % customers.length],
            owner: owners[(index * 3) % owners.length],
            contract: `CTR-${String(1200 + index % 180).padStart(5, "0")}`,
            invoiceDate: new Date(dueDay - 30 * 86400000).toISOString().slice(0, 10),
            dueDate: new Date(dueDay).toISOString().slice(0, 10),
            invoiceAmount, receivedAmount, outstanding, overdueDays, risk,
        },
    };
});

const columns: ProtocolColumnType[] = [
    { name: "$.invoiceNo", title: "发票编号", dataType: "invoice-id", width: 168, fixed: "left", sortable: true },
    { name: "$.customer", title: "客户", dataType: "customer", width: 174, filterable: true },
    { name: "$.owner", title: "负责人", dataType: "owner", width: 92, filterable: true },
    { name: "$.contract", title: "合同编号", dataType: "text", width: 128 },
    { name: "$.invoiceDate", title: "开票日", dataType: "text", width: 112 },
    { name: "$.dueDate", title: "到期日", dataType: "text", width: 112, sortable: true },
    { name: "$.invoiceAmount", title: "开票金额", dataType: "invoiced", width: 130, align: "right", sortable: true },
    { name: "$.receivedAmount", title: "已回款", dataType: "received", width: 130, align: "right" },
    { name: "$.outstanding", title: "未收款", dataType: "outstanding", width: 130, align: "right", sortable: true },
    { name: "$.overdueDays", title: "逾期天数", dataType: "number", width: 100, align: "right", sortable: true },
    { name: "$.risk", title: "风险", dataType: "risk", width: 100, fixed: "right", filterable: true },
];
const fetchColumns = async (): Promise<ProtocolColumnType[]> => columns;

const typeLoaders: DataTypeLoader<InvoiceRow>[] = [
    { name: "invoice-id", render: undefined, filterEditor: undefined, editRender: undefined, summaryRender: () => "筛选后合计" },
    { name: "text", render: undefined, filterEditor: undefined, editRender: undefined },
    { name: "number", render: undefined, filterEditor: undefined, editRender: undefined },
    { name: "customer", render: undefined, filterEditor: props => <KeywordFilter label="客户" {...props} />, editRender: undefined },
    { name: "owner", render: undefined, filterEditor: props => <KeywordFilter label="负责人" {...props} />, editRender: undefined },
    { name: "invoiced", render: ({ row }) => formatCny(row.dataRef.invoiceAmount), filterEditor: undefined, editRender: undefined, summaryRender: ({ rows }) => formatCny(rows.reduce((sum, row) => sum + row.dataRef.invoiceAmount, 0)) },
    { name: "received", render: ({ row }) => formatCny(row.dataRef.receivedAmount), filterEditor: undefined, editRender: undefined, summaryRender: ({ rows }) => formatCny(rows.reduce((sum, row) => sum + row.dataRef.receivedAmount, 0)) },
    { name: "outstanding", render: ({ row }) => formatCny(row.dataRef.outstanding), filterEditor: undefined, editRender: undefined, summaryRender: ({ rows }) => formatCny(rows.reduce((sum, row) => sum + row.dataRef.outstanding, 0)) },
    {
        name: "risk",
        render: ({ row }) => <StatusPill tone={row.dataRef.risk === "高风险" ? "error" : row.dataRef.risk === "需关注" ? "warning" : "success"}>{row.dataRef.risk}</StatusPill>,
        filterEditor: props => <KeywordFilter label="风险" {...props} />,
        editRender: undefined,
        getSearchText: row => row.dataRef.risk,
    },
];

async function requestInvoices({ filters, signal }: TableQuery) {
    await waitForScenarioRequest(signal);
    const rows = invoices.filter(row => Object.entries(filters).every(([column, term]) => {
        const field = column.replace(/^\$\./, "") as keyof InvoiceRow["dataRef"];
        return String(row.dataRef[field] ?? "").includes(term.trim());
    }));
    return { rows, total: rows.length };
}

const storageKey = "crab-table-pro-receivables-view-v1";
function loadSavedView(): ProtocolTableState | undefined {
    if (typeof window === "undefined") return undefined;
    try {
        const value = window.localStorage.getItem(storageKey);
        return value ? JSON.parse(value) as ProtocolTableState : undefined;
    } catch { return undefined; }
}

export default function ReceivablesReviewDemo() {
    const [selectedIds, setSelectedIds] = useState<Set<Key>>(new Set());
    const [feedback, setFeedback] = useState("在右侧列面板调整列宽、顺序或固定方式；这些设置会保存到当前浏览器。");
    const [view, setView] = useState<{ revision: number; ready: boolean; initialState?: ProtocolTableState }>({ revision: 0, ready: false });
    useEffect(() => {
        setView({ revision: 0, ready: true, initialState: loadSavedView() });
    }, []);
    const selected = invoices.filter(row => selectedIds.has(row.id));
    const outstanding = selected.reduce((sum, row) => sum + row.dataRef.outstanding, 0);

    return (
        <ScenarioFrame
            title="财务 · 应收账款复核"
            description="固定快照日 2026-09-24。全部筛选结果在浏览器中虚拟滚动，筛选和列布局可持久化。"
            metrics={[
                { label: "全量应收发票", value: `${invoices.length} 张` },
                { label: "全量逾期未收", value: formatCny(invoices.filter(row => row.dataRef.overdueDays > 0).reduce((sum, row) => sum + row.dataRef.outstanding, 0)) },
                { label: "已选催收", value: formatCny(outstanding) },
            ]}
            actions={<div className={scenarioActionsStyle}>
                <Button type="button" size="s" appearance="outlined" onClick={() => {
                    try { window.localStorage.removeItem(storageKey); } catch { /* 存储不可用时仅重置当前视图。 */ }
                    setView(current => ({ revision: current.revision + 1, ready: true }));
                    setSelectedIds(new Set());
                    setFeedback("已恢复默认列布局和筛选条件。");
                }}>恢复默认视图</Button>
                <Button type="button" size="s" appearance="primary" disabled={selected.length === 0} onClick={() => {
                    setFeedback(`已生成模拟催收清单：${selected.length} 张发票，未收款 ${formatCny(outstanding)}。`);
                    setSelectedIds(new Set());
                }}>生成催收清单</Button>
            </div>}
            feedback={feedback}
        >
            {view.ready ? <TablePro<InvoiceRow>
                key={view.revision}
                className={scenarioTableStyle}
                fetchColumns={fetchColumns}
                request={requestInvoices}
                pagination={false}
                typeLoaders={typeLoaders}
                defaultSortColumns={[{ columnName: "$.overdueDays", direction: "desc" }]}
                rowSelection={{ type: "checkbox", selectedRowIds: selectedIds, onChange: ids => setSelectedIds(ids), getDisabled: row => row.dataRef.overdueDays === 0 }}
                showSummary
                showSearchBar
                sideBar
                filterBar
                resizable
                draggableColumns
                initialState={view.initialState}
                onStateChange={state => {
                    try { window.localStorage.setItem(storageKey, JSON.stringify(state)); } catch { /* 私密模式下仍可临时使用。 */ }
                }}
                exportFileName="应收账款-筛选结果"
            /> : <p role="status">正在恢复保存的视图…</p>}
        </ScenarioFrame>
    );
}
