export const meta = {
    title: "外观设置",
    description: "并排展示六种外观、属性值和适用场景；点击按钮查看反馈。",
};
import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Button, { type ButtonProps } from "../../src/index.js";


const stackStyle = css`display: grid; gap: ${token.space["section-gap"]}; min-width: 0;`;
const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.space["group-gap"]} * 9)), 1fr));
    gap: ${token.space["section-gap"]};
`;
const cardStyle = css`
    display: grid;
    grid-template-rows: auto 1fr auto;
    justify-items: start;
    gap: ${token.space["component-gap"]};
    min-width: 0;
    padding: ${token.space["section-gap"]};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.lg};
    background: ${token.color.background.surface};
`;
const noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.body};`;
const feedbackStyle = css`
    padding: ${token.space["component-gap"]} ${token.space["control-padding-x"]};
    border-radius: ${token.radius.md};
    background: ${token.color.background.sunken};
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.body};
`;
const appearances = [
    { value: "primary", label: "主要按钮", hint: "高强调度，用于保存、提交等主操作。" },
    { value: "subtle", label: "常规按钮", hint: "默认外观，中性表面与浅阴影，悬停时显现品牌色，用于取消、返回和工具栏操作。" },
    { value: "dashed", label: "虚线按钮", hint: "虚线描边，用于添加条件、新增内容。" },
    { value: "text", label: "文字按钮", hint: "低强调度，用于工具栏和轻量操作。" },
    { value: "link", label: "链接样式", hint: "文字强调；需要导航时再传入 href。" },
    { value: "danger", label: "危险按钮", hint: "使用错误色，提示删除、清空等操作。" },
] satisfies Array<{ value: NonNullable<ButtonProps["appearance"]>; label: string; hint: string }>;

export default function Example() {
    const [message, setMessage] = useState("点击任意按钮查看反馈，也可以用 Tab 观察焦点。这里只演示外观。");
    return (
        <div className={stackStyle}>
            <div className={gridStyle}>
                {appearances.map(item => (
                    <section key={item.value} className={cardStyle} aria-label={`${item.label}外观`}>
                        <strong>{item.label} · <code>{item.value}</code></strong>
                        <p className={noteStyle}>{item.hint}</p>
                        <Button appearance={item.value} onClick={() => setMessage(`已点击「${item.label}」，appearance="${item.value}"。`)}>
                            {item.label}
                        </Button>
                    </section>
                ))}
            </div>
            <output className={feedbackStyle} aria-live="polite">{message}</output>
        </div>
    );
}
