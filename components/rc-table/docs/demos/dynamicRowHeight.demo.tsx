export const meta = {
    title: "动态行高 · 售后工单台账",
    description: "1,500 张工单、18 列，长短不同的处理记录对应不同行高，同时展示客户、SLA 和处理结果。",
};
import Table from "../../src/index.js";
import type { ColumnType } from "../../src/types.js";
import { makeTickets, type TicketRow } from "./_scenarios.js";
import { DemoFrame, field, proseCellStyle, Status } from "./_shared.js";
const rows = makeTickets();
const columns: ColumnType<TicketRow>[] = [
    { ...field<TicketRow>("ticketNo", "工单号", 170), fixed: "left" },
    field("title", "问题标题", 240),
    { ...field<TicketRow>("description", "处理记录", 460), render: ({ row }) => <div className={proseCellStyle}>{row.dataRef.description}</div> },
    field("customer", "客户", 280), field("orderNo", "关联订单", 190), field("product", "商品", 310),
    field("category", "工单类别"), field("priority", "优先级", 100), field("owner", "处理人", 110),
    field("team", "处理团队", 180), field("city", "城市", 100), field("channel", "来源", 140),
    { ...field<TicketRow>("status", "处理状态"), render: ({ row }) => <Status value={row.dataRef.status} /> },
    field("created", "创建日期"), field("due", "约定响应日"), field("resolved", "完成日期"),
    field("elapsed", "处理时长（小时）", 160), field("satisfaction", "客户评价", 120),
];
export default function DynamicRowHeightDemo() {
    return <DemoFrame title="售后服务工单台账" rows={rows.length} columns={columns.length}
        hint="长处理记录保留分行，行高随记录篇幅增加。未完成工单的完成日期为空；未评价与一般评价均保留。">
        {(width, height) => <Table aria-label="不同行高的售后工单" width={width} height={height} rows={rows} columns={columns}
            getRowHeight={row => row.height} />}
    </DemoFrame>;
}
