import { css } from "@crab-dev/css";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import Tag from "@crab-dev/rc-tag";
import token from "@crab-dev/rc-token-semantic";
import { useId, type ReactNode } from "react";
import type { ColumnType, Row } from "../../src/types.js";
import { money, type EmployeeRow, type OrderRow, type BudgetRow, type InventoryRow } from "./_mock.js";

export const stackStyle = css`
    display: flex; flex-direction: column; gap: ${token.space["stack-gap"]};
    min-width: 0; color: ${token.color.text.primary};
    font-size: ${token.font.size.body};
    @media (forced-colors: active) { color: CanvasText; }
    @media (prefers-reduced-motion: reduce) { scroll-behavior: auto; }
`;
// 工作台将示例居中放在收缩容器内，以视口计算宽度，避免百分比宽度退化为内容宽度。
const frameStyle = css`
    width: min(1280px, calc(100vw - ${token.space["section-gap"]} * 2));
    max-width: 100%;
    --token-semantic-color-background-sunken: ${token.color.background.elevated};
`;
export const toolbarStyle = css`
    display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space["component-gap"]};
    min-width: 0;
    & > * { max-width: 100%; }
`;
export const panelStyle = css`
    padding: ${token.space["section-gap"]}; border-radius: ${token.radius.md};
    background: ${token.color.background.sunken}; overflow-wrap: anywhere;
    color: ${token.color.text.secondary};
    @media (forced-colors: active) { background: Canvas; color: CanvasText; }
`;
export const fieldStyle = css`width: 100%; min-width: 0;`;
export const numericCellStyle = css`
    display: flex; align-items: center; justify-content: flex-end;
    width: 100%; height: 100%; box-sizing: border-box;
    padding-inline: ${token.space["component-gap"]}; font-variant-numeric: tabular-nums;
`;
export const noteStyle = css`
    margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption};
    overflow-wrap: anywhere;
`;
export const proseCellStyle = css`
    display: flex; align-items: center; height: 100%; box-sizing: border-box;
    padding: ${token.space["component-gap"]}; white-space: pre-line; overflow-wrap: anywhere;
`;
const viewportStyle = css`width: 100%; min-width: 0; height: 520px;`;
const titleStyle = css`margin: 0; font-size: ${token.font.size.subhead}; font-weight: ${token.font.weight.heading};`;

export function DemoFrame({ title, rows, columns, hint, toolbar, footer, children }: {
    title: string; rows: number; columns: number; hint: string; toolbar?: ReactNode;
    footer?: ReactNode; children: (width: number, height: number) => ReactNode;
}) {
    const titleId = useId();
    return <section className={frameStyle} aria-labelledby={titleId}><div className={stackStyle}>
        <h3 id={titleId} className={titleStyle}>{title}</h3>
        <p className={noteStyle}>{rows.toLocaleString("zh-CN")} 行 · {columns} 列 · 虚构数据快照：2026-09-12</p>
        <p className={noteStyle}>{hint}</p>
        {toolbar && <div className={toolbarStyle}>{toolbar}</div>}
        <div className={viewportStyle}>
            <AutoSizer>{({ width, height }) => width > 0 && height > 0 ? children(width, height) : null}</AutoSizer>
        </div>
        {footer}
    </div></section>;
}

export function Status({ value }: { value: string }) {
    const color = ["缺货", "超预算", "已取消", "离职"].includes(value) ? "error"
        : ["待审核", "待发货", "需补货", "接近上限", "试用", "待处理"].includes(value) ? "warning"
            : ["已完成", "已结清", "正常", "在职"].includes(value) ? "success" : "default";
    return <Tag color={color} size="small">{value}</Tag>;
}

export function field<T extends Row>(name: string, title: string, width = 140): ColumnType<T> {
    return { name: "$." + name, title, width };
}
export function amount<T extends Row>(name: string, title: string, pick: (row: T) => number): ColumnType<T> {
    return { ...field<T>(name, title, 160), align: "right", render: ({ row }) => <span className={numericCellStyle}>{money(pick(row))}</span> };
}

export function employeeColumns(): ColumnType<EmployeeRow>[] {
    return [
        { ...field<EmployeeRow>("employeeNo", "工号", 160), fixed: "left" },
        field("name", "姓名", 110), field("department", "部门"), field("jobTitle", "岗位", 160),
        field("position", "职级", 110), field("manager", "直属主管", 110), field("company", "所属公司", 260),
        field("region", "大区", 100), field("province", "省份", 120), field("city", "办公城市", 110),
        field("email", "工作邮箱", 300), field("phone", "联系电话", 150), field("joinDate", "入职日期"),
        field("yearsOfService", "工龄（年）", 110), field("contractEnd", "合同到期日"),
        field("performance", "年度绩效", 110), field("project", "所属项目", 200),
        amount("salary", "月基本工资", row => row.dataRef.salary),
        amount("bonus", "年度奖金", row => row.dataRef.bonus),
        amount("stock", "年度股权折算", row => row.dataRef.stock),
        amount("totalComp", "年度总薪酬", row => row.dataRef.totalComp),
        { ...field<EmployeeRow>("status", "任职状态", 120), render: ({ row }) => <Status value={row.dataRef.status} /> },
    ];
}
export function orderColumns(): ColumnType<OrderRow>[] {
    return [
        { ...field<OrderRow>("orderNo", "订单号", 190), fixed: "left" },
        field("customer", "客户名称", 280), field("industry", "行业", 120),
        field("region", "大区", 100), field("city", "收货城市", 110),
        field("owner", "客户经理", 120), field("channel", "销售渠道", 120),
        field("sku", "商品编码", 160), field("product", "商品名称", 310), field("category", "品类", 130),
        { ...field<OrderRow>("quantity", "数量", 100), align: "right" }, field("unit", "单位", 80),
        amount("unitPrice", "含税单价", row => row.dataRef.unitPrice),
        { ...field<OrderRow>("discount", "折扣率", 100), align: "right", render: ({ row }) => <span className={numericCellStyle}>{(row.dataRef.discount * 100).toFixed(0)}%</span> },
        amount("amount", "折后订单额", row => row.dataRef.amount),
        amount("paid", "已收款", row => row.dataRef.paid),
        amount("outstanding", "待收款", row => row.dataRef.outstanding),
        field("paymentStatus", "收款状态", 120), field("warehouse", "发货仓库", 150),
        field("orderDate", "下单日期"), field("deliveryDate", "约定交付日"),
        field("trackingNo", "物流单号", 190), field("remark", "配送备注", 340),
        { ...field<OrderRow>("status", "订单状态", 120), render: ({ row }) => <Status value={row.dataRef.status} /> },
    ];
}
export function budgetColumns(): ColumnType<BudgetRow>[] {
    return [
        { ...field<BudgetRow>("code", "预算编号", 180), fixed: "left" },
        field("project", "项目名称", 270), field("department", "归属部门"), field("owner", "负责人", 110),
        field("city", "城市", 100), field("category", "费用科目"),
        ...Array.from({ length: 12 }, (_, month) => amount<BudgetRow>(
            "monthly[" + month + "]", (month + 1) + "月预算", row => row.dataRef.monthly[month],
        )),
        amount("planned", "全年预算", row => row.dataRef.planned),
        amount("actual", "截至8月实支", row => row.dataRef.actual),
        amount("remaining", "全年剩余额度", row => row.dataRef.remaining),
        { ...field<BudgetRow>("execution", "全年预算使用率", 160), align: "right", render: ({ row }) => <span className={numericCellStyle}>{(row.dataRef.execution * 100).toFixed(1)}%</span> },
        { ...field<BudgetRow>("status", "预算状态", 120), render: ({ row }) => <Status value={row.dataRef.status} /> },
    ];
}
export function inventoryColumns(): ColumnType<InventoryRow>[] {
    return [
        { ...field<InventoryRow>("recordNo", "库存记录号", 160), fixed: "left" },
        field("sku", "商品编码", 160), field("product", "商品名称", 310), field("category", "品类", 120),
        field("warehouse", "仓库", 150), field("region", "大区", 100), field("city", "城市", 100),
        field("location", "库位", 120), field("batch", "批次号", 220), field("supplier", "供应商", 210),
        ...(["onHand", "reserved", "available", "minimum", "inTransit"] as const).map((key, i) => ({
            ...field<InventoryRow>(key, ["账面库存", "已占用", "可用库存", "安全库存", "在途数量"][i], 120), align: "right" as const,
        })),
        field("unit", "单位", 80), amount("cost", "采购成本", row => row.dataRef.cost),
        amount("value", "库存货值", row => row.dataRef.value), field("lastCountDate", "上次盘点日"),
        field("nextCountDate", "下次盘点日"), field("owner", "仓库负责人", 130),
        { ...field<InventoryRow>("status", "库存状态", 120), render: ({ row }) => <Status value={row.dataRef.status} /> },
        field("note", "盘点备注", 350),
    ];
}


export function OrderDetails({ row }: { row: OrderRow }) {
    const order = row.dataRef;
    return <div className={stackStyle}>
        <strong>{order.orderNo} · {order.customer}</strong>
        <div className={panelStyle}>
            <p>收货地址：{order.address}；客户经理：{order.owner}</p>
            <p>商品：{order.product}（{order.sku}），{order.quantity} {order.unit} × {money(order.unitPrice)}，
                折扣 {Math.round(order.discount * 100)}%，折后 {money(order.amount)}</p>
            <p>收款：{order.paymentStatus}；已收 {money(order.paid)}；待收 {money(order.outstanding)}</p>
            <p>仓库：{order.warehouse}；物流单号：{order.trackingNo || "尚未发货"}；约定交付：{order.deliveryDate || "订单已取消"}</p>
            <p>配送要求：{order.remark || "按标准流程配送，收货时核对数量和序列号。"}</p>
            <p>处理进度：{order.orderDate} 下单 → {order.status}。</p>
        </div>
    </div>;
}
