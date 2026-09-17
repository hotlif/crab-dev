import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Button, { type ButtonProps } from "@crab-dev/rc-button";

const stackStyle = css`display: grid; gap: ${token.space["group-gap"]}; min-width: 0;`;
const sectionStyle = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    padding-bottom: ${token.space["section-gap"]};
    border-bottom: 1px solid ${token.color.border.subtle};
`;
const rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space["component-gap"]};`;
const noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.body};`;
const sizes = [
    { value: "small", label: "小号", height: "24px", description: "紧凑工具栏、表格内操作。" },
    { value: "middle", label: "中号（默认）", height: "32px", description: "普通表单和页面操作。" },
    { value: "large", label: "大号", height: "40px", description: "需要更醒目的独立操作。" },
] satisfies Array<{ value: NonNullable<ButtonProps["size"]>; label: string; height: string; description: string }>;
const appearances = ["primary", "subtle", "dashed", "text", "link", "danger"] satisfies Array<NonNullable<ButtonProps["appearance"]>>;

export default function Example() {
    const [message, setMessage] = useState("同一列外观一致，横向对比不同外观，纵向对比尺寸。");
    return (
        <div className={stackStyle}>
            {sizes.map(size => (
                <section key={size.value} className={sectionStyle} aria-label={`${size.value} 尺寸对照`}>
                    <strong>{size.label} · <code>{size.value}</code> · {size.height}</strong>
                    <p className={noteStyle}>{size.description}</p>
                    <div className={rowStyle}>
                        {appearances.map(appearance => (
                            <Button key={appearance} size={size.value} appearance={appearance}
                                onClick={() => setMessage(`当前体验：size="${size.value}"，appearance="${appearance}"。`)}>
                                {appearance}
                            </Button>
                        ))}
                    </div>
                </section>
            ))}
            <p className={noteStyle}>以上为默认鼠标环境下的高度；触控环境会扩展命中区域。</p>
            <output className={noteStyle} aria-live="polite">{message}</output>
        </div>
    );
}
