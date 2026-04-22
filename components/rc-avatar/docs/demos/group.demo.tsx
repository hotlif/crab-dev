/**
 * title = "头像组"
 * description = "使用 `AvatarGroup` 将多个头像水平叠放展示。`max` 限制显示数量，超出部分折叠为 `+N`；首个头像叠在最顶层，悬停会轻微抬起以便辨识。支持 `spacing` 调整重叠、`onExtraClick` 让 `+N` 可交互、`renderExtra` 自定义折叠内容。"
 */

import { css } from "@linaria/core";
import { useState } from "react";
import Avatar, { AvatarGroup } from "../../src/index.js";

const wrapStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
`;

const sectionStyle = css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

const labelStyle = css`
    font-size: 0.75rem;
    color: var(--token-semantic-color-text-secondary);
    letter-spacing: 0.02em;
`;

const toolbarStyle = css`
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
`;

const GroupDemo = () => {
    const [expanded, setExpanded] = useState(false);

    return (
        <div className={wrapStyle}>
            <section className={sectionStyle}>
                <span className={labelStyle}>基础：叠放 & 悬停抬起</span>
                <AvatarGroup>
                    <Avatar variant="primary" aria-label="Chen Di">CD</Avatar>
                    <Avatar variant="success" aria-label="Ouyang Ping">OP</Avatar>
                    <Avatar variant="warning" aria-label="Li Ming">LM</Avatar>
                    <Avatar variant="error" aria-label="Xia Zhe">XZ</Avatar>
                </AvatarGroup>
            </section>

            <section className={sectionStyle}>
                <span className={labelStyle}>折叠：max={3}，第 4 人起折为 +N（悬停查看名单）</span>
                <AvatarGroup max={3}>
                    <Avatar variant="primary" aria-label="Alice">A</Avatar>
                    <Avatar variant="success" aria-label="Bob">B</Avatar>
                    <Avatar variant="warning" aria-label="Carol">C</Avatar>
                    <Avatar variant="error" aria-label="Dan">D</Avatar>
                    <Avatar aria-label="Eve">E</Avatar>
                    <Avatar variant="primary" aria-label="Finn">F</Avatar>
                </AvatarGroup>
            </section>

            <section className={sectionStyle}>
                <span className={labelStyle}>可交互折叠：点击 +N 展开 / 收起</span>
                <AvatarGroup
                    max={expanded ? undefined : 3}
                    onExtraClick={() => setExpanded((prev) => !prev)}
                >
                    <Avatar variant="primary" aria-label="Alice">A</Avatar>
                    <Avatar variant="success" aria-label="Bob">B</Avatar>
                    <Avatar variant="warning" aria-label="Carol">C</Avatar>
                    <Avatar variant="error" aria-label="Dan">D</Avatar>
                    <Avatar aria-label="Eve">E</Avatar>
                    <Avatar variant="primary" aria-label="Finn">F</Avatar>
                </AvatarGroup>
            </section>

            <section className={sectionStyle}>
                <span className={labelStyle}>自定义重叠与形状</span>
                <div className={toolbarStyle}>
                    <AvatarGroup shape="square" size="small" max={3} spacing={-6}>
                        <Avatar aria-label="SQ">sq</Avatar>
                        <Avatar variant="primary" aria-label="AR">ar</Avatar>
                        <Avatar variant="success" aria-label="E1">e1</Avatar>
                        <Avatar variant="warning" aria-label="E2">e2</Avatar>
                    </AvatarGroup>
                    <AvatarGroup size="large" spacing={-14}>
                        <Avatar variant="primary" aria-label="K">K</Avatar>
                        <Avatar variant="success" aria-label="L">L</Avatar>
                        <Avatar variant="warning" aria-label="M">M</Avatar>
                    </AvatarGroup>
                </div>
            </section>

            <section className={sectionStyle}>
                <span className={labelStyle}>自定义 +N 渲染</span>
                <AvatarGroup
                    max={2}
                    renderExtra={(hidden) => `还有 ${hidden} 位`}
                >
                    <Avatar variant="primary" aria-label="A">A</Avatar>
                    <Avatar variant="success" aria-label="B">B</Avatar>
                    <Avatar variant="warning" aria-label="C">C</Avatar>
                    <Avatar variant="error" aria-label="D">D</Avatar>
                </AvatarGroup>
            </section>
        </div>
    );
};

export default GroupDemo;

