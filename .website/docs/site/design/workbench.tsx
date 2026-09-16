import { useId, useState, type Key } from "react";
import Table, { type ColumnType } from "@crab-dev/rc-table";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Card from "@crab-dev/rc-card";
import LineEdit from "@crab-dev/rc-line-edit";
import Select from "@crab-dev/rc-select";
import Pagination from "@crab-dev/rc-pagination";
import Tag from "@crab-dev/rc-tag";
import Button from "@crab-dev/rc-button";
import Empty from "@crab-dev/rc-empty";
import Spin from "@crab-dev/rc-spin";
import Alert from "@crab-dev/rc-alert";
import { design, type Density } from "./tokens.js";
import { filterProjects, projects, type ProjectRow } from "./data.js";

const columns: ColumnType<ProjectRow>[] = [
    { name: "$.name", title: "项目名称", width: 200 },
    { name: "$.owner", title: "负责人", width: 90 },
    { name: "$.status", title: "状态", width: 115, render: ({ row }) => <Tag
        color={row.dataRef.status === "已完成" ? "success" : row.dataRef.status === "进行中" ? "primary" : "default"}
    >{row.dataRef.status === "已完成" ? "✓ " : row.dataRef.status === "进行中" ? "◐ " : "○ "}{row.dataRef.status}</Tag> },
    { name: "$.budget", title: "预算 / 元", width: 115, align: "right", render: ({ row }) => row.dataRef.budget.toLocaleString("zh-CN") },
    { name: "$.updated", title: "更新日期", width: 100 },
];

export default function Workbench({ density, touch }: { density: Density; touch: boolean }) {
    const [query, setQuery] = useState("");
    const [status, setStatus] = useState("全部状态");
    const [scene, setScene] = useState("正常");
    const [page, setPage] = useState(1);
    const [selected, setSelected] = useState<Set<Key>>(new Set());
    const label = useId();
    const rows = filterProjects(query, status);
    const visible = rows.slice((page - 1) * design.pageSize, page * design.pageSize);
    const rowHeight = touch ? design.touch : design[density].row;
    function resetFilters() {
        setQuery(""); setStatus("全部状态"); setPage(1); setSelected(new Set()); setScene("正常");
    }
    return <div className="cl-stack">
        <div className="cl-metrics">
            {[
                ["全部项目", projects.length, "本地演示 · 2026 年 9 月"],
                ["正在进行", projects.filter(row => row.dataRef.status === "进行中").length, "◐ 持续推进中的工作"],
                ["已交付", projects.filter(row => row.dataRef.status === "已完成").length, "✓ 已完成并归档"],
            ].map(([title, value, caption]) => <Card key={title} variant="outlined">
                <div className="cl-stack"><span className="cl-muted">{title}</span><strong className="cl-number">{value}</strong><span className="cl-caption">{caption}</span></div>
            </Card>)}
        </div>
        <div className="cl-panel cl-stack">
            <div className="cl-row cl-between"><h4>项目台账</h4><span className="cl-caption">12 个项目 · 筛选 / 选择 / 分页</span></div>
            <div className="cl-row">
                <div className="cl-control cl-toolbar-search"><label htmlFor={`${label}-search`}>搜索项目</label>
                    <LineEdit id={`${label}-search`} placeholder="项目名称、编号或负责人" value={query} maxLength={60} allowClear
                        onClear={() => { setQuery(""); setPage(1); setSelected(new Set()); }}
                        onChange={event => { setQuery(event.target.value); setPage(1); setSelected(new Set()); }} />
                </div>
                <div className="cl-control cl-toolbar-filter"><span id={`${label}-status`}>项目状态</span>
                    <Select aria-label="项目状态" aria-labelledby={`${label}-status`} value={status}
                        options={["全部状态", "待启动", "进行中", "已完成"].map(value => ({ label: value, value }))}
                        onChange={value => { setStatus(value ?? "全部状态"); setPage(1); setSelected(new Set()); }} />
                </div>
                <div className="cl-control cl-toolbar-filter"><span id={`${label}-scene`}>展示场景</span>
                    <Select aria-label="展示场景" aria-labelledby={`${label}-scene`} value={scene}
                        options={["正常", "加载", "错误", "空数据"].map(value => ({ label: value, value }))}
                        onChange={value => { setScene(value ?? "正常"); setSelected(new Set()); }} />
                </div>
            </div>
            <div aria-busy={scene === "加载"}>
                {scene === "加载" ? <div className="cl-placeholder" role="status"><Spin /><p>正在读取项目，请稍候…</p></div>
                    : scene === "错误" ? <div className="cl-placeholder"><Alert type="error" title="项目暂时无法加载">这是模拟错误，重试即可恢复。</Alert><Button onClick={() => setScene("正常")}>重新加载</Button></div>
                        : scene === "空数据" || rows.length === 0 ? <div className="cl-placeholder"><Empty title="没有符合条件的项目" description="调整搜索词或状态，重新查看项目。" /><Button onClick={resetFilters}>重置筛选</Button></div>
                            : <div className="cl-table-frame"><AutoSizer>{({ width, height }) => width > 0 && height > 0
                                ? <Table aria-label="项目台账" width={width} height={height} columns={columns} rows={visible}
                                    headerRowHeight={rowHeight} getRowHeight={() => rowHeight}
                                    rowSelection={{ type: "checkbox", selectedRowIds: selected, onChange: setSelected }} /> : null}</AutoSizer></div>}
            </div>
            <div className="cl-row cl-between">
                <span role="status" className="cl-caption">{scene === "正常" ? `共 ${rows.length} 项 · 已选 ${selected.size} 项` : `正在展示${scene}场景`}</span>
                <Pagination aria-label="项目分页" current={page} pageSize={design.pageSize} total={scene === "正常" ? rows.length : 0}
                    disabled={scene !== "正常"} onChange={next => { setPage(next); setSelected(new Set()); }} />
            </div>
        </div>
        <p className="cl-caption">密度改变行高，数据含义保持一致。窄屏请在表格内部横向滚动；选择只作用于当前页，切页与筛选会清空选择。</p>
    </div>;
}
