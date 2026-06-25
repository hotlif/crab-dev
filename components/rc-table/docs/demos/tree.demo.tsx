/**
 * title = "树形数据"
 * description = "通过 `treeData` 和 `getChildRows` 展示层级关系，点击行首箭头可展开或收起子行。"
 */

import { type Key, useState } from "react";
import { fakerZH_CN as faker } from "@faker-js/faker";
import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/types.js";
import { CITIES, JOB_TITLES } from "./_mock.js";

interface OrgRow extends Row {
    dataRef: {
        name: string
        type: string
        jobTitle?: string
        headcount?: number
        location?: string
    }
    children?: OrgRow[]
}

faker.seed(20260620);

let uid = 0;

const makeEmployee = (): OrgRow => ({
    id: `emp-${uid += 1}`,
    dataRef: {
        name: faker.person.fullName(),
        type: "员工",
        jobTitle: faker.helpers.arrayElement(JOB_TITLES),
        location: faker.helpers.arrayElement(CITIES),
    },
});

const makeGroup = (name: string): OrgRow => {
    const members = Array.from({ length: faker.number.int({ min: 3, max: 6 }) }, makeEmployee);
    return {
        id: `grp-${uid += 1}`,
        dataRef: {
            name,
            type: "小组",
            headcount: members.length,
            location: members[0].dataRef.location,
        },
        children: members,
    };
};

const makeDept = (deptId: string, name: string, groupNames: string[]): OrgRow => {
    const groups = groupNames.map(makeGroup);
    return {
        id: deptId,
        dataRef: {
            name,
            type: "部门",
            headcount: groups.reduce((acc, group) => acc + (group.dataRef.headcount ?? 0), 0),
            location: faker.helpers.arrayElement(CITIES),
        },
        children: groups,
    };
};

const orgData: OrgRow[] = [
    makeDept("dept-tech", "技术部", ["前端组", "后端组", "测试组", "基础设施组"]),
    makeDept("dept-product", "产品部", ["产品策划组", "用户研究组"]),
    makeDept("dept-design", "设计部", ["视觉设计组", "交互设计组"]),
    makeDept("dept-market", "市场部", ["品牌组", "增长组", "活动组"]),
    makeDept("dept-ops", "运营部", ["内容运营组", "数据运营组"]),
];

const columns: ColumnType<OrgRow>[] = [
    { name: "$.name", title: "名称", width: 200 },
    { name: "$.type", title: "类型", width: 100 },
    { name: "$.jobTitle", title: "职位", width: 150 },
    { name: "$.headcount", title: "人数", width: 80, align: "right" as const },
    { name: "$.location", title: "所在地" },
];

const getChildRows = (row: OrgRow) => row.children;

const TreeDemo = () => {
    const [expandedRowIds, setExpandedRowIds] = useState<Set<Key>>(
        new Set(["dept-tech", "dept-product"])
    );

    return (
        <Table<OrgRow>
            width={680}
            height={460}
            rows={orgData}
            columns={columns}
            treeData
            getChildRows={getChildRows}
            expandedRowIds={expandedRowIds}
            onExpandedRowIdsChange={setExpandedRowIds}
        />
    );
};

export default TreeDemo;
