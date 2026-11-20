export const meta = { title: '形状与连接式按钮组', description: '按压和选中时保持 Round、Square 和组内按钮的轮廓，通过填色观察选中状态。' };
import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Button, { ButtonGroup } from '../../src/index.js';
const stack = css`display: grid; gap: ${token.space['section-gap']};`;
const row = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']};`;
export default function Example() {
    const [round, setRound] = useState(false);
    const [square, setSquare] = useState(false);
    const [view, setView] = useState('列表');
    return <div className={stack}>
        <div className={row}>
            <Button appearance="tonal" shape="round" isSelected={round} onClick={() => setRound(!round)}>Round</Button>
            <Button appearance="tonal" shape="square" isSelected={square} onClick={() => setSquare(!square)}>Square</Button>
        </div>
        <ButtonGroup appearance="tonal" variant="connected">
            {['列表', '卡片', '看板'].map(label => <Button key={label} isSelected={view === label} onClick={() => setView(label)}>{label}</Button>)}
        </ButtonGroup>
    </div>;
}
