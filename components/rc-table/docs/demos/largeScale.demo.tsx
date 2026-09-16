export const meta = {
    title: "大规模数据 · 连锁门店日经营报表",
    description: "1,000 家门店 × 1,000 列：4 个门店字段与 249 天的订单数、件数、销售额、退款单数，共 100 万单元格。",
};
import Table from "../../src/index.js";
import type { ColumnType } from "../../src/types.js";
import { dateAfter, money } from "./_mock.js";
import { makeStoreReport, STORE_DAYS, STORE_COLUMNS, type StoreRow } from "./_scenarios.js";
import { DemoFrame, field, numericCellStyle } from "./_shared.js";
const rows = makeStoreReport();
const metrics = [
    { key: "orders", title: "订单数" }, { key: "units", title: "销售件数" },
    { key: "revenue", title: "销售额" }, { key: "returns", title: "退款单数" },
] as const;
const columns: ColumnType<StoreRow>[] = [
    { ...field<StoreRow>("storeCode", "门店编码", 140), fixed: "left" },
    field("storeName", "门店名称", 190), field("region", "大区", 100), field("city", "城市", 100),
    ...Array.from({ length: STORE_DAYS }, (_, day) => ({
        name: "day-" + day, title: dateAfter("2026-01-01", day),
        children: metrics.map(metric => ({
            name: "$.daily[" + day + "]." + metric.key, title: metric.title, width: metric.key === "revenue" ? 150 : 110,
            align: "right" as const,
            ...(metric.key === "revenue" ? { render: ({ row }: { row: StoreRow }) => <span className={numericCellStyle}>{money(row.dataRef.daily[day].revenue)}</span> } : {}),
        })),
    })),
];
export default function LargeScaleDemo() {
    return <DemoFrame title="连锁门店日经营报表" rows={rows.length} columns={STORE_COLUMNS}
        hint="2026-01-01 至 2026-09-06，每天 4 项经营指标。周末客流有波动，退款单数不超过订单数；横向滚动跨日期，纵向滚动跨门店。">
        {(width, height) => <Table aria-label="千店千列日经营报表" width={width} height={height} rows={rows} columns={columns} />}
    </DemoFrame>;
}
