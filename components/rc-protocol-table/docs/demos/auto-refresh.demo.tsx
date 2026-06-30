/**
 * title = "自动刷新"
 * description = "autoRefreshInterval 指定轮询间隔（ms），侧边栏同时出现「立即刷新」按钮。此示例每 3 秒自动重新拉取一次数据，模拟实时监控场景。"
 */

import { css } from "@linaria/core";
import ProtocolTable from "../../src/table.js";
import type { DataTypeLoader, ProtocolColumnType } from "../../src/types.js";
import type { Row } from "@crab-dev/rc-table";

interface MetricRow extends Row {
    dataRef: {
        service:    string;
        instance:   string;
        cpuPct:     number;
        memPct:     number;
        qps:        number;
        latencyMs:  number;
        status:     "healthy" | "warning" | "critical";
        updatedAt:  string;
    };
}

const SERVICES  = ["auth-service", "user-service", "order-service", "payment-service", "notify-service"];
const INSTANCES = ["inst-01", "inst-02", "inst-03"];
const STATUSES: MetricRow["dataRef"]["status"][] = ["healthy", "warning", "critical"];

const STATUS_COLOR: Record<string, string> = {
    healthy:  "oklch(55% 0.18 140)",
    warning:  "oklch(60% 0.18 85)",
    critical: "oklch(50% 0.22 25)",
};

function generateRows(): MetricRow[] {
    const now = new Date().toLocaleTimeString("zh-CN");
    return SERVICES.flatMap((svc, si) =>
        INSTANCES.map((inst, ii) => {
            const idx = si * INSTANCES.length + ii;
            // 每次调用时引入随机抖动，模拟实时监控数据波动
            const cpu  = Math.min(99, 15 + idx * 7 + Math.round(Math.random() * 20));
            const mem  = Math.min(99, 30 + idx * 5 + Math.round(Math.random() * 15));
            const qps  = 100 + idx * 50 + Math.round(Math.random() * 80);
            const lat  = 5  + idx * 3  + Math.round(Math.random() * 20);
            const statusIdx = cpu > 80 ? 2 : cpu > 60 ? 1 : 0;
            return {
                id: `${si}-${ii}`,
                dataRef: {
                    service:   svc,
                    instance:  inst,
                    cpuPct:    cpu,
                    memPct:    mem,
                    qps,
                    latencyMs: lat,
                    status:    STATUSES[statusIdx],
                    updatedAt: now,
                },
            };
        })
    );
}

const COLUMNS: ProtocolColumnType[] = [
    { name: "$.service",   title: "服务",        dataType: "text",    width: 160, fixed: "left" },
    { name: "$.instance",  title: "实例",        dataType: "text",    width: 100 },
    { name: "$.cpuPct",   title: "CPU %",      dataType: "percent", width: 90,  align: "right" },
    { name: "$.memPct",   title: "内存 %",      dataType: "percent", width: 90,  align: "right" },
    { name: "$.qps",      title: "QPS",         dataType: "number",  width: 90,  align: "right" },
    { name: "$.latencyMs",title: "延迟（ms）",   dataType: "number",  width: 100, align: "right" },
    { name: "$.status",   title: "状态",         dataType: "status",  width: 90 },
    { name: "$.updatedAt",title: "更新时间",     dataType: "text",    width: 120 },
];

const TYPE_LOADERS: DataTypeLoader[] = [
    {
        name: "text",
        render: undefined,
        editRender: undefined,
        filterEditor: undefined,
    },
    {
        name: "number",
        render: undefined,
        editRender: undefined,
        filterEditor: undefined,
    },
    {
        name: "percent",
        render: ({ row, column }) => {
            const field = String(column.name).replace(/^\$\./, "");
            const n = Number(row.dataRef[field] ?? 0);
            const color = n > 80 ? "oklch(50% 0.22 25)" : n > 60 ? "oklch(60% 0.18 85)" : undefined;
            return <span style={{ color }}>{n}%</span>;
        },
        editRender: undefined,
        filterEditor: undefined,
    },
    {
        name: "status",
        render: ({ row, column }) => {
            const field = String(column.name).replace(/^\$\./, "");
            const s = String(row.dataRef[field] ?? "");
            const LABEL: Record<string, string> = { healthy: "正常", warning: "告警", critical: "严重" };
            return (
                <span style={{ color: STATUS_COLOR[s], fontWeight: 500 }}>
                    {LABEL[s] ?? s}
                </span>
            );
        },
        editRender: undefined,
        filterEditor: undefined,
    },
];

const fetchColumns = (): Promise<ProtocolColumnType[]> =>
    new Promise((resolve) => setTimeout(() => resolve(COLUMNS), 100));

const fetchData = (): Promise<MetricRow[]> =>
    new Promise((resolve) => setTimeout(() => resolve(generateRows()), 200));

const containerStyle = css`
    width: 100%;
    height: 420px;
`;

const AutoRefreshDemo = () => (
    <ProtocolTable<MetricRow>
        className={containerStyle}
        fetchColumns={fetchColumns}
        fetchData={fetchData}
        typeLoaders={TYPE_LOADERS}
        sideBar
        autoRefreshInterval={3000}
    />
);

export default AutoRefreshDemo;
