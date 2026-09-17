import { useId, useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import Button from "@crab-dev/rc-button";
import ConfigProvider from "@crab-dev/rc-config-provider";
import Radio, { RadioGroup } from "@crab-dev/rc-radio";

const stackStyle = css`display: grid; min-width: 0; gap: ${token.space["group-gap"]};`;
const rowStyle = css`display: flex; align-items: center; flex-wrap: wrap; gap: ${token.space["component-gap"]};`;
const panelsStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.space["group-gap"]} * 16)), 1fr));
    gap: ${token.space["group-gap"]};
`;
const panelStyle = css`
    min-width: 0;
    padding: ${token.space["group-gap"]};
    color: ${token.color.text.primary};
    background: ${token.color.background.surface};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.lg};
`;
const noteStyle = css`margin: 0; color: ${token.color.text.secondary}; font-size: ${token.font.size.caption};`;
const errorStyle = css`margin: 0; color: ${token.color.feedback.error.text}; font-size: ${token.font.size.caption};`;
const dividerStyle = css`padding-top: ${token.space["group-gap"]}; border-top: 1px solid ${token.color.border.subtle};`;

function ThemePanel({ theme, brandColor }: { theme: "light" | "dark"; brandColor: string }) {
    const title = theme === "light" ? "浅色" : "深色";
    const helpId = useId();
    return (
        <ConfigProvider theme={theme} brandColor={brandColor} className={panelStyle}>
            <section className={stackStyle} aria-label={`${title} Radio 状态对照`}>
                <strong>{title}主题</strong>
                <RadioGroup defaultValue="weekly" aria-label={`${title}通知频率`}>
                    <Radio value="daily">每天</Radio>
                    <Radio value="weekly">每周</Radio>
                </RadioGroup>
                <p className={noteStyle}>悬停文字或圆环、按住鼠标、用 Tab 和方向键切换，观察状态层、圆点与独立焦点环。</p>
                <div className={dividerStyle}>
                    <strong>禁用状态</strong>
                    <div className={rowStyle}>
                        <Radio disabled>未选中</Radio>
                        <Radio disabled checked>已选中</Radio>
                    </div>
                </div>
                <div className={dividerStyle}>
                    <div className={stackStyle}>
                        <strong>三种视觉尺寸</strong>
                        {(["small", "middle", "large"] as const).map(size => (
                            <RadioGroup key={size} size={size} defaultValue="a" aria-label={`${title} ${size} 尺寸`}>
                                <Radio value="a">{size} A</Radio>
                                <Radio value="b">{size} B</Radio>
                            </RadioGroup>
                        ))}
                    </div>
                </div>
                <div className={dividerStyle}>
                    <Radio aria-invalid="true" aria-describedby={helpId}>确认一种通知方式</Radio>
                    <p id={helpId} className={errorStyle}>示例校验提示：请选择通知方式。</p>
                </div>
            </section>
        </ConfigProvider>
    );
}

export default function Example() {
    const [brandColor, setBrandColor] = useState("#6750a4");
    return (
        <div className={stackStyle}>
            <div className={rowStyle} role="group" aria-label="Radio 品牌色">
                <span>品牌色</span>
                {[["紫色", "#6750a4"], ["蓝色", "#1677ff"], ["绿色", "#087f5b"]].map(([name, color]) => (
                    <Button key={color} size="small" isSelected={brandColor === color} onClick={() => setBrandColor(color)}>{name}</Button>
                ))}
            </div>
            <p className={noteStyle}>参考 Material Design 3：品牌色圆环与圆点，透明底色、圆形状态层。默认圆环 20px；small / large 为 16 / 24px。视觉尺寸与点击区域分开，选中不会改变布局。</p>
            <div className={panelsStyle}>
                <ThemePanel theme="light" brandColor={brandColor} />
                <ThemePanel theme="dark" brandColor={brandColor} />
            </div>
        </div>
    );
}
