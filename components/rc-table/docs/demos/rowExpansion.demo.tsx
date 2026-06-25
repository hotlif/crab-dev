/**
 * title = "行展开（详情面板）"
 * description = "通过 `expandedRowRender` 在行下方插入自定义详情区，点击行首图标展开或收起。展开内容跨所有列、随表格一起横向滚动；当详情高度超过 `expandedRowHeight` 时面板内部可独立纵向滚动（滚轮 / 触控板）。区别于树形数据：这里展示的是异构详情而非同构子行。"
 */

import { type Key, useState } from "react";
import { fakerZH_CN as faker } from "@faker-js/faker";
import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/types.js";
import { COMPANIES, CITIES, CHANNELS } from "./_mock.js";

interface OrderRow extends Row {
    dataRef: {
        orderNo: string
        customer: string
        owner: string
        category: string
        quantity: number
        unitPrice: number
        amount: number
        channel: string
        city: string
        status: string
        orderDate: string
        deliveryDate: string
        address: string
        remark: string
    }
}

const ORDER_STATUSES = ["待付款", "待发货", "已发货", "已完成", "已取消"];
const CATEGORIES = ["标准版授权", "专业版授权", "旗舰版授权", "私有化部署", "增值服务包", "技术支持续费"];
const UNIT_PRICES = [1980, 4980, 9800, 19800, 39800, 88000];
const REMARKS = [
    "需开具增值税专用发票，收货请提前电话联系。",
    "客户要求分两批发货，首批本周内送达。",
    "长期合作客户，享受 9 折协议价。",
    "收货仅限工作日上午，请提前预约。",
    "含定制化配置，交付前需二次确认参数。",
    "尾款月结 30 天，已签署补充协议。",
];

faker.seed(20260619);

const orders: OrderRow[] = Array.from({ length: 30 }, (_, index) => {
    const orderNo = `PO-${1001 + index}`;
    const quantity = faker.number.int({ min: 1, max: 50 });
    const unitPrice = faker.helpers.arrayElement(UNIT_PRICES);
    const orderDate = faker.date.between({ from: "2024-06-01", to: "2025-12-31" });
    const deliveryDate = new Date(orderDate.getTime() + faker.number.int({ min: 3, max: 30 }) * 86400000);
    return {
        id: orderNo,
        dataRef: {
            orderNo,
            customer: faker.helpers.arrayElement(COMPANIES),
            owner: faker.person.fullName(),
            category: faker.helpers.arrayElement(CATEGORIES),
            quantity,
            unitPrice,
            amount: quantity * unitPrice,
            channel: faker.helpers.arrayElement(CHANNELS),
            city: faker.helpers.arrayElement(CITIES),
            status: faker.helpers.arrayElement(ORDER_STATUSES),
            orderDate: orderDate.toISOString().slice(0, 10),
            deliveryDate: deliveryDate.toISOString().slice(0, 10),
            address: `${faker.helpers.arrayElement(CITIES)}${faker.location.streetAddress()}`,
            remark: faker.helpers.arrayElement(REMARKS),
        },
    };
});

const columns: ColumnType<OrderRow>[] = [
    { name: "$.orderNo", title: "订单号", width: 120, fixed: "left" },
    { name: "$.customer", title: "客户", width: 150 },
    { name: "$.owner", title: "负责人", width: 100 },
    { name: "$.category", title: "品类", width: 130 },
    { name: "$.quantity", title: "数量", width: 90, align: "right" },
    { name: "$.unitPrice", title: "单价", width: 110, align: "right",
        render: ({ row }) => `¥${row.dataRef.unitPrice.toLocaleString()}` },
    { name: "$.amount", title: "金额", width: 140, align: "right",
        render: ({ row }) => `¥${row.dataRef.amount.toLocaleString()}` },
    { name: "$.channel", title: "渠道", width: 100 },
    { name: "$.city", title: "地区", width: 100 },
    { name: "$.status", title: "状态", width: 110 },
    { name: "$.orderDate", title: "下单日期", width: 120 },
];

const cellLabelStyle = { color: "#888", marginRight: 6 } as const;

const RowExpansionDemo = () => {
    const [expandedRowKeys, setExpandedRowKeys] = useState<Set<Key>>(
        new Set(["PO-1001"])
    );

    return (
        <Table<OrderRow>
            width={900}
            height={440}
            rows={orders}
            columns={columns}
            expandedRowKeys={expandedRowKeys}
            onExpandedRowKeysChange={setExpandedRowKeys}
            expandedRowHeight={96}
            expandedRowRender={(row) => (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(2, minmax(0, 1fr))", gap: "6px 32px", fontSize: 13, lineHeight: 1.6 }}>
                    <div><span style={cellLabelStyle}>客户</span>{row.dataRef.customer}</div>
                    <div><span style={cellLabelStyle}>负责人</span>{row.dataRef.owner}</div>
                    <div><span style={cellLabelStyle}>品类</span>{row.dataRef.category}</div>
                    <div><span style={cellLabelStyle}>渠道</span>{row.dataRef.channel}</div>
                    <div><span style={cellLabelStyle}>明细</span>{row.dataRef.quantity} × ¥{row.dataRef.unitPrice.toLocaleString()} = ¥{row.dataRef.amount.toLocaleString()}</div>
                    <div><span style={cellLabelStyle}>交付日期</span>{row.dataRef.orderDate} → {row.dataRef.deliveryDate}</div>
                    <div style={{ gridColumn: "1 / -1" }}><span style={cellLabelStyle}>收货地址</span>{row.dataRef.address}</div>
                    <div style={{ gridColumn: "1 / -1" }}><span style={cellLabelStyle}>备注</span>{row.dataRef.remark}</div>
                </div>
            )}
        />
    );
};

export default RowExpansionDemo;
