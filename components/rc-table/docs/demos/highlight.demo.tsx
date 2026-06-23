/**
 * title = "关键字高亮"
 * description = "通过 highlightKeyword 高亮单元格中的匹配文本，activeMatchIndex 控制当前活动匹配（橙色）并同时滚动到对应行列，效果类似浏览器 Ctrl+F。默认 render 自动处理；自定义 render 可通过 keyword 参数配合 highlightText 工具函数手动处理。"
 */

import React, { useEffect, useMemo, useState } from "react";
import Table, { highlightText } from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";

interface DemoRow extends Row {
    dataRef: {
        name: string
        gender: number
        department: string
        city: string
        jobTitle: string
        email: string
        salary: number
        project: string
        status: string
        manager: string
        phone: string
    }
}

const names = ["张伟", "李娜", "王芳", "赵磊", "陈静", "刘洋", "周鑫", "吴丽", "孙鹏", "徐敏", "朱辉", "胡博"];
const genders = [1, 0, 0, 1, 0, 1, 1, 0, 1, 0, 1, 1];
const departments = ["研发部", "产品部", "销售部", "人事部", "财务部", "运维部"];
const cities = ["北京", "上海", "深圳", "广州", "杭州", "成都"];
const titles = ["高级工程师", "产品经理", "前端工程师", "销售总监", "HR 经理", "架构师", "财务总监", "UX 设计师", "测试工程师", "运维工程师", "后端工程师"];
const projects = ["主数据平台", "经营看板", "供应链优化", "门店数字化", "风控中台", "物流协同", "能源巡检", "医药追溯"];
const statuses = ["进行中", "已完成", "已暂停", "待启动"];
const managers = ["王建国", "李晓明", "张华", "陈伟", "刘芳"];

const rawRows: DemoRow[] = Array.from({ length: 80 }, (_, i) => {
    const name = names[i % names.length];
    return {
        id: String(i + 1),
        dataRef: {
            name,
            gender: genders[i % genders.length],
            department: departments[i % departments.length],
            city: cities[i % cities.length],
            jobTitle: titles[i % titles.length],
            email: `${name}${i + 1}@example.com`,
            salary: 18000 + (i * 317) % 22000,
            project: projects[i % projects.length],
            status: statuses[i % statuses.length],
            manager: managers[i % managers.length],
            phone: `1${3 + (i % 7)}${String(100000000 + i * 9973).slice(0, 9)}`,
        },
    };
});

const HighlightDemo = () => {
    const [keyword, setKeyword] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const [matchCount, setMatchCount] = useState(0);

    useEffect(() => {
        setActiveIdx(0);
    }, [keyword]);

    const columns = useMemo((): ColumnType<DemoRow>[] => [
        { title: "姓名", name: "name", width: 90, fixed: "left" },
        { title: "性别", name: "gender", width: 70, getSearchText: (row) => row.dataRef.gender === 1 ? "男" : "女", render: ({ row, keyword: kw, activeOccurrenceInCell }) => highlightText(row.dataRef.gender === 1 ? "男" : "女", kw ?? "", activeOccurrenceInCell) },
        { title: "部门", name: "department", width: 110 },
        { title: "城市", name: "city", width: 90 },
        { title: "职位", name: "jobTitle", width: 150 },
        {
            title: "邮箱（自定义）",
            name: "email",
            width: 210,
            render: ({ row, keyword: kw, activeOccurrenceInCell, originalElement }) => {
                if (!kw) return originalElement;
                return (
                    <div style={{ padding: "0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", color: "#1976d2", width: "100%", boxSizing: "border-box" }}>
                        {highlightText(row.dataRef.email, kw, activeOccurrenceInCell)}
                    </div>
                );
            },
        },
        { title: "薪资", name: "salary", width: 100, align: "right" },
        { title: "项目", name: "project", width: 140 },
        { title: "状态", name: "status", width: 90 },
        { title: "负责人", name: "manager", width: 90 },
        { title: "电话", name: "phone", width: 130 },
    ], []);

    const canNav = matchCount > 0 && keyword.trim() !== "";
    const goNext = () => setActiveIdx(i => (i + 1) % matchCount);
    const goPrev = () => setActiveIdx(i => (i - 1 + matchCount) % matchCount);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") { if (e.shiftKey) goPrev(); else goNext(); }
    };

    const btnStyle = (disabled: boolean): React.CSSProperties => ({
        width: 28, height: 28, border: "1px solid #ddd", borderRadius: 4,
        background: disabled ? "#f5f5f5" : "#fff", cursor: disabled ? "not-allowed" : "pointer",
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        fontSize: 14, color: disabled ? "#bbb" : "#333", flexShrink: 0,
    });

    return (
        <div>
            <div style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                <input
                    value={keyword}
                    placeholder="输入关键字（Enter 跳转下一个）"
                    onChange={(e) => setKeyword(e.target.value)}
                    onKeyDown={handleKeyDown}
                    style={{
                        width: 230, height: 30, boxSizing: "border-box",
                        border: "1px solid #ddd", borderRadius: 4,
                        paddingInline: 8, fontSize: 13, outline: "none",
                    }}
                />
                <span style={{ fontSize: 12, color: "#888", minWidth: 70 }}>
                    {keyword.trim() === "" ? "" : matchCount === 0 ? "无匹配" : `${activeIdx + 1} / ${matchCount}`}
                </span>
                <button style={btnStyle(!canNav)} disabled={!canNav} onClick={goPrev} title="上一个（Shift+Enter）">↑</button>
                <button style={btnStyle(!canNav)} disabled={!canNav} onClick={goNext} title="下一个（Enter）">↓</button>
            </div>
            <Table
                width={1120}
                height={400}
                columns={columns}
                rows={rawRows}
                highlightKeyword={keyword}
                activeMatchIndex={canNav ? activeIdx : undefined}
                onMatchCountChange={setMatchCount}
            />
        </div>
    );
};

export default HighlightDemo;
