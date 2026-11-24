import { useCallback, useEffect, useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import LineEdit from "@crab-dev/rc-line-edit";
import type { Row } from "@crab-dev/rc-table";
import TablePro, { type DataTypeLoader, type ProtocolColumnType, type ProtocolTableState, type ResultScope, type ResultSelection, type TableDataRequest, type TableProHandle } from "@crab-dev/rc-table-pro";
import { DataPrototype } from "./dataPrototype.js";

interface MonitorRow extends Row {
    dataRef: { device: string; zone: string; state: string; rounds: number };
}
const storageKey = "crab-prototype-table-pro-view";
const columns: ProtocolColumnType[] = [
    { name: "$.device", title: "设备", dataType: "text", width: 155 },
    { name: "$.zone", title: "工段", dataType: "text", width: 120 },
    { name: "$.state", title: "巡检状态", dataType: "state", width: 126, filterable: true },
    { name: "$.rounds", title: "巡检次数", dataType: "number", width: 100, sortable: true, align: "right" },
];
const zones = ["北区", "南区", "西区"];
const devices = ["输水泵", "进水调节阀", "压力表", "监测终端", "流量计", "供水阀"];
const initialRows: MonitorRow[] = Array.from({ length: 18 }, (_, index) => ({
    id: `E-${101 + index}`,
    dataRef: {
        zone: zones[Math.floor(index / devices.length)],
        device: `${zones[Math.floor(index / devices.length)]}${devices[index % devices.length]}`,
        state: index % 3 === 0 ? "待复核" : "运行正常",
        rounds: index % 7,
    },
}));
const fetchColumns = async () => columns;
const loaders: DataTypeLoader<MonitorRow>[] = [{
    name: "state", render: undefined, editRender: undefined,
    filterEditor: ({ value, onValueChange }) => <LineEdit size="small" aria-label="筛选巡检状态" value={value} onValueChange={onValueChange} />,
}];
const clearSelection = (): ResultSelection => ({ mode: "ids", ids: new Set() });

function readView(): ProtocolTableState | undefined {
    try {
        const value = localStorage.getItem(storageKey);
        if (!value) return undefined;
        const view: ProtocolTableState = JSON.parse(value);
        return view?.columnProps ? view : undefined;
    } catch { return undefined; }
}

function findMatching(rows: MonitorRow[], scope: ResultScope) {
    const keyword = scope.keyword?.trim().toLowerCase() || "";
    const filter = scope.filters["$.state"]?.trim() || "";
    return rows.filter(({ dataRef }) => (dataRef.device.toLowerCase().includes(keyword) || dataRef.state.includes(keyword))
        && dataRef.state.includes(filter));
}

interface Batch {
    ids: Set<MonitorRow["id"]>;
    selection: ResultSelection;
    fail: boolean;
}

export default function TableProPrototype() {
    const { designSystem } = useConfig();
    const [initial] = useState(readView);
    const [view, setView] = useState(initial);
    const [rows, setRows] = useState(initialRows);
    const [selection, setSelection] = useState(clearSelection);
    const [notice, setNotice] = useState("");
    const [batch, setBatch] = useState<Batch | null>(null);
    const [batchError, setBatchError] = useState(false);
    const table = useRef<TableProHandle>(null);
    const records = useRef(initialRows);
    const failRequest = useRef(false);
    const failBatch = useRef(true);
    const matches = findMatching(rows, { filters: view?.filters ?? {}, keyword: view?.keyword });
    const selectedRows = selection.mode === "ids"
        ? rows.filter((entry) => selection.ids.has(entry.id))
        : findMatching(rows, selection.scope).filter((entry) => !selection.excludedIds.has(entry.id));

    const request = useCallback<TableDataRequest<MonitorRow>>(async (query) => {
        const fail = failRequest.current;
        failRequest.current = false;
        await new Promise<void>((resolve) => setTimeout(resolve, 420));
        query.signal.throwIfAborted();
        if (fail) throw new Error("巡检服务暂时不可用，请重试同一查询。");
        const matching = findMatching(records.current, query);
        const sort = query.sort.find((column) => column.columnName === "$.rounds");
        if (sort) matching.sort((a, b) => (a.dataRef.rounds - b.dataRef.rounds) * (sort.direction === "asc" ? 1 : -1));
        const start = (query.page - 1) * query.pageSize;
        return { rows: matching.slice(start, start + query.pageSize), total: matching.length };
    }, []);

    useEffect(() => {
        if (!batch) return;
        const timer = setTimeout(() => {
            setBatch(null);
            if (batch.fail) {
                setBatchError(true);
                setNotice("批量复核失败，已保留选择。");
                return;
            }
            const next = records.current.map((entry) => batch.ids.has(entry.id)
                ? { ...entry, dataRef: { ...entry.dataRef, state: "已复核" } } : entry);
            records.current = next;
            setRows(next);
            setSelection((current) => current === batch.selection ? clearSelection() : current);
            setNotice(`已复核 ${batch.ids.size} 台设备。`);
            void table.current?.refresh().catch(() => undefined);
        }, 540);
        return () => clearTimeout(timer);
    }, [batch]);

    function confirm() {
        if (!selectedRows.length || batch) return;
        setBatchError(false);
        setNotice("正在批量复核…");
        setBatch({ ids: new Set(selectedRows.map(({ id }) => id)), selection, fail: failBatch.current });
        failBatch.current = false;
    }

    return <DataPrototype route="table-pro" title="TablePro 跨页数据工作流" description="搜索全部设备、管理列并核对跨页选择与失败恢复。"
        scene="待复核设备工作台" rules={[
            ["查询与视图", "搜索与状态筛选作用于所有记录。列设置、搜索词、筛选和页码保存在本浏览器，刷新后恢复。"],
            ["选择范围", "表头仅选择当前页。选择全部匹配记录则覆盖当前查询的所有页。更改查询会清除跨页全选，逐条选择按设备保留。"],
            ["失败恢复", "模拟读取失败后可重试同一查询。首次批量复核模拟失败，保留选择，重试提交已选设备。"],
            ["主题差异", "MD3 用着色区分查询和批量动作，macOS 采用紧凑行密度，shadcn/ui 用中性边界突出列管理。"],
        ]}>
        <div className="crab-data-actions">
            <Button appearance="primary" disabled={!selectedRows.length} loading={batch !== null} onClick={confirm}>
                {batchError ? "重试批量复核" : "批量标记已复核"}
            </Button>
            <Button appearance="outlined" onClick={async () => {
                if (!table.current) return;
                failRequest.current = true;
                try { await table.current.refresh(); } catch { /* TablePro presents the failure. */ }
            }}>模拟读取失败</Button>
        </div>
        <p className="crab-data-status" role="status" data-table-pro-scope>
            {selection.mode === "all" ? "跨页匹配" : "手动选择"} {selectedRows.length} 条 · 查询结果 {matches.length} 条
        </p>
        <p className="crab-data-status" role="status" data-batch-result>{notice}</p>
        <div className="crab-data-viewport">
            <TablePro ref={table} className="crab-data-table-pro" aria-label="设备复核结果" fetchColumns={fetchColumns} request={request}
                density={designSystem === "macos" ? "compact" : "standard"} showRowNumber={false} showSearchBar searchMode="server"
                sortMode="server" pagination={{ defaultPageSize: 4, pageSizeOptions: [4, 6, 12], showSizeChanger: false }}
                typeLoaders={loaders} sideBar resizable initialState={initial} onStateChange={(newState) => {
                    setView(newState);
                    try { localStorage.setItem(storageKey, JSON.stringify(newState)); } catch { /* The live view remains usable. */ }
                }} resultSelection={{ value: selection, onValueChange: setSelection }}
                empty={<span>没有符合查询的设备。</span>} />
        </div>
    </DataPrototype>;
}
