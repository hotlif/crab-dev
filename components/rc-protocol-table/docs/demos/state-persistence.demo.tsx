export const meta = {
    title: "状态持久化",
    description: "initialState 在首次加载时恢复列顺序、显隐、宽度、固定等属性；onStateChange 在任何列属性或过滤条件变更时触发，可将快照写入 localStorage。刷新页面后所有调整会被还原。",
};

import { useRef, useState } from "react";
import { css } from "@crab-dev/css";
import ProtocolTable from "../../src/table.js";
import type { DataTypeLoader, ProtocolColumnType, ProtocolTableState } from "../../src/types.js";
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

const STORAGE_KEY = "rc-protocol-table-demo-state";

function loadState(): ProtocolTableState | undefined {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? (JSON.parse(raw) as ProtocolTableState) : undefined;
    } catch {
        return undefined;
    }
}

function saveState(state: ProtocolTableState) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch { /* ignore */ }
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

const TYPE_LOADERS: DataTypeLoader[] = [
    { name: "text",   render: undefined, editRender: undefined, filterEditor: undefined },
    { name: "number", render: undefined, editRender: undefined, filterEditor: undefined },
];

const DEPARTMENTS = ["前端", "后端", "产品", "设计", "测试", "运维"];
const JOB_TITLES  = ["工程师", "高级工程师", "技术专家", "架构师", "经理", "总监"];
const CITIES      = ["北京", "上海", "广州", "深圳", "杭州", "成都"];
const NAMES       = ["王明", "李婷", "赵阳", "陈晨", "孙浩", "周楠", "吴迪", "郑宁", "冯雪", "蒋凡"];

const ALL_ROWS: EmployeeRow[] = Array.from({ length: 100 }, (_, i) => ({
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

const fetchData = (): Promise<EmployeeRow[]> =>
    new Promise((resolve) => setTimeout(() => resolve(ALL_ROWS), 200));

const containerStyle = css`
    width: 100%;
    height: 420px;
`;

const toolbarStyle = css`
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 8px 0 6px;
    font-size: 12px;
    color: oklch(50% 0 0);
`;

const resetBtnStyle = css`
    padding: 0 10px;
    height: 24px;
    font-size: 12px;
    border: 1px solid var(--crab-rc-table-border-color, #ddd);
    border-radius: 4px;
    background: transparent;
    cursor: pointer;
    color: oklch(40% 0.12 25);
    &:hover { background-color: oklch(95% 0.04 25); }
`;

const StatePersistenceDemo = () => {
    // 从 localStorage 读取初始状态（仅首次渲染时执行）
    const initialStateRef = useRef(loadState());
    const [saveCount, setSaveCount] = useState(0);

    const handleStateChange = (state: ProtocolTableState) => {
        saveState(state);
        setSaveCount(c => c + 1);
    };

    const handleReset = () => {
        localStorage.removeItem(STORAGE_KEY);
        // 重新挂载组件以应用空初始状态（开发演示用途）
        window.location.reload();
    };

    return (
        <div>
            <div className={toolbarStyle}>
                <span>
                    状态已保存 <strong>{saveCount}</strong> 次到 localStorage（key: <code>{STORAGE_KEY}</code>）
                </span>
                <button type="button" className={resetBtnStyle} onClick={handleReset}>
                    清除并刷新
                </button>
            </div>
            <ProtocolTable<EmployeeRow>
                className={containerStyle}
                fetchColumns={fetchColumns}
                fetchData={fetchData}
                typeLoaders={TYPE_LOADERS}
                sideBar
                defaultSideBarOpen
                resizable
                initialState={initialStateRef.current}
                onStateChange={handleStateChange}
            />
        </div>
    );
};

export default StatePersistenceDemo;
