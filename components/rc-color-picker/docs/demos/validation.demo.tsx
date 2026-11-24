import { css } from '@crab-dev/css';
import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import ColorPicker, { type OKLCHValue } from '../../src/index.js';

export const meta = {
    title: '颜色草稿与校验',
    description: '打开颜色面板，输入无效的颜色。改正或选择预设后，再应用到巡检标记。',
};

const scene = css`display: grid; gap: 0.75rem; inline-size: min(100%, 20rem);`;
const initial: OKLCHValue = { lightness: 0.62, chroma: 0.19, hue: 255, alpha: 1 };
const presets = [{ lightness: 0.7, chroma: 0.16, hue: 145, alpha: 1 }];

export default function ColorValidation() {
    const [value, setValue] = useState(initial);
    return <section className={scene} aria-label="巡检标记">
        <ColorPicker aria-label="标记颜色" value={value} onValueChange={setValue}
            presets={presets} allowClear showEyeDropper={false} />
        <output aria-label="已应用颜色">已应用透明度 {Math.round((value.alpha ?? 1) * 100)}%</output>
        <Button appearance="text" onClick={() => setValue(initial)}>恢复标记颜色</Button>
    </section>;
}
