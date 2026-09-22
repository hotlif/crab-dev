import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Button, { type ButtonProps } from "@crab-dev/rc-button";
import ConfigProvider from "@crab-dev/rc-config-provider";

const stackStyle = css`display: grid; gap: ${token.space["section-gap"]}; min-width: 0;`;
const rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space["component-gap"]};`;
const panelsStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.space["group-gap"]} * 15)), 1fr));
    gap: ${token.space["section-gap"]};
`;
const panelStyle = css`
    min-width: 0;
    padding: ${token.space["section-gap"]};
    background: ${token.color.background.surface};
    color: ${token.color.text.primary};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.lg};
`;
const variantStyle = css`
    display: grid;
    gap: ${token.space["component-gap"]};
    padding-top: ${token.space["section-gap"]};
    border-top: 1px solid ${token.color.border.subtle};
`;
const statesStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.space["component-gap"]} * 11)), 1fr));
    gap: ${token.space["component-gap"]};
`;
const sampleStyle = css`display: grid; justify-items: start; align-content: start; gap: ${token.space["component-gap"]};`;
const noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption};`;
const appearances = ["elevated", "primary", "tonal", "outlined", "text"] satisfies Array<NonNullable<ButtonProps["appearance"]>>;

function ThemePanel({ theme, brandColor }: { theme: "light" | "dark"; brandColor: string }) {
    const [message, setMessage] = useState("悬停或用 Tab 聚焦可用按钮，观察填充反馈与焦点环。");
    const [selected, setSelected] = useState(true);
    const title = theme === "light" ? "浅色" : "深色";
    return (
        <ConfigProvider theme={theme} brandColor={brandColor} className={panelStyle}>
            <section className={stackStyle} aria-label={`${title} Button 状态对照`}>
                <strong>{title}主题</strong>
                {appearances.map(appearance => (
                    <section key={appearance} className={variantStyle} aria-label={`${title} ${appearance}`}>
                        <strong><code>{appearance}</code></strong>
                        <div className={statesStyle}>
                            <div className={sampleStyle}>
                                <span className={noteStyle}>默认</span>
                                <Button appearance={appearance} onClick={() => setMessage(`已点击 ${title}主题下的 ${appearance} 按钮。`)}>按钮</Button>
                            </div>
                            <div className={sampleStyle}>
                                <span className={noteStyle}>禁用</span>
                                <Button appearance={appearance} disabled>按钮</Button>
                            </div>
                            <div className={sampleStyle}>
                                <span className={noteStyle}>加载中</span>
                                <Button appearance={appearance} loading>按钮</Button>
                            </div>
                            {appearance === "outlined" && (
                                <div className={sampleStyle}>
                                    <span className={noteStyle}>可切换选中</span>
                                    <Button isSelected={selected} onClick={() => setSelected(value => !value)}>{selected ? "已选中" : "未选中"}</Button>
                                </div>
                            )}
                        </div>
                    </section>
                ))}
                <section className={variantStyle} aria-label={`${title} 表单操作`}>
                    <strong>保存 + 取消</strong>
                    <p className={noteStyle}>保存使用实色；取消使用中性文字和细描边，不使用阴影。</p>
                    <div className={rowStyle}>
                        <Button appearance="primary" onClick={() => setMessage(`${title}：已保存本地示例。`)}>保存修改</Button>
                        <Button onClick={() => setMessage(`${title}：已取消本地编辑。`)}>取消</Button>
                    </div>
                </section>
                <section className={variantStyle} aria-label={`${title} 工具栏操作`}>
                    <strong>主要操作 + 工具栏操作</strong>
                    <p className={noteStyle}>新建最醒目；刷新与导出保持中性，操作时提供同色系反馈。</p>
                    <div className={rowStyle}>
                        <Button appearance="primary" onClick={() => setMessage(`${title}：已新建本地示例项目。`)}>新建项目</Button>
                        <Button onClick={() => setMessage(`${title}：已刷新本地示例。`)}>刷新</Button>
                        <Button onClick={() => setMessage(`${title}：已模拟导出，不下载文件。`)}>导出</Button>
                    </div>
                </section>
                <output className={noteStyle} aria-live="polite">{message}</output>
            </section>
        </ConfigProvider>
    );
}

export default function Example() {
    const [brandColor, setBrandColor] = useState("#6750a4");
    return (
        <div className={stackStyle}>
            <div className={rowStyle} role="group" aria-label="Button 品牌色">
                <span>品牌色</span>
                {[["紫色", "#6750a4"], ["蓝色", "#1677ff"], ["绿色", "#087f5b"]].map(([name, color]) => (
                    <Button key={color} size="small" isSelected={brandColor === color} onClick={() => setBrandColor(color)}>{name}</Button>
                ))}
            </div>
            <p className={noteStyle}>普通按钮采用 Outlined 描边外观。悬停与聚焦使用 8% / 10% 填充反馈，按压时收紧圆角；选中使用反色填充。Elevated 使用浅阴影，与其余四种外观区分。</p>
            <div className={panelsStyle}>
                <ThemePanel theme="light" brandColor={brandColor} />
                <ThemePanel theme="dark" brandColor={brandColor} />
            </div>
        </div>
    );
}
