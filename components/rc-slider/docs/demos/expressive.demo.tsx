export const meta = { title: '五档尺寸', description: '尺寸会随设计风格调整；MD3 保留竖向手柄、轨道间隙与终点。' };
import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Slider from '../../src/slider.js';
const stack = css`
    display: grid;
    gap: ${token.space['section-gap']};
    width: min(calc(${token.size['64']} * 5), calc(100vw - 2 * ${token.space['section-gap']}));
    max-width: 100%;
`;
export default function Example() {
    const [value, setValue] = useState(40);
    return <div className={stack}>{(['xs','s','m','l','xl'] as const).map(size => <div key={size}>
        <span>{size.toUpperCase()} · {value}</span>
        <Slider size={size} value={value} onValueChange={setValue} aria-label={`${size} 滑块`} />
    </div>)}</div>;
}
