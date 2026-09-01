export const meta = {
    title: "服务端分页",
    description: "设置 pagination 属性后，fetchData 会接收 page 与 pageSize 参数，由服务端完成数据切片并返回 { rows, total }，组件根据 total 渲染分页器。分页栏末尾始终显示刷新按钮；若设置 autoRefreshInterval，还会按指定间隔自动重拉当前页数据。",
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
    { name: "$.employeeNo", title: "工号",       dataType: "text",   width: 140, fixed: "left", align: ["center", "left"] },
    { name: "$.name",       title: "姓名",       dataType: "text",   width: 120, align: ["center", "left"] },
    { name: "$.department", title: "部门",       dataType: "text",   width: 140, align: ["center", "left"] },
    { name: "$.jobTitle",   title: "职位",       dataType: "text",   width: 180, align: ["center", "left"] },
    { name: "$.city",       title: "城市",       dataType: "text",   width: 120, align: ["center", "left"] },
    { name: "$.age",        title: "年龄",       dataType: "number", width: 80,  align: ["center", "right"] },
    { name: "$.salary",     title: "月薪（元）",  dataType: "number", width: 140, align: ["center", "right"] },
    { name: "$.hireDate",   title: "入职日期",    dataType: "text",   width: 140, align: ["center", "left"] },
];

const filterInputStyle = css`
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: none;
    outline: none;
    background: transparent;
    padding: 0 6px;
    font-size: 12px;
    &::placeholder { color: #bbb; }
`;

const TextFilterEditor = ({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) => {
    const [local, setLocal] = useState(value);
    useEffect(() => { setLocal(value); }, [value]);
    return (
        <input
            className={filterInputStyle}
            type="text"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onValueChange(local); }}
            placeholder="搜索…"
        />
    );
};

const NumberFilterEditor = ({ value, onValueChange }: { value: string; onValueChange: (v: string) => void }) => {
    const [local, setLocal] = useState(value);
    useEffect(() => { setLocal(value); }, [value]);
    return (
        <input
            className={filterInputStyle}
            type="number"
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") onValueChange(local); }}
            placeholder="筛选…"
        />
    );
};

const TYPE_LOADERS: DataTypeLoader[] = [
    {
        name: "text",
        render: undefined,
        editRender: undefined,
        filterEditor: ({ value, onValueChange }) => (
            <TextFilterEditor value={value} onValueChange={onValueChange} />
        ),
    },
    {
        name: "number",
        render: undefined,
        editRender: undefined,
        filterEditor: ({ value, onValueChange }) => (
            <NumberFilterEditor value={value} onValueChange={onValueChange} />
        ),
    },
];

const DEPARTMENTS = ["前端", "后端", "产品", "设计", "测试", "运维"];
const JOB_TITLES  = ["工程师", "高级工程师", "技术专家", "架构师", "经理", "总监"];
const CITIES      = ["北京", "上海", "广州", "深圳", "杭州", "成都"];
const NAMES       = ["王明", "李婷", "赵阳", "陈晨", "孙浩", "周楠", "吴迪", "郑宁", "冯雪", "蒋凡"];

const ALL_ROWS: EmployeeRow[] = Array.from({ length: 500 }, (_, index) => ({
    id: String(index + 1),
    dataRef: {
        employeeNo: `EMP-${String(index + 1).padStart(4, "0")}`,
        name:       `${NAMES[index % NAMES.length]}${String(index + 1).padStart(2, "0")}`,
        department: DEPARTMENTS[index % DEPARTMENTS.length],
        jobTitle:   JOB_TITLES[index % JOB_TITLES.length],
        city:       CITIES[index % CITIES.length],
        age:        22 + (index % 20),
        salary:     10000 + (index % 40) * 1000,
        hireDate:   `202${index % 4}-${String((index % 12) + 1).padStart(2, "0")}-${String((index % 28) + 1).padStart(2, "0")}`,
    },
}));

const fetchColumns = (): Promise<ProtocolColumnType[]> =>
    new Promise((resolve) => setTimeout(() => resolve(COLUMNS), 200));

/** 模拟服务端分页接口：接收 page/pageSize/filters，返回对应切片与总条数 */
const fetchData = (
    page: number,
    pageSize: number,
    filters: Record<string, string>
): Promise<{ rows: EmployeeRow[]; total: number }> =>
    new Promise((resolve) =>
        setTimeout(() => {
            console.log("fetchData called with", { page, pageSize, filters });
            const filtered = ALL_ROWS.filter((row) =>
                Object.entries(filters).every(([colName, keyword]) => {
                    if (!keyword) return true;
                    const key = colName.replace(/^\$\./, "") as keyof EmployeeRow["dataRef"];
                    const val = String(row.dataRef[key] ?? "");
                    return val.toLowerCase().includes(keyword.toLowerCase());
                })
            );
            const start = (page - 1) * pageSize;
            resolve({
                rows: filtered.slice(start, start + pageSize),
                total: filtered.length,
            });
        }, 300)
    );

const containerStyle = css`
    width: 100%;
    height: 400px;
`;

const PaginationDemo = () => {
    return (
        <ProtocolTable<EmployeeRow>
            className={containerStyle}
            fetchColumns={fetchColumns}
            fetchData={fetchData}
            typeLoaders={TYPE_LOADERS}
            sideBar
            pagination={{
                defaultPageSize: 20,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: true,
                size: "small",
            }}
        />
    );
};

export default PaginationDemo;
