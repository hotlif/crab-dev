import { useState } from 'react';
import { css, cx } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Masonry from '@crab-dev/rc-masonry';

export const meta = {
    title: '布局验收矩阵',
    description: '固定内容与不同高度，核对最短列、顺序分列、动态插入、RTL 镜像及密度重新测量。',
};
const frame = css`
    width: 100%;
    max-width: 800px;
    min-width: 0;
    padding: ${token.space['component-gap']};
    box-sizing: border-box;
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
`;
const item = css`
    box-sizing: border-box;
    padding: ${token.space['component-gap']};
    background: ${token.color.surface.container};
    border: 1px solid ${token.color.border.default};
    border-radius: ${token.radius.sm};
    overflow-wrap: anywhere;
    @media (forced-colors: active) {
        color: CanvasText;
        background: Canvas;
        border-color: CanvasText;
    }
`;
const heights = [
    css`
        min-height: 90px;
    `,
    css`
        min-height: 150px;
    `,
    css`
        min-height: 120px;
    `,
    css`
        min-height: 180px;
    `,
];
export default function VisualMatrixDemo() {
    const [mode, setMode] = useState('default');
    return (
        <>
            <label>
                验收状态{' '}
                <select aria-label="验收状态" value={mode} onChange={(event) => setMode(event.target.value)}>
                    <option value="default">最短列</option>
                    <option value="sequential">按顺序</option>
                    <option value="inserted">新增内容</option>
                    <option value="empty">空容器</option>
                </select>
            </label>
            <section aria-label="Masonry visual matrix" className={frame}>
                <Masonry columns={3} sequential={mode === 'sequential'}>
                    {Array.from({ length: mode === 'empty' ? 0 : mode === 'inserted' ? 10 : 8 }, (_, index) => (
                        <article key={index} data-masonry-card className={cx(item, heights[index % heights.length])}>
                            <h3>项目 Item {index + 1}</h3>
                            <p>中文与 English 内容</p>
                        </article>
                    ))}
                </Masonry>
            </section>
        </>
    );
}
