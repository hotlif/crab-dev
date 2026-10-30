import { useState } from "react";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import ColorPicker, { type OKLCHValue } from "@crab-dev/rc-color-picker";

export const meta = { title: "三体系取色状态矩阵", description: "颜色数据、格式、透明度、预设与确认取消均保持真实交互。" };
const layout = css`padding: ${token.space['section-gap']}; display: grid; justify-items: start; gap: ${token.space['section-gap']}; min-height: 32rem; align-content: start;`;
const presets = [{ label: "品牌预设", colors: [{ lightness: 0.62, chroma: 0.19, hue: 255 }, { lightness: 0.7, chroma: 0.16, hue: 145 }] }];
export default function VisualMatrixDemo() {
    const [state, setState] = useState("default");
    const [value, setValue] = useState<OKLCHValue>({ lightness: 0.62, chroma: 0.19, hue: 255, alpha: 0.75 });
    return <section aria-label="ColorPicker visual matrix" className={layout}>
        <label>验收状态<select aria-label="验收状态" value={state} onChange={event => setState(event.target.value)}><option>default</option><option>disabled</option></select></label>
        <ColorPicker aria-label="主题颜色" value={value} onValueChange={setValue} disabled={state === "disabled"} presets={presets} allowClear />
        <output aria-label="已确认颜色">{JSON.stringify(value)}</output>
    </section>;
}
