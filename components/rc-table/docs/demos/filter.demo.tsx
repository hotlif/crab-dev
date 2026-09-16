export const meta = {
    title: "过滤栏 · 销售订单查询",
    description: "3,000 笔订单、24 列；文本、枚举与金额条件组合筛选，支持清空条件和无结果反馈。",
};
import { useState } from "react";
import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import Select from "@crab-dev/rc-select";
import Table from "../../src/index.js";
import { makeOrders } from "./_mock.js";
import { filterOrders } from "./_operations.js";
import { DemoFrame, orderColumns, fieldStyle, noteStyle } from "./_shared.js";
const allRows = makeOrders();
const options: Record<string, string[]> = {
    "$.region": ["华北", "华东", "华南", "西南", "华中", "西北"],
    "$.status": ["待审核", "待发货", "运输中", "已完成", "已取消"],
    "$.paymentStatus": ["未收款", "部分收款", "已结清", "已关闭"],
};
const columns = orderColumns().map(column => ({
    ...column, filterable: !["$.discount", "$.remark"].includes(column.name),
    ...(options[column.name] ? {
        filterEditor: ({ value, onValueChange }: { value: string; onValueChange: (value: string) => void }) =>
            <Select className={fieldStyle} size="small" aria-label={"筛选" + column.title} value={value || undefined} allowClear
                placeholder="全部" options={options[column.name].map(item => ({ label: item, value: item }))}
                onChange={next => onValueChange(next ?? "")} />,
    } : {}),
}));
export default function FilterDemo() {
    const [filters, setFilters] = useState<Record<string, string>>({});
    const rows = filterOrders(allRows, filters);
    return <DemoFrame title="销售订单查询" rows={rows.length} columns={columns.length}
        hint="所有条件同时生效。文本支持部分匹配；金额/数量支持 >=10000、1000-5000 或精确数值，非法表达式无匹配。"
        toolbar={<Button disabled={!Object.values(filters).some(Boolean)} onClick={() => setFilters({})}>清空筛选</Button>}
        footer={<p className={noteStyle} role="status">匹配 {rows.length} / {allRows.length} 笔订单</p>}>
        {(width, height) => <Table aria-label="可组合筛选的销售订单" width={width} height={height} rows={rows} columns={columns}
            filterBar filters={filters} onFilterChange={setFilters}
            renderDefaultFilterEditor={({ column, value, onValueChange }) =>
                <LineEdit size="small" className={fieldStyle} aria-label={"筛选" + column.title}
                    placeholder="输入条件" value={value} onChange={event => onValueChange(event.target.value)} />}
            empty={<div>没有符合全部条件的订单，请调整条件或清空筛选。</div>} />}
    </DemoFrame>;
}
