export const meta = {
    title: "基础用法",
    description: "通过 fetchData 与 fetchColumns 异步加载数据和列定义，ProtocolTable 会自动适应容器宽高。",
};

import { css } from "@crab-dev/css";
import ProtocolTable from "../../src/table.js";
import type { ProtocolColumnType } from "../../src/types.js";
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
    { name: "$.employeeNo", title: "工号",    dataType: "text",   width: 140, fixed: "left" },
    { name: "$.name",       title: "姓名",    dataType: "text",   width: 120 },
    { name: "$.department", title: "部门",    dataType: "text",   width: 140 },
    { name: "$.jobTitle",   title: "职位",    dataType: "text",   width: 180 },
    { name: "$.city",       title: "城市",    dataType: "text",   width: 120 },
    { name: "$.age",        title: "年龄",    dataType: "number", width: 80,  align: "right" },
    { name: "$.salary",     title: "月薪（元）", dataType: "number", width: 140, align: "right" },
    { name: "$.hireDate",   title: "入职日期", dataType: "text",   width: 140 },
];

const DEPARTMENTS = ["前端", "后端", "产品", "设计", "测试", "运维"];
const JOB_TITLES  = ["工程师", "高级工程师", "技术专家", "架构师", "经理", "总监"];
const CITIES      = ["北京", "上海", "广州", "深圳", "杭州", "成都"];
const NAMES       = ["王明", "李婷", "赵阳", "陈晨", "孙浩", "周楠", "吴迪", "郑宁", "冯雪", "蒋凡"];

const ROWS: EmployeeRow[] = Array.from({ length: 500 }, (_, index) => ({
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

const fetchData = (): Promise<EmployeeRow[]> =>
    new Promise((resolve) => setTimeout(() => resolve(ROWS), 400));

const containerStyle = css`
    width: 100%;
    height: 360px;
`;

const BasicDemo = () => {
    return (
        <ProtocolTable<EmployeeRow>
            className={containerStyle}
            fetchColumns={fetchColumns}
            fetchData={fetchData}
        />
    );
};

export default BasicDemo;
