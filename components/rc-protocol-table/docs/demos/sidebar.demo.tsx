export const meta = {
    title: "侧边栏（列 / 过滤器）",
    description: "sideBar 在右侧展示工具栏：点击「列」图标可切换列的显隐、拖拽改变顺序、固定到左/右侧、开关排序；点击「过滤器」图标进入过滤条件面板。",
};

import { useState, useEffect } from "react";
import { css } from "@crab-dev/css";
import ProtocolTable from "../../src/table.js";
import type { DataTypeLoader, ProtocolColumnType } from "../../src/types.js";
import type { Row } from "@crab-dev/rc-table";

interface EmployeeRow extends Row {
    dataRef: {
        employeeNo: string;
        name: string;
        department: string;
        jobTitle: string;
        city: string;
        age: number;
        salary: number;
        hireDate: string;
    };
}

const COLUMNS: ProtocolColumnType[] = [
    { name: "$.employeeNo", title: "工号",       dataType: "text",   width: 140, fixed: "left" },
    { name: "$.name",       title: "姓名",       dataType: "text",   width: 120 },
    { name: "$.department", title: "部门",       dataType: "text",   width: 140 },
    { name: "$.jobTitle",   title: "职位",       dataType: "text",   width: 180 },
    { name: "$.city",       title: "城市",       dataType: "text",   width: 120 },
    { name: "$.age",        title: "年龄",       dataType: "number", width: 80,  align: "right" },
    { name: "$.salary",     title: "月薪（元）",  dataType: "number", width: 140, align: "right" },
    { name: "$.hireDate",   title: "入职日期",    dataType: "text",   width: 140 },
];

const filterInputStyle = css`
    width: 100%; height: 100%; box-sizing: border-box;
    border: none; outline: none; background: transparent;
    padding: 0 6px; font-size: 12px;
    &::placeholder { color: #bbb; }
`;

const TextFilter = ({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) => {
    const [local, setLocal] = useState(value);
    useEffect(() => { setLocal(value); }, [value]);
    return (
        <input className={filterInputStyle} type="text" value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onValueChange(local); }}
            placeholder="回车确认…" />
    );
};

const NumberFilter = ({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) => {
    const [local, setLocal] = useState(value);
    useEffect(() => { setLocal(value); }, [value]);
    return (
        <input className={filterInputStyle} type="number" value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onValueChange(local); }}
            placeholder="回车确认…" />
    );
};

const TYPE_LOADERS: DataTypeLoader[] = [
    {
        name: "text",
        render: undefined,
        editRender: undefined,
        filterEditor: ({ value, onValueChange }) => <TextFilter value={value} onValueChange={onValueChange} />,
    },
    {
        name: "number",
        render: undefined,
        editRender: undefined,
        filterEditor: ({ value, onValueChange }) => <NumberFilter value={value} onValueChange={onValueChange} />,
    },
];

const DEPARTMENTS = ["前端", "后端", "产品", "设计", "测试", "运维"];
const JOB_TITLES  = ["工程师", "高级工程师", "技术专家", "架构师", "经理", "总监"];
const CITIES      = ["北京", "上海", "广州", "深圳", "杭州", "成都"];
const NAMES       = ["王明", "李婷", "赵阳", "陈晨", "孙浩", "周楠", "吴迪", "郑宁", "冯雪", "蒋凡"];

const ALL_ROWS: EmployeeRow[] = Array.from({ length: 200 }, (_, i) => ({
    id: String(i + 1),
    dataRef: {
        employeeNo: `EMP-${String(i + 1).padStart(4, "0")}`,
        name:       `${NAMES[i % NAMES.length]}${String(i + 1).padStart(2, "0")}`,
        department: DEPARTMENTS[i % DEPARTMENTS.length],
        jobTitle:   JOB_TITLES[i % JOB_TITLES.length],
        city:       CITIES[i % CITIES.length],
        age:        22 + (i % 20),
        salary:     10000 + (i % 40) * 1000,
        hireDate:   `202${i % 4}-${String((i % 12) + 1).padStart(2, "0")}-${String((i % 28) + 1).padStart(2, "0")}`,
    },
}));

const fetchColumns = (): Promise<ProtocolColumnType[]> =>
    new Promise((resolve) => setTimeout(() => resolve(COLUMNS), 200));

const fetchData = (filters: Record<string, string>): Promise<EmployeeRow[]> =>
    new Promise((resolve) =>
        setTimeout(() => {
            const result = ALL_ROWS.filter((row) =>
                Object.entries(filters).every(([col, kw]) => {
                    if (!kw) return true;
                    const key = col.replace(/^\$\./, "") as keyof EmployeeRow["dataRef"];
                    return String(row.dataRef[key] ?? "").toLowerCase().includes(kw.toLowerCase());
                })
            );
            resolve(result);
        }, 200)
    );

const containerStyle = css`
    width: 100%;
    height: 440px;
`;

const SidebarDemo = () => (
    <ProtocolTable<EmployeeRow>
        className={containerStyle}
        fetchColumns={fetchColumns}
        fetchData={fetchData}
        typeLoaders={TYPE_LOADERS}
        sideBar
        defaultSideBarOpen
        filterBar
        resizable
    />
);

export default SidebarDemo;
