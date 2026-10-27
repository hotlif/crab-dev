import { useState } from 'react';
import { css } from '@crab-dev/css';
import { Canvas, Rect, Text } from '@crab-dev/rc-canvas';

export const meta = {
    title: '默认色板与文字编辑',
    description: '图形与文字不传颜色参数。双击画布文字进入真实编辑层，Enter 提交、Shift+Enter 换行、Escape 取消；下方显示已提交内容。',
};

const viewportStyle = css`max-width: 100%; overflow: auto;`;

export default function VisualStatesDemo() {
    const [text, setText] = useState('双击编辑 Edit text');
    return <div>
        <p>双击文字开始编辑，按 Enter 提交或 Escape 取消。</p>
        <div className={viewportStyle} role="region" aria-label="可编辑文字画布" tabIndex={0}>
            <Canvas width={420} height={180}>
                <Rect x={24} y={100} width={160} height={48} radius={8} />
                <Text x={24} y={28} fontSize={24} maxWidth={360} editable onEdit={setText}>{text}</Text>
            </Canvas>
        </div>
        <output aria-label="已提交文字">{text}</output>
    </div>;
}
