export const meta = {
    title: "关键字高亮 · 员工资料查找",
    description: "2,000 名员工、22 列，定位姓名、部门、项目、邮箱及格式化金额，支持上一个/下一个匹配。",
};
import { useState } from "react";
import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import Table, { highlightText } from "../../src/index.js";
import { employeeRows, money } from "./_mock.js";
import { DemoFrame, employeeColumns, noteStyle, numericCellStyle } from "./_shared.js";
const rows = employeeRows();
const columns = employeeColumns().map(col => {
    if (col.name === "$.totalComp") return {
        ...col, getSearchText: (row: typeof rows[number]) => money(row.dataRef.totalComp),
        render: ({ row, keyword, activeOccurrenceInCell }: {
            row: typeof rows[number]; keyword?: string; activeOccurrenceInCell?: number;
        }) => <span className={numericCellStyle}>{highlightText(money(row.dataRef.totalComp), keyword ?? "", activeOccurrenceInCell)}</span>,
    };
    // 自定义展示也复用原始高亮节点，使匹配数和可见内容一致。
    return { ...col, render: undefined };
});
export default function HighlightDemo() {
    const [keyword, setKeyword] = useState("研发");
    const [active, setActive] = useState(0);
    const [count, setCount] = useState(0);
    const canNavigate = Boolean(keyword.trim()) && count > 0;
    const navigate = (step: number) => {
        if (canNavigate) setActive(index => (index + step + count) % count);
    };
    return <DemoFrame title="员工资料全文查找" rows={rows.length} columns={columns.length}
        hint="查找「研发」「杭州」或邮箱。Enter 下一个，Shift+Enter 上一个；定位时自动滚动到目标行列。"
        toolbar={<><LineEdit aria-label="查找员工资料" value={keyword} placeholder="姓名、部门、城市、项目"
            onChange={event => { setKeyword(event.target.value); setActive(0); }}
            onKeyDown={event => { if (event.key === "Enter") { event.preventDefault(); navigate(event.shiftKey ? -1 : 1); } }} />
        <Button disabled={!canNavigate} onClick={() => navigate(-1)}>上一个</Button>
        <Button disabled={!canNavigate} onClick={() => navigate(1)}>下一个</Button>
        <span className={noteStyle} role="status">{canNavigate ? Math.min(active + 1, count) + " / " + count : "无匹配"}</span></>}>
        {(width, height) => <Table aria-label="可查找定位的员工资料" width={width} height={height} rows={rows} columns={columns}
            highlightKeyword={keyword.trim()} activeMatchIndex={canNavigate ? Math.min(active, count - 1) : undefined} onMatchCountChange={setCount} />}
    </DemoFrame>;
}
