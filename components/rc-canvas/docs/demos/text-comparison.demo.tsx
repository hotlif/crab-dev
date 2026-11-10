import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import { Canvas, Text, Viewport } from '@crab-dev/rc-canvas';

export const meta = {
    title: 'HTML 与画布文字对照',
    description: '相同字体、字重和字号下比较 HTML、SDF 与 auto。画布滚轮缩放后，HTML 同步字号；auto 在缩放稳定后更新纹理。',
};
const surface = css`
    overflow: auto;
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
    border: 1px solid ${token.color.border.subtle};
`;
const columns = css`display: flex; min-width: 720px; align-items: flex-start;`;
const reference = css`width: 240px; flex-shrink: 0; font-family: system-ui; font-weight: 400;`;
const sizes = [10, 12, 13, 14, 16];
const sample = '商品模型 products revision';
export default function TextComparisonDemo() {
    const [zoom, setZoom] = useState(1);
    return <section className={surface} aria-label="HTML 与画布文字对照" tabIndex={0}>
        <p>左：HTML；画布左列：SDF；右列：auto。缩放 {Math.round(zoom * 100)}%，滚轮可调整。</p>
        <div className={columns}>
            <div className={reference} style={{ width: 240 * zoom }}>
                {sizes.map(size => <div key={size} style={{ height: 38 * zoom, boxSizing: 'border-box', fontSize: size * zoom, lineHeight: `${size * 1.4 * zoom}px`, paddingTop: 4 * zoom }}>{sample}</div>)}
            </div>
            <Canvas width={960} height={400}>
                <Viewport zoom={zoom} panX={0} panY={0} minZoom={0.75} maxZoom={2} pannable={false} onViewportChange={value => setZoom(value.zoom)}>
                    {sizes.map((size, index) => <Text key={`sdf-${size}`} x={0} y={index * 38} fontSize={size} fontWeight={400} mode="sdf">{sample}</Text>)}
                    {sizes.map((size, index) => <Text key={`auto-${size}`} x={240} y={index * 38} fontSize={size} fontWeight={400} mode="auto">{sample}</Text>)}
                </Viewport>
            </Canvas>
        </div>
    </section>;
}
