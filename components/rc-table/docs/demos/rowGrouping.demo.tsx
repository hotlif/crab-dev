export const meta = {
    title: "行分组 · 区域人员配置",
    description: "2,000 名员工、22 列，按大区和部门逐级分组，展开查看岗位、项目和薪酬构成。",
};
import { useState, type Key } from "react";
import Button from "@crab-dev/rc-button";
import Table from "../../src/index.js";
import { employeeRows } from "./_mock.js";
import { DemoFrame, employeeColumns } from "./_shared.js";
const rows = employeeRows();
const fields = employeeColumns();
const columns = [fields[7], fields[2], ...fields.filter(col => !["$.region", "$.department"].includes(col.name)).map(col => ({ ...col, fixed: undefined }))];
export default function RowGroupingDemo() {
    const [expandedGroupIds, setExpandedGroupIds] = useState<Set<Key>>();
    return <DemoFrame title="区域人员配置" rows={rows.length} columns={columns.length}
        hint="按大区 → 部门分组。分组标题显示人数，展开后核对具体岗位与项目归属。"
        toolbar={<Button onClick={() => setExpandedGroupIds(new Set())}>收起所有分组</Button>}>
        {(width, height) => <Table aria-label="按大区和部门分组的人员配置" width={width} height={height} rows={rows} columns={columns}
            groupBy={["$.region", "$.department"]} defaultExpandAll
            expandedGroupIds={expandedGroupIds} onExpandedGroupIdsChange={setExpandedGroupIds} />}
    </DemoFrame>;
}
