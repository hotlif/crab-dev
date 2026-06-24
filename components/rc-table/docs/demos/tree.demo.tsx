/**
 * title = "树形数据"
 * description = "通过 `treeData` 和 `getChildRows` 展示层级关系，点击行首箭头可展开或收起子行。"
 */

import { type Key, useState } from "react";
import Table from "../../src/index.js";
import type { Row } from "../../src/types.js";

interface OrgRow extends Row {
    dataRef: {
        name: string
        type: string
        headcount?: number
        location?: string
    }
    children?: OrgRow[]
}

const orgData: OrgRow[] = [
    {
        id: "tech",
        dataRef: { name: "技术部", type: "部门", headcount: 85, location: "北京" },
        children: [
            {
                id: "tech-fe",
                dataRef: { name: "前端组", type: "小组", headcount: 22, location: "北京" },
                children: [
                    { id: "tech-fe-1", dataRef: { name: "张伟", type: "员工", location: "北京" } },
                    { id: "tech-fe-2", dataRef: { name: "李芳", type: "员工", location: "北京" } },
                    { id: "tech-fe-3", dataRef: { name: "王磊", type: "员工", location: "上海" } },
                ],
            },
            {
                id: "tech-be",
                dataRef: { name: "后端组", type: "小组", headcount: 35, location: "北京" },
                children: [
                    { id: "tech-be-1", dataRef: { name: "刘洋", type: "员工", location: "北京" } },
                    { id: "tech-be-2", dataRef: { name: "陈静", type: "员工", location: "北京" } },
                ],
            },
            {
                id: "tech-infra",
                dataRef: { name: "基础设施组", type: "小组", headcount: 28, location: "北京" },
                children: [
                    { id: "tech-infra-1", dataRef: { name: "赵强", type: "员工", location: "深圳" } },
                ],
            },
        ],
    },
    {
        id: "product",
        dataRef: { name: "产品部", type: "部门", headcount: 40, location: "上海" },
        children: [
            {
                id: "product-design",
                dataRef: { name: "设计组", type: "小组", headcount: 15, location: "上海" },
                children: [
                    { id: "product-design-1", dataRef: { name: "孙丽", type: "员工", location: "上海" } },
                    { id: "product-design-2", dataRef: { name: "周平", type: "员工", location: "上海" } },
                ],
            },
            {
                id: "product-pm",
                dataRef: { name: "产品管理", type: "小组", headcount: 25, location: "上海" },
                children: [
                    { id: "product-pm-1", dataRef: { name: "吴雪", type: "员工", location: "上海" } },
                ],
            },
        ],
    },
    {
        id: "ops",
        dataRef: { name: "运营部", type: "部门", headcount: 30, location: "广州" },
        children: [
            { id: "ops-1", dataRef: { name: "郑明", type: "员工", location: "广州" } },
            { id: "ops-2", dataRef: { name: "冯华", type: "员工", location: "广州" } },
        ],
    },
];

const columns = [
    { name: "$.name", title: "名称", width: 180 },
    { name: "$.type", title: "类型", width: 100 },
    { name: "$.headcount", title: "人数", width: 80, align: "right" as const },
    { name: "$.location", title: "所在地" },
];

const getChildRows = (row: OrgRow) => row.children;

const TreeDemo = () => {
    const [expandedRowIds, setExpandedRowIds] = useState<Set<Key>>(
        new Set(["tech", "product"])
    );

    return (
        <Table<OrgRow>
            width={560}
            height={420}
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
