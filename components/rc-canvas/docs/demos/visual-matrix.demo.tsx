import { useRef, useState } from 'react';
import { css, cx } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import { Canvas, Rect, Text, Line } from '@crab-dev/rc-canvas';
import { canvasFrameStyle, canvasViewportStyle } from '../demo-layout.js';
export const meta = { title: '专业画布交互矩阵', description: '真实绘制、选中、拖动、文字草稿与资源恢复；领域坐标不随控件尺寸缩放。' };
const frame = css`display: grid; min-width: 0; gap: ${token.space['component-gap']}; padding: ${token.space['component-gap']}; color: ${token.color.text.primary}; background: ${token.color.background.surface}; overflow-wrap: anywhere;`;
export default function VisualMatrixDemo() {
    const [text, setText] = useState('双击编辑 Edit text');
    const [selected, setSelected] = useState(false);
    const [hovered, setHovered] = useState(false);
    const [position, setPosition] = useState({ x: 24, y: 104 });
    const [flow, setFlow] = useState(false);
    const telemetry = useRef<HTMLDivElement>(null);
    const frames = useRef(0);
    return <section className={frame} aria-label="Canvas visual matrix">
        <p>双击文字开始编辑。拖动矩形，或选择后用方向键调整位置。</p>
        <label><input type="checkbox" checked={flow} onChange={event => setFlow(event.currentTarget.checked)} /> 连接线流动</label>
        <div ref={telemetry} className={cx(canvasFrameStyle, canvasViewportStyle)} role="region" aria-label="画布局部滚动区" tabIndex={0}>
            <Canvas width={480} height={220}
                onRender={() => { if (telemetry.current) telemetry.current.dataset.renderCount = String(++frames.current); }}
                onEmptyClick={() => setSelected(false)}
                onKeyDown={event => {
                    if (selected && event.key.startsWith('Arrow')) {
                        event.preventDefault();
                        setPosition(value => ({
                            x: value.x + (event.key === 'ArrowRight' ? 8 : event.key === 'ArrowLeft' ? -8 : 0),
                            y: value.y + (event.key === 'ArrowDown' ? 8 : event.key === 'ArrowUp' ? -8 : 0),
                        }));
                    }
                }}>
                <Text x={24} y={28} fontSize={24} maxWidth={420} editable editorLabel="Canvas draft" onEdit={setText}>{text}</Text>
                <Rect x={position.x} y={position.y} width={160} height={64} radius={8} fill={hovered ? token.color.brand.container : token.color.surface.raised} stroke={selected ? token.color.selection.border : token.color.border.default} strokeWidth={selected ? 3 : 1} draggable cursor="grab" onClick={() => setSelected(true)} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)} onDrag={({ localDx, localDy }) => setPosition(value => ({ x: value.x + localDx, y: value.y + localDy }))} />
                <Line x1={216} y1={136} x2={440} y2={136} lineWidth={3} dashLength={12} gapLength={8} flowSpeed={flow ? 48 : 0} />
            </Canvas>
        </div>
        <output aria-label="画布模型">{text} / {selected ? 'selected' : 'unselected'} / {Math.round(position.x)},{Math.round(position.y)}</output>
    </section>;
}
