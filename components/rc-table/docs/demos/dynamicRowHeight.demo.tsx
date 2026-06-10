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

const rows: DemoRow[] = [
    {
        id: "1",
        dataRef: {
            id: "REQ-001",
            title: "单行备注",
            summary: "短句只需要一行高度。",
            owner: "陈晨",
            priority: "低"
        }
    },
    {
        id: "2",
        dataRef: {
            id: "REQ-002",
            title: "双行备注",
            summary: "当内容稍微变长时，行高会被放大到足够容纳两行文本，避免出现压缩或裁切。",
            owner: "李然",
            priority: "中"
        }
    },
    {
        id: "3",
        dataRef: {
            id: "REQ-003",
            title: "手动覆盖",
            summary: "这一行直接通过 row.height 指定高度，用来展示手动高度会优先于自动计算。",
            owner: "王敏",
            priority: "高"
        }
    },
    {
        id: "4",
        dataRef: {
            id: "REQ-004",
            title: "长说明",
            summary: "适合写需求背景、交互说明或风险备注的长文本会继续把行撑高，保证整段内容在表格里保持可读。",
            owner: "赵宁",
            priority: "中"
        }
    },
    {
        id: "5",
        dataRef: {
            id: "REQ-005",
            title: "更长说明",
            summary: "在后台列表里，经常会遇到一部分记录只占一行、另一部分记录需要三四行高度的情况。这个示例用同一张表同时展示这些差异，便于验证虚拟滚动和固定列下的行高表现。",
            owner: "周帆",
            priority: "高"
        }
    },
    {
        id: "6",
        dataRef: {
            id: "REQ-006",
            title: "多段备注",
            summary: "这一条特意写得更长一些，观察大行高在滚动区域中的占位、顶部偏移和单元格对齐是否稳定。",
            owner: "刘泽",
            priority: "低"
        }
    },
]

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
