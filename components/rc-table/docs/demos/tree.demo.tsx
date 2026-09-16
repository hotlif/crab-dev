export const meta = {
    title: "树形数据 · 组织与人员编制",
    description: "公司 → 部门 → 员工三级组织，超过 1,900 个节点、18 列；人数和薪酬逐层汇总。",
};
import { useState, type Key } from "react";
import Button from "@crab-dev/rc-button";
import Table from "../../src/index.js";
import type { ColumnType } from "../../src/types.js";
import { makeOrganization, countOrganization, type OrganizationRow } from "./_scenarios.js";
import { DemoFrame, field, amount } from "./_shared.js";
const rows = makeOrganization();
const branches = rows.flatMap(row => [row.id, ...(row.children ?? []).map(child => child.id)]);
const columns: ColumnType<OrganizationRow>[] = [
    field("name", "组织 / 员工", 360), field("type", "节点类型", 100), field("code", "组织 / 人员编码", 170),
    field("department", "部门"), field("jobTitle", "岗位", 160), field("position", "职级", 110),
    field("manager", "主管", 110), field("city", "城市", 100), field("region", "大区", 100),
    field("status", "状态", 110), field("employeeNo", "工号", 160), field("email", "工作邮箱", 300),
    field("project", "所属项目", 220), field("joinDate", "入职日期"), field("contractEnd", "合同到期日"),
    { ...field<OrganizationRow>("headcount", "在册人数", 110), align: "right" },
    amount("payroll", "月基本工资合计", row => row.dataRef.payroll),
    amount("annualCost", "年度总薪酬合计", row => row.dataRef.annualCost),
];
export default function TreeDemo() {
    const [expanded, setExpanded] = useState<Set<Key>>(new Set(branches));
    return <DemoFrame title="组织架构与人员编制" rows={countOrganization(rows)} columns={columns.length}
        hint="公司和部门汇总下属在职、试用人员；离职人员不计入当前编制。展开查看岗位、主管和合同。"
        toolbar={<><Button onClick={() => setExpanded(new Set(branches))}>展开全部</Button>
            <Button onClick={() => setExpanded(new Set())}>收起全部</Button></>}>
        {(width, height) => <Table aria-label="组织架构与人员编制树形表格" width={width} height={height} rows={rows} columns={columns}
            treeData getChildRows={row => row.children} treeColumn="$.name"
            expandedRowIds={expanded} onExpandedRowIdsChange={setExpanded} />}
    </DemoFrame>;
}
