/**
 * title = "关键字高亮"
 * description = "通过 highlightKeyword 高亮单元格中的匹配文本，activeMatchIndex 控制当前活动匹配（橙色）并同时滚动到对应行列，效果类似浏览器 Ctrl+F。默认 render 自动处理；自定义 render 可通过 keyword 参数配合 highlightText 工具函数手动处理。"
 */

import React, { useEffect, useMemo, useState } from "react";
import Table, { highlightText } from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";
import { makeEmployees, type Employee } from "./_mock.js";

interface DemoRow extends Row {
    dataRef: Employee
}

const rawRows: DemoRow[] = makeEmployees(80, 20260615).map((employee, index) => ({
    id: String(index + 1),
    dataRef: employee,
}));

const HighlightDemo = () => {
    const [keyword, setKeyword] = useState("");
    const [activeIdx, setActiveIdx] = useState(0);
    const [matchCount, setMatchCount] = useState(0);

    useEffect(() => {
        setActiveIdx(0);
    }, [keyword]);

    const columns = useMemo((): ColumnType<DemoRow>[] => [
        { title: "姓名", name: "name", width: 90, fixed: "left" },
        { title: "性别", name: "gender", width: 70, align: "center" },
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
        {
            title: "薪资（getSearchText）",
            name: "salary",
            width: 150,
            align: "right",
            getSearchText: (row) => `¥${row.dataRef.salary.toLocaleString()}`,
            render: ({ row, keyword: kw, activeOccurrenceInCell }) =>
                highlightText(`¥${row.dataRef.salary.toLocaleString()}`, kw ?? "", activeOccurrenceInCell),
        },
        { title: "项目", name: "project", width: 140 },
        { title: "状态", name: "status", width: 90 },
        { title: "公司", name: "company", width: 150 },
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
