export const meta = {
    title: '交互状态',
    description: '三种变体保留各自的表面色和层级，支持鼠标、键盘及禁用状态。',
};

import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import { useState } from 'react';
import Card from '../../src/card.js';
import type { CardVariant } from '../../src/types.js';

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.size[64]} * 4)), 1fr));
    gap: ${token.space['section-gap']};
`;
const variants: CardVariant[] = ['elevated', 'outlined', 'filled'];

export default function StatesDemo() {
    const [selected, setSelected] = useState<CardVariant | null>(null);
    return <div>
        <div className={gridStyle}>
            {variants.map(variant => <Card key={variant} variant={variant} clickable
                title={variant} onClick={() => setSelected(variant)}>
                点击或按 Enter / Space 选择此卡片。
            </Card>)}
            {variants.map(variant => <Card key={`${variant}-disabled`} variant={variant} clickable disabled
                title={`${variant} · 不可用`}>
                完成设置后可用。
            </Card>)}
        </div>
        <p role="status">{selected ? `已选择 ${selected}` : '请选择一种卡片'}</p>
    </div>;
}
