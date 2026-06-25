/**
 * title = "动态行高"
 * description = "使用原生 DOM 动态计算行高，并演示 row.height 的优先级"
 */

import { css } from "@linaria/core";
import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";

interface DemoRow extends Row {
    height?: number
    dataRef: {
        id: string
        title: string
        summary: string
        owner: string
        priority: "低" | "中" | "高"
    }
}

const summaryStyle = css`
    display: inline-flex;
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    padding: 8px;
    align-items: flex-start;
    white-space: normal;
    line-height: 1.5;
`

const badgeStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    padding: 0 8px;
    border-radius: 999px;
    box-sizing: border-box;
    background-color: hsl(220deg 15% 94%);
`

const SUMMARY_CELL_WIDTH = 560;
const SUMMARY_MIN_HEIGHT = 44;

let summaryMeasurer: HTMLDivElement | null = null;

const getSummaryMeasurer = () => {
    if (typeof document === "undefined") {
        return null;
    }

    if (summaryMeasurer != null) {
        return summaryMeasurer;
    }

    const element = document.createElement("div");
    element.className = summaryStyle;
    element.style.position = "absolute";
    element.style.left = "-99999px";
    element.style.top = "0";
    element.style.visibility = "hidden";
    element.style.pointerEvents = "none";
    element.style.width = `${SUMMARY_CELL_WIDTH}px`;
    element.style.height = "auto";
    document.body.appendChild(element);

    summaryMeasurer = element;
    return summaryMeasurer;
};

const measureSummaryHeight = (text: string) => {
    const measurer = getSummaryMeasurer();
    if (measurer == null) {
        return SUMMARY_MIN_HEIGHT;
    }

    measurer.textContent = text;
    return Math.max(SUMMARY_MIN_HEIGHT, Math.ceil(measurer.getBoundingClientRect().height));
};



const columns: ColumnType<DemoRow>[] = [
    {
        title: "编号",
        name: "$.id",
        width: 100,
    },
    {
        title: "标题",
        name: "$.title",
        width: 180,
    },
    {
        title: "说明",
        name: "$.summary",
        width: 560,
        render: ({ row }) => {
            return (
                <div className={summaryStyle}>
                    {row.dataRef.summary}
                </div>
            )
        }
    },
    {
        title: "负责人",
        name: "$.owner",
        width: 160,
    },
    {
        title: "优先级",
        name: "$.priority",
        width: 110,
        align: "center",
        render: ({ row }) => {
            return (
                <div className={badgeStyle}>
                    {row.dataRef.priority}
                </div>
            )
        }
    },
]

interface Ticket {
    title: string
    summary: string
    priority: DemoRow["dataRef"]["priority"]
    /** 显式行高：演示 row.height 优先于自动测量 */
    height?: number
}

const tickets: Ticket[] = [
    { title: "登录页报错", summary: "用户反馈部分浏览器下登录按钮无响应，已复现，待排查。", priority: "高" },
    { title: "列表分页异常", summary: "翻页后偶现重复数据，怀疑与缓存键有关，需要补充单测覆盖边界场景。", priority: "中" },
    { title: "文案微调", summary: "把「确定」改为「保存」。", priority: "低" },
    { title: "导出超时", summary: "大数据量导出在十万行以上会超时，计划改为后台异步任务 + 邮件通知下载链接，前端增加进度查询轮询。", priority: "高" },
    { title: "手动覆盖行高", summary: "这一行通过 row.height 直接指定固定高度，用来展示手动高度会优先于自动测量（无论文本多短都保持该高度）。", priority: "中", height: 96 },
    { title: "移动端适配", summary: "在后台列表里，经常会遇到一部分记录只占一行、另一部分记录需要三四行高度的情况；本条特意写长，便于同时观察虚拟滚动、固定列以及顶部偏移在大行高下的对齐表现是否稳定。", priority: "高" },
    { title: "权限校验缺失", summary: "详情接口未校验数据归属，存在越权读取风险，需在网关与服务层双重校验。", priority: "高" },
    { title: "图表配色优化", summary: "调整默认调色板，提升色弱可读性。", priority: "低" },
    { title: "搜索高亮", summary: "关键字命中需要高亮，并支持上一个 / 下一个跳转定位。", priority: "中" },
    { title: "批量操作", summary: "支持多选后批量归档、批量分配负责人，并在操作前给出二次确认与影响行数提示。", priority: "中" },
    { title: "空状态缺失", summary: "无数据时仅显示空白，需补充插画 + 引导文案。", priority: "低" },
    { title: "并发编辑冲突", summary: "两人同时编辑同一条记录时后保存的会覆盖前者，需要引入乐观锁版本号，冲突时提示用户刷新合并，避免静默丢失修改。", priority: "高" },
    { title: "国际化", summary: "抽取硬编码中文文案到语言包，先支持中英两种语言。", priority: "中" },
    { title: "性能埋点", summary: "补充首屏渲染与接口耗时埋点。", priority: "低" },
]

const OWNERS = [
    "林昭", "周岚", "陈默", "苏晚晴", "黄屹", "郑澄", "何沐阳",
    "孙桉", "罗宇", "蒋彦", "唐悦", "韩疏", "冯霁", "沈洲",
] as const;

const rows: DemoRow[] = tickets.map((ticket, index) => ({
    id: String(index + 1),
    height: ticket.height,
    dataRef: {
        id: `REQ-${String(index + 1).padStart(3, "0")}`,
        title: ticket.title,
        summary: ticket.summary,
        owner: OWNERS[index % OWNERS.length],
        priority: ticket.priority,
    },
}))

const getRowHeight = (row: DemoRow) => {
    if (row.height != null) {
        return row.height;
    }

    return measureSummaryHeight(row.dataRef.summary);
}

const DynamicRowHeightDemo = () => {
    return (
        <Table
            width={1110}
            height={360}
            columns={columns}
            rows={rows}
            getRowHeight={getRowHeight}
        />
    )
}

export default DynamicRowHeightDemo;
