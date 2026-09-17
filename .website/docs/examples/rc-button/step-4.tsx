import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Button, { ButtonGroup } from "@crab-dev/rc-button";

const stackStyle = css`display: grid; gap: ${token.space["group-gap"]}; min-width: 0;`;
const sectionStyle = css`display: grid; gap: ${token.space["component-gap"]}; min-width: 0;`;
const rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space["component-gap"]};`;
const noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.body};`;

function PlusIcon() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="M12 5v14M5 12h14" /></svg>;
}
function ArrowIcon() {
    return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" focusable="false"><path d="m9 5 7 7-7 7M4 12h12" /></svg>;
}

export default function Example() {
    const [bold, setBold] = useState(false);
    const [italic, setItalic] = useState(true);
    const [underline, setUnderline] = useState(false);
    const [message, setMessage] = useState("点击按钮查看反馈；格式按钮可以独立切换选中状态。");
    return (
        <div className={stackStyle}>
            <section className={sectionStyle} aria-label="图标位置">
                <strong>图标与文字</strong>
                <p className={noteStyle}>icon 放在文字前，iconAfter 放在文字后。</p>
                <div className={rowStyle}>
                    <Button appearance="primary" icon={<PlusIcon />} onClick={() => setMessage("已点击前置图标按钮。")}>新建项目</Button>
                    <Button iconAfter={<ArrowIcon />} onClick={() => setMessage("已点击后置图标按钮。")}>下一步</Button>
                    <Button appearance="text" icon={<PlusIcon />} onClick={() => setMessage("已点击轻量图标按钮。")}>添加条件</Button>
                </div>
            </section>
            <section className={sectionStyle} aria-label="纯图标与圆形按钮">
                <strong>纯图标与圆形</strong>
                <p className={noteStyle}>纯图标按钮通过 aria-label 提供名称；圆形按钮宽高相等。</p>
                <div className={rowStyle}>
                    <Button icon={<PlusIcon />} aria-label="方形新增" onClick={() => setMessage("已点击方形新增。")}/>
                    <Button appearance="primary" shape="circle" size="small" icon={<PlusIcon />} aria-label="小号圆形新增" onClick={() => setMessage("已点击小号圆形新增。")}/>
                    <Button appearance="primary" shape="circle" icon={<PlusIcon />} aria-label="中号圆形新增" onClick={() => setMessage("已点击中号圆形新增。")}/>
                    <Button appearance="primary" shape="circle" size="large" icon={<PlusIcon />} aria-label="大号圆形新增" onClick={() => setMessage("已点击大号圆形新增。")}/>
                    <Button shape="circle" icon={<PlusIcon />} aria-label="禁用圆形新增" disabled />
                </div>
            </section>
            <section className={sectionStyle} aria-label="按钮组选中状态">
                <strong>按钮组与选中</strong>
                <p className={noteStyle}>ButtonGroup 统一尺寸和外观，isSelected 显示可切换状态。</p>
                <ButtonGroup size="middle" appearance="subtle">
                    <Button isSelected={bold} onClick={() => setBold(value => !value)}>粗体</Button>
                    <Button isSelected={italic} onClick={() => setItalic(value => !value)}>斜体</Button>
                    <Button isSelected={underline} onClick={() => setUnderline(value => !value)}>下划线</Button>
                </ButtonGroup>
                <output className={noteStyle} aria-live="polite">已选格式：{[bold && "粗体", italic && "斜体", underline && "下划线"].filter(Boolean).join("、") || "无"}</output>
            </section>
            <section className={sectionStyle} aria-label="通栏按钮">
                <strong>通栏与链接</strong>
                <p className={noteStyle}>shouldFitContainer 撑满容器；href 让按钮承担实际导航。</p>
                <Button appearance="primary" shouldFitContainer onClick={() => setMessage("已点击通栏按钮。")}>继续下一步</Button>
                <div className={rowStyle}><Button appearance="link" href="#api">查看 Button API</Button></div>
            </section>
            <output className={noteStyle} aria-live="polite">{message}</output>
        </div>
    );
}
