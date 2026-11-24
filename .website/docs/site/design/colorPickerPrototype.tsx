import { useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import ColorPicker, { type ColorPreset, type OKLCHValue } from "@crab-dev/rc-color-picker";
import LineEdit, { TokenVars as lineEditTokens } from "@crab-dev/rc-line-edit";
import { PickerPrototype } from "./pickerPrototype.js";

const initialColor: OKLCHValue = { lightness: 0.56, chroma: 0.158, hue: 256, alpha: 1 };
const presets: ColorPreset[] = [{
    label: "工程系列色",
    colors: [
        initialColor,
        { lightness: 0.6, chroma: 0.15, hue: 158, alpha: 1 },
        { lightness: 0.64, chroma: 0.163, hue: 55, alpha: 1 },
        { lightness: 0.58, chroma: 0.185, hue: 307, alpha: 1 },
    ],
}];
const samples = [
    { time: "08:00", value: 36 },
    { time: "09:00", value: 54 },
    { time: "10:00", value: 68 },
    { time: "11:00", value: 46 },
];
const notes = {
    md3: "MD3 将预设色板、文字值和透明度放入同一面板。应用动作使用实色，将暂定值与图表更新区分开。",
    macos: "macOS 使用紧凑的色井与浮层，保留文字值、透明度和明确的应用操作。",
    shadcn: "shadcn/ui 使用中性的色井和描边面板，让图表系列色和键盘焦点保持醒目。",
};

function precisionText(value: OKLCHValue) {
    return `${(value.lightness * 100).toFixed(1)}% ${value.chroma.toFixed(3)} ${value.hue.toFixed(1)} / ${Math.round((value.alpha ?? 1) * 100)}%`;
}

function parsePrecision(text: string): OKLCHValue | null {
    const match = /^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)\s+(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)%$/.exec(text.trim());
    if (!match) return null;
    const [lightness, chroma, hue, alpha] = match.slice(1).map(Number);
    if (lightness > 100 || chroma > 0.4 || hue > 360 || alpha > 100) return null;
    return { lightness: lightness / 100, chroma, hue, alpha: alpha / 100 };
}

export default function ColorPickerPrototype() {
    const { designSystem } = useConfig();
    const size = designSystem === "macos" ? "small" : "medium";
    const [value, setValue] = useState(initialColor);
    const [precise, setPrecise] = useState(false);
    const [draft, setDraft] = useState("");
    const [message, setMessage] = useState("");
    const input = useRef<HTMLInputElement>(null);
    const alpha = value.alpha ?? 1;
    const color = `oklch(${value.lightness} ${value.chroma} ${value.hue} / ${alpha})`;
    const colorText = `${(value.lightness * 100).toFixed(1)}% · ${value.chroma.toFixed(3)} · ${value.hue.toFixed(1)}°`;

    function applyColor(next: OKLCHValue) {
        setValue(next);
        setDraft(precisionText(next));
        setMessage("");
    }

    function applyPrecision() {
        const next = parsePrecision(draft);
        if (next) applyColor(next);
        else {
            setMessage("按示例填写。亮度和透明度为 0%–100%，色度为 0–0.4，色相为 0–360。");
            input.current?.focus();
        }
    }

    return <PickerPrototype route="color-picker" title="ColorPicker 取色器" scene="巡检图表系列色"
        description="配置进水流量系列，核对色板、手输和透明度在浅深背景下的效果。"
        note={notes[designSystem]} rules={[
            ["预设与手输", "从色板应用预设后，精确输入同步显示当前值。也可以用 OKLCH 数值直接更新图表和色井。"],
            ["无效值", "精确输入逐项校验数值范围。校验失败保留输入和上次应用的颜色。"],
            ["应用与取消", "应用将当前草稿用于图表。取消、点击外部或 Escape 保留上一次已应用值。应用和取消将焦点还给色井。"],
            ["透明度", "0% 完全透明，100% 完全不透明。两张图表使用同一颜色，文本同时记录颜色值和透明度。"],
        ]} summary={<>
            <h3>应用效果</h3>
            <div className="crab-picker-color-previews">
                {["浅色图表", "深色图表"].map((title, index) => <figure key={title}
                    className="crab-picker-chart" data-chart-mode={index === 0 ? "light" : "dark"}>
                    <figcaption>{title}</figcaption>
                    <ul role="list" aria-label="进水流量时段">
                        {samples.map(sample => <li key={sample.time} aria-label={`${sample.time}，${sample.value} 立方米每小时`}>
                            <span aria-hidden="true">{sample.value}</span>
                            <i aria-hidden="true" style={{ blockSize: `${sample.value}%`, backgroundColor: color }} />
                            <span aria-hidden="true">{sample.time}</span>
                        </li>)}
                    </ul>
                </figure>)}
            </div>
        </>}>
        <div className="crab-picker-heading">
            <h3>进水流量</h3>
            <ColorPicker aria-label="选择进水流量颜色" size={size}
                value={value} onValueChange={applyColor} presets={presets} showAlpha showEyeDropper={false} allowClear
                locale={{ overlay: { confirmText: "应用颜色", cancelText: "取消", clearText: "还原已用颜色" } }} />
        </div>
        <Button size="s" appearance="text" aria-expanded={precise} onClick={() => {
            if (!precise) {
                setDraft(precisionText(value));
                setMessage("");
            }
            setPrecise(!precise);
        }}>{precise ? "收起精确输入" : "精确输入 OKLCH"}</Button>
        {precise && <div className="crab-picker-manual">
            <LineEdit ref={input} autoFocus label="OKLCH 数值" value={draft} size={size} appearance="outlined"
                supportingText="例如 56% 0.158 256 / 85%" errorText={message || undefined}
                style={designSystem === "md3" ? { [lineEditTokens["field.outlined.box-shadow-error"]]: "none" } : undefined}
                onValueChange={text => { setDraft(text); setMessage(""); }}
                onKeyDown={event => { if (event.key === "Enter" && !event.nativeEvent.isComposing) applyPrecision(); }} />
            <Button size="s" appearance="primary" onClick={applyPrecision}>应用数值</Button>
        </div>}
        <dl className="crab-picker-rules" aria-live="polite">
            <div><dt>已应用 OKLCH</dt><dd data-applied-color>{colorText}</dd></div>
            <div><dt>不透明度</dt><dd data-applied-opacity>{Math.round(alpha * 100)}%</dd></div>
        </dl>
        <Button size="s" appearance="text" onClick={() => applyColor(initialColor)}>恢复默认蓝色</Button>
    </PickerPrototype>;
}
