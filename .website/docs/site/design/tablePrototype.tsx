import { type Key, useEffect, useRef, useState } from "react";
import Alert from "@crab-dev/rc-alert";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import LineEdit from "@crab-dev/rc-line-edit";
import Spin from "@crab-dev/rc-spin";
import Table, { type ColumnType, type Row, type SortColumn } from "@crab-dev/rc-table";
import { DataPrototype } from "./dataPrototype.js";

interface Equipment extends Row {
    dataRef: { id: string; name: string; rounds: number; note: string; owner: string };
}
const initialRows: Equipment[] = [
    { id: "P-104", dataRef: { id: "P-104", name: "北区输水泵", rounds: 3, note: "检查入口压差", owner: "夜班运行组" } },
    { id: "V-019", dataRef: { id: "V-019", name: "进水调节阀及远程开度反馈模组", rounds: 7, note: "", owner: "现场仪表组" } },
    { id: "M-032", dataRef: { id: "M-032", name: "入口压力计", rounds: 0, note: "等待仪表复测", owner: "巡检组" } },
    { id: "F-026", dataRef: { id: "F-026", name: "回流管流量计", rounds: 5, note: "已回读校准记录", owner: "夜班运行组" } },
];
type Phase = "ready" | "loading" | "empty" | "failed";

function NoteEditor({ initial, name, onCommit, onCancel }: { initial: string; name: string; onCommit: (value: string) => void; onCancel: () => void }) {
    const canceled = useRef(false);
    return <LineEdit size="small" bordered={false} autoFocus defaultValue={initial} maxLength={60} aria-label={name}
        onBlur={(event) => { if (!canceled.current) onCommit(event.currentTarget.value.trim()); }}
        onKeyDown={(event) => {
            if (event.nativeEvent.isComposing) return;
            if (event.key === "Escape") {
                event.preventDefault();
                event.stopPropagation();
                canceled.current = true;
                onCancel();
            } else if (event.key === "Enter") {
                event.preventDefault();
                event.stopPropagation();
                event.currentTarget.blur();
            }
        }} />;
}

export default function TablePrototype() {
    const { designSystem } = useConfig();
    const [rows, setRows] = useState(initialRows);
    const [selected, setSelected] = useState(new Set<Key>());
    const [sort, setSort] = useState<SortColumn[]>([]);
    const [phase, setPhase] = useState<Phase>("ready");
    const [editingStatus, setEditingStatus] = useState("");

    useEffect(() => {
        if (phase !== "loading") return;
        const finish = setTimeout(() => setPhase("ready"), 800);
        return () => clearTimeout(finish);
    }, [phase]);

    const columns: ColumnType<Equipment>[] = [
        { name: "$.id", title: "设备号", width: 90 },
        { name: "$.rounds", title: "巡检次数", width: 104, sortable: true, align: "right" },
        { name: "$.note", title: "巡检备注", width: 166,
            render: ({ row }) => row.dataRef.note || "未记录",
            editRender: ({ row, onCommit, onCancel }) => <NoteEditor initial={row.dataRef.note} name={`${row.id} 巡检备注`}
                onCancel={() => { onCancel?.(); setEditingStatus("已放弃备注草稿。"); }}
                onCommit={(note) => {
                    setRows((items) => items.map((entry) => entry.id === row.id ? { ...entry, dataRef: { ...entry.dataRef, note } } : entry));
                    onCommit?.(note);
                    setEditingStatus(`${row.id} 备注已保存。`);
                }} /> },
        { name: "$.name", title: "设备名称", width: 210,
            render: ({ row }) => <span className="crab-data-table-value" title={row.dataRef.name}>{row.dataRef.name}</span> },
        { name: "$.owner", title: "负责班组", width: 120 },
    ];

    return <DataPrototype route="table" title="Table 基础数据表格" description="对设备清单排序、选择，并提交或放弃单元格备注。"
        scene="设备巡检清单" rules={[
            ["基础职责", "Table 管理当前设备清单的排序、选择和单元格编辑。跨页查询和批量范围由 TablePro 承载。"],
            ["单元格编辑", "双击备注或通过键盘进入编辑。Enter 和失焦保存文字，Esc 保留原备注。空备注标为未记录，次数为零时显示 0。"],
            ["窄屏与状态", "表格在自己的区域水平滚动。读取、无匹配和加载失败各自有可读提示，重试保持当前列表草稿。"],
            ["主题差异", "MD3 使用清晰表头状态，macOS 使用紧凑行密度，shadcn/ui 用中性边界和容易区分的选择反馈。"],
        ]}>
        <div className="crab-data-actions">
            <Button appearance="primary" loading={phase === "loading"} onClick={() => setPhase("loading")}>重新读取</Button>
            <Button appearance="outlined" onClick={() => { setSelected(new Set()); setPhase("empty"); }}>模拟空结果</Button>
            <Button appearance="text" onClick={() => { setSelected(new Set()); setPhase("failed"); }}>模拟连接失败</Button>
        </div>
        <p className="crab-data-status" role="status" data-table-status>已选 {selected.size} 台设备。{editingStatus}</p>
        {phase === "failed" && <Alert role="alert" type="error" title="设备清单请求失败">网关暂时不可达，可使用重新读取。</Alert>}
        <div className="crab-data-viewport">
            <AutoSizer disableHeight defaultWidth={360}>
                {({ width }) => <Spin spinning={phase === "loading"} delay={140} tip="正在读取设备清单">
                    <Table width={width} height={260} aria-label="设备巡检清单" editType="cell"
                        density={designSystem === "macos" ? "compact" : "standard"}
                        columns={columns} rows={phase === "empty" || phase === "failed" ? [] : rows}
                        empty={<span>{phase === "failed" ? "暂无可用设备数据。" : "当前没有匹配的设备。"}</span>}
                        sortColumns={sort} onSortColumnsChange={setSort}
                        rowSelection={{ type: "checkbox", selectedRowIds: selected, onSelectedRowIdsChange: setSelected }} />
                </Spin>}
            </AutoSizer>
        </div>
    </DataPrototype>;
}
