import { useState } from "react";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-button/css/index.css";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Table, { type Row, type ColumnType } from "@crab-dev/rc-table";
import AutoSizer from "@crab-dev/rc-auto-sizer";
import "@crab-dev/rc-table/css/index.css";
import "@crab-dev/rc-auto-sizer/css/index.css";

interface OrderRow extends Row {
    dataRef: {
        orderNo: string; customer: string; owner: string; city: string; warehouse: string;
        sku: string; product: string; category: string; quantity: number; unit: string;
        price: number; discount: number; amount: number; paid: number; outstanding: number;
        orderDate: string; deliveryDate: string; channel: string; remark: string; status: string;
    };
}
const products = [
    { sku: "NET-SW-24", product: "24口千兆企业交换机", category: "网络设备", price: 1899, unit: "台" },
    { sku: "POS-T15", product: "双屏收银终端（含安装调试）", category: "门店设备", price: 4599, unit: "套" },
    { sku: "OFF-MON-27", product: "27英寸办公显示器", category: "办公设备", price: 1299, unit: "台" },
    { sku: "STO-SSD-2T", product: "企业级固态硬盘 2TB", category: "存储设备", price: 1399, unit: "块" },
];
const customers = ["启明精密制造有限公司", "远峰连锁商业集团有限公司", "中联仓储物流有限公司", "云象数据技术有限公司"];
const cities = ["北京", "上海", "深圳", "成都"];
const owners = ["陈思远", "王雨桐", "李文博", "周嘉宁"];
const formatter = new Intl.NumberFormat("zh-CN", { style: "currency", currency: "CNY" });
const numberCell = css`
    display: flex; align-items: center; justify-content: flex-end;
    width: 100%; height: 100%; box-sizing: border-box;
    padding-inline: ${token.space["component-gap"]}; font-variant-numeric: tabular-nums;
`;
const money = (value: number) => <span className={numberCell}>{formatter.format(value)}</span>;
// 虚构数据，固定日期确保刷新后记录和排序一致。
const rows: OrderRow[] = Array.from({ length: 2000 }, (_, index) => {
    const product = products[index % products.length];
    const office = Math.floor(index / 7) % cities.length;
    const quantity = 3 + (index * 17) % 118;
    const discount = quantity >= 80 ? 0.08 : quantity >= 30 ? 0.03 : 0;
    const amount = Math.round(quantity * product.price * (1 - discount) * 100) / 100;
    const bucket = index % 20;
    const status = bucket < 3 ? "待审核" : bucket < 8 ? "待发货" : bucket < 12 ? "运输中" : "已完成";
    const paid = status === "待审核" ? 0 : status === "已完成" ? amount : Math.round(amount * 0.3 * 100) / 100;
    const age = status === "已完成" ? 15 + index % 90 : status === "运输中" ? 3 : index % 3;
    const orderTime = Date.UTC(2026, 8, 12 - age);
    const orderNo = "SO-2026-" + String(index + 1).padStart(6, "0");
    return { id: orderNo, dataRef: {
        orderNo, ...product, customer: customers[Math.floor(index / 3) % customers.length],
        owner: owners[office], city: cities[office], warehouse: cities[office] + "中心仓",
        quantity, discount, amount, paid, outstanding: Math.round((amount - paid) * 100) / 100,
        orderDate: new Date(orderTime).toISOString().slice(0, 10),
        deliveryDate: new Date(orderTime + 7 * 86400000).toISOString().slice(0, 10),
        channel: index % 3 === 0 ? "企业商城" : "直营",
        remark: index % 11 === 0 ? "分批配送，送货前联系收货人。" : "", status,
    } };
});
const columns: ColumnType<OrderRow>[] = [
    { name: "$.orderNo", title: "订单号", width: 190, fixed: "left" },
    { name: "$.customer", title: "客户名称", width: 280 },
    { name: "$.owner", title: "客户经理", width: 110 },
    { name: "$.city", title: "收货城市", width: 110 },
    { name: "$.warehouse", title: "发货仓库", width: 150 },
    { name: "$.sku", title: "商品编码", width: 160 },
    { name: "$.product", title: "商品名称", width: 300 },
    { name: "$.category", title: "品类", width: 130 },
    { name: "$.quantity", title: "数量", width: 100, align: "right" },
    { name: "$.unit", title: "单位", width: 80 },
    { name: "$.price", title: "含税单价", width: 150, align: "right", render: ({ row }) => money(row.dataRef.price) },
    { name: "$.discount", title: "折扣率", width: 100, align: "right", render: ({ row }) => <span className={numberCell}>{Math.round(row.dataRef.discount * 100)}%</span> },
    { name: "$.amount", title: "折后订单额", width: 170, align: "right", render: ({ row }) => money(row.dataRef.amount) },
    { name: "$.paid", title: "已收款", width: 150, align: "right", render: ({ row }) => money(row.dataRef.paid) },
    { name: "$.outstanding", title: "待收款", width: 150, align: "right", render: ({ row }) => money(row.dataRef.outstanding) },
    { name: "$.orderDate", title: "下单日期", width: 140 },
    { name: "$.deliveryDate", title: "约定交付日", width: 140 },
    { name: "$.channel", title: "销售渠道", width: 120 },
    { name: "$.remark", title: "配送备注", width: 300 },
    { name: "$.status", title: "订单状态", width: 120 },
];
const layout = css`
    display: flex; flex-direction: column; gap: ${token.space["stack-gap"]}; min-width: 0;
    color: ${token.color.text.primary};
    width: min(1280px, calc(100vw - ${token.space["section-gap"]} * 2)); max-width: 100%;
    --token-semantic-color-background-sunken: ${token.color.background.elevated};
    @media (forced-colors: active) { color: CanvasText; }
    @media (prefers-reduced-motion: reduce) { scroll-behavior: auto; }
`;
const frame = css`
    height: calc(${token.space["section-gap"]} * 32);
    width: 100%; min-width: 0;
`;
export default function Example() {
    const [pendingOnly, setPendingOnly] = useState(false);
    const visible = pendingOnly ? rows.filter(row => row.dataRef.status === "待审核") : rows;
    return <div className={layout}>
        <strong>采购订单审核清单 · 20 列</strong>
        <Button isSelected={pendingOnly} onClick={() => setPendingOnly(value => !value)}>
            {pendingOnly ? "显示全部订单" : "只看待审核订单"}
        </Button>
        <output>当前 {visible.length.toLocaleString("zh-CN")} / 2,000 笔订单</output>
        <div className={frame}><AutoSizer>{({ width, height }) => width > 0 && height > 0
            ? <Table aria-label="采购订单审核查询结果" width={width} height={height} columns={columns} rows={visible} /> : null}</AutoSizer></div>
    </div>;
}
