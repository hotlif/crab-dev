import { useState } from 'react';
import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import { Canvas, Viewport, InfiniteGrid, type ViewportState } from '@crab-dev/rc-canvas';
import { FlowNode } from '@crab-dev/rc-flow-diagram';

export const meta = { title: '缩小后的可读标签', description: '按显示字号切换完整、精简与概览标签，详情入口支持悬停、Tab 聚焦和 Escape 关闭。' };
const toolbar = css`display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 8px;`;
const scroll = css`max-width: 100%; overflow: auto;`;
const label = '商品模型 products\nid · uuid\nrevision · integer\nname · text\nprice · decimal';

export default function ReadabilityDemo() {
    const [viewport, setViewport] = useState<ViewportState>({ zoom: 1, panX: 30, panY: 30 });
    const [position, setPosition] = useState({ x: 40, y: 40 });
    return <section aria-label="缩放可读性示例">
        <div className={toolbar}>
            {[1, 0.6, 0.25].map(zoom => <Button key={zoom} aria-pressed={viewport.zoom === zoom}
                onClick={() => setViewport({ ...viewport, zoom })}>{zoom * 100}%</Button>)}
            <Button onClick={() => setViewport({ ...viewport, panX: viewport.panX + 20 })}>向右平移</Button>
        </div>
        <div className={scroll} role="region" aria-label="模型画布" tabIndex={0}>
            <Canvas width={480} height={260}>
                <Viewport {...viewport} minZoom={0.25} onViewportChange={setViewport}>
                    <InfiniteGrid />
                    <FlowNode {...position} width={260} height={150} label={label} fontSize={13}
                        draggable onDrag={(dx, dy) => setPosition(previous => ({ x: previous.x + dx, y: previous.y + dy }))}
                        readability={{ compactLabel: 'products · id, revision, name, price', overviewLabel: '商品 · 4 字段',
                            details: label, detailsLabel: '查看商品模型完整字段' }} />
                </Viewport>
            </Canvas>
        </div>
    </section>;
}
