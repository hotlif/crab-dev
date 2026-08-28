export const meta = {
    title: "CSV 导出",
    description: "设置 exportFileName 后侧边栏出现导出按钮，点击后将当前可见列导出为 UTF-8 CSV 文件。DataTypeLoader.exportValue 可自定义每种数据类型的导出文本——例如将枚举值转换为中文标签，或对数值格式化。",
};

import { css } from "@crab-dev/css";
import ProtocolTable from "../../src/table.js";
import type { DataTypeLoader, ProtocolColumnType } from "../../src/types.js";
import type { Row } from "@crab-dev/rc-table";

interface OrderRow extends Row {
    dataRef: {
        orderId: string;
        customer: string;
        product: string;
        quantity: number;
        unitPrice: number;
        status: "pending" | "shipped" | "completed" | "cancelled";
        orderDate: string;
    };
}

const STATUS_LABEL: Record<string, string> = {
    pending:   "待处理",
    shipped:   "已发货",
    completed: "已完成",
    cancelled: "已取消",
};

const STATUSES = ["pending", "shipped", "completed", "cancelled"] as const;
const PRODUCTS = ["笔记本电脑", "无线鼠标", "机械键盘", "显示器", "耳机", "摄像头"];
const CUSTOMERS = ["张三", "李四", "王五", "赵六", "陈七", "刘八"];

const ALL_ROWS: OrderRow[] = Array.from({ length: 80 }, (_, i) => {
    const unitPrice = 299 + (i % 30) * 100;
    const quantity = 1 + (i % 5);
    return {
        id: String(i + 1),
        dataRef: {
            orderId:   `ORD-${String(i + 1).padStart(5, "0")}`,
            customer:  CUSTOMERS[i % CUSTOMERS.length],
            product:   PRODUCTS[i % PRODUCTS.length],
            quantity,
            unitPrice,
            status:    STATUSES[i % STATUSES.length],
            orderDate: `2024-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
        },
    };
});

const COLUMNS: ProtocolColumnType[] = [
    { name: "$.orderId",   title: "订单号",   dataType: "text",   width: 160, fixed: "left" },
    { name: "$.customer",  title: "客户",     dataType: "text",   width: 100 },
    { name: "$.product",   title: "商品",     dataType: "text",   width: 160 },
    { name: "$.quantity",  title: "数量",     dataType: "number", width: 80,  align: "right" },
    { name: "$.unitPrice", title: "单价（元）", dataType: "currency", width: 120, align: "right" },
    { name: "$.status",    title: "状态",     dataType: "status", width: 100 },
    { name: "$.orderDate", title: "下单日期",  dataType: "text",   width: 140 },
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
        exportValue: (raw) => String(raw ?? ""),
    },
    {
        name: "currency",
        render: undefined,
        editRender: undefined,
        filterEditor: undefined,
        // 导出时格式化为带千分位的数字字符串
        exportValue: (raw) => {
            const n = Number(raw);
            return isNaN(n) ? "" : n.toLocaleString("zh-CN");
        },
    },
    {
        name: "status",
        // 渲染时显示中文标签
        render: ({ row, column }) => {
            const field = String(column.name).replace(/^\$\./, "");
            const s = String(row.dataRef[field] ?? "");
            return STATUS_LABEL[s] ?? s;
        },
        editRender: undefined,
        filterEditor: undefined,
        // 导出时同样转换为中文标签
        exportValue: (raw) => STATUS_LABEL[raw as string] ?? String(raw ?? ""),
    },
];

const fetchColumns = (): Promise<ProtocolColumnType[]> =>
    new Promise((resolve) => setTimeout(() => resolve(COLUMNS), 150));

const fetchData = (): Promise<OrderRow[]> =>
    new Promise((resolve) => setTimeout(() => resolve(ALL_ROWS), 200));

const containerStyle = css`
    width: 100%;
    height: 420px;
`;

const ExportDemo = () => (
    <ProtocolTable<OrderRow>
        className={containerStyle}
        fetchColumns={fetchColumns}
        fetchData={fetchData}
        typeLoaders={TYPE_LOADERS}
        sideBar
        exportFileName="订单数据"
    />
);

export default ExportDemo;
