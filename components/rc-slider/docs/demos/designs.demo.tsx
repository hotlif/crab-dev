import { useId, useState } from 'react';
import { css } from '@crab-dev/css';
import ConfigProvider from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import Slider from '../../src/slider.js';

export const meta = { title: '三套设计与状态', description: 'Apple 的窄胶囊手柄、MD3 的细竖柄和 shadcn 的圆形手柄；支持键盘步进与从右到左布局。' };
const panel = css`
    display: grid;
    gap: ${token.space['component-gap']};
    padding: ${token.space['section-gap']};
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.md};
`;
const stack = css`
    display: grid;
    gap: ${token.space['stack-gap']};
    width: min(calc(${token.size['64']} * 5), calc(100vw - 2 * ${token.space['section-gap']}));
    max-width: 100%;
    min-width: 0;
`;
const row = css`display: grid; gap: ${token.space['stack-gap']}; min-width: 0;`;
export default function DesignsDemo() {
    const [value, setValue] = useState(40);
    const errorId = useId();
    return <div className={stack}>
        {(['apple', 'md3', 'shadcn'] as const).map(design => <ConfigProvider key={design} designSystem={design}>
            <section className={panel} aria-label={`${design} 滑块`}>
                <strong>{design === 'md3' ? 'MD3' : design === 'apple' ? 'Apple' : 'shadcn'} · {value}%</strong>
                <div className={row}>
                    <span id={`${errorId}-${design}-brightness`}>亮度</span>
                    <Slider value={value} onValueChange={setValue} aria-labelledby={`${errorId}-${design}-brightness`} aria-valuetext={`${value}%`} />
                </div>
                <div className={row}>
                    <span id={`${errorId}-${design}-disabled`}>不可用亮度</span>
                    <Slider value={65} disabled aria-labelledby={`${errorId}-${design}-disabled`} />
                </div>
                <div className={row}>
                    <span id={`${errorId}-${design}-rtl`}>从右到左的亮度</span>
                    <Slider value={value} onValueChange={setValue} dir="rtl" aria-labelledby={`${errorId}-${design}-rtl`} />
                </div>
                <div className={row}>
                    <span id={`${errorId}-${design}-sync`}>同步亮度</span>
                    <Slider value={value} onValueChange={setValue} aria-labelledby={`${errorId}-${design}-sync`} aria-invalid="true" aria-describedby={`${errorId}-${design}`} />
                </div>
                <small id={`${errorId}-${design}`}>设备未连接，当前值尚未同步。</small>
            </section>
        </ConfigProvider>)}
    </div>;
}
