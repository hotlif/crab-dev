import { useState } from 'react';
import { css } from '@crab-dev/css';
import FlowDiagram, { FlowNode, FlowEdge, type ElkLayoutNode, type ElkLayoutEdge, type FlowDiagramRenderContext } from '@crab-dev/rc-flow-diagram';
import token from '@crab-dev/rc-token-semantic';

export const meta = { title: '流程工作区状态矩阵', description: '真实 ELK 布局、选中、拖动、手动路由和失败；下方等价节点入口可用键盘选择和移动。' };
const nodes: ElkLayoutNode[] = [{ id: 'request', width: 148, height: 56 }, { id: 'review', width: 148, height: 56 }, { id: 'complete', width: 148, height: 56 }];
const edges: ElkLayoutEdge[] = [{ id: 'to-review', source: 'request', target: 'review' }, { id: 'to-complete', source: 'review', target: 'complete' }];
const sceneStyle = css`padding: ${token.space['card-padding']}; background: ${token.color.surface.content}; max-inline-size: 100%;`;
const scrollStyle = css`overflow: auto; max-inline-size: 100%; &:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: -2px; }`;
const rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; margin-block: ${token.space['component-gap']};`;
const nodeControlStyle = css`border: 1px solid ${token.color.border.default}; background: ${token.color.surface.content}; color: ${token.color.text.primary}; padding: ${token.space['component-gap']}; border-radius: ${token.shape.control}; font: inherit; &[aria-pressed='true'] { background: ${token.color.selection.background}; color: ${token.color.selection.foreground}; } &:focus-visible { outline: 2px solid ${token.color.focus.ring}; } @media (pointer: coarse) { min-inline-size: ${token.size['touch-target']}; min-block-size: ${token.size['touch-target']}; }`;
const statusStyle = css`margin: 0; color: ${token.color.text.secondary};`;

function LayoutStatus({ context }: { context: FlowDiagramRenderContext }) {
    return <output className={statusStyle} aria-label="布局状态" data-layout={context.loading ? 'loading' : context.error ? 'error' : 'ready'} data-node-count={Object.keys(context.nodeRects).length} data-node-rects={JSON.stringify(context.nodeRects)} data-routes={JSON.stringify(context.routes)} data-label-color={context.palette.nodeLabel} data-zoom={context.zoom}>
        {context.error ? `ELK: ${context.error.message}` : context.loading ? 'ELK loading' : `ELK ready · ${Object.keys(context.nodeRects).length} nodes`}
    </output>;
}

export default function VisualMatrixDemo() {
    const [mode, setMode] = useState('default');
    const [selected, setSelected] = useState('');
    const [positions, setPositions] = useState<Record<string, { x: number; y: number }>>({});
    const [exported, setExported] = useState('');
    const visibleNodes = mode === 'empty' ? [] : mode === 'refresh' ? [...nodes, { id: 'archive', width: 148, height: 56 }] : nodes;
    const visibleEdges = mode === 'empty' ? [] : mode === 'refresh' ? [...edges, { id: 'to-archive', source: 'complete', target: 'archive' }] : edges;
    const move = (id: string, x: number, y: number, dx: number, dy: number) => setPositions(previous => ({ ...previous, [id]: { x: (previous[id]?.x ?? x) + dx, y: (previous[id]?.y ?? y) + dy } }));
    return <div>
        <label>验收状态 <select aria-label="验收状态" value={mode} onChange={event => { setMode(event.target.value); setPositions({}); }}>
            {['default', 'empty', 'error', 'manual-route', 'long-text', 'refresh', 'motion'].map(value => <option key={value} value={value}>{value}</option>)}
        </select></label>
        <section aria-label="FlowDiagram visual matrix" className={sceneStyle} data-selection={selected} data-positions={JSON.stringify(positions)}>
            <div role="region" aria-label="流程图滚动区域" tabIndex={0} className={scrollStyle}>
                <FlowDiagram nodes={visibleNodes} edges={visibleEdges} width={640} height={250} nodePositions={positions}
                    elkOptions={mode === 'error' ? { 'elk.algorithm': 'crab.invalid-algorithm' } : undefined}
                    manualRoutes={mode === 'manual-route' ? { 'to-review': { source: 'request', target: 'review', sourcePort: { side: 'bottom', t: 0.5 }, targetPort: { side: 'bottom', t: 0.5 }, waypoints: [{ x: 180, y: 150 }] } } : undefined}
                    onEmptyClick={() => setSelected('')}>
                    {context => <>
                        <LayoutStatus context={context} />
                        <div className={rowStyle} role="toolbar" aria-label="流程图视图工具栏">
                            <button className={nodeControlStyle} type="button" onClick={() => context.controls.fitView(24)}>适应流程图</button>
                            <button className={nodeControlStyle} type="button" onClick={context.controls.zoomIn}>放大流程图</button>
                            <button className={nodeControlStyle} type="button" onClick={context.controls.zoomOut}>缩小流程图</button>
                            <button className={nodeControlStyle} type="button" onClick={() => setExported(context.controls.exportPNG())}>导出流程图 PNG</button>
                        </div>
                        {visibleEdges.map(edge => {
                            const points = context.routes[edge.id]?.points;
                            return points && points.length > 1 ? <FlowEdge key={edge.id} points={points} crossings={context.crossings[edge.id]} dashLength={mode === 'motion' ? 6 : 0} gapLength={4} flowSpeed={mode === 'motion' ? 30 : 0} /> : null;
                        })}
                        {visibleNodes.map(node => {
                            const rect = context.nodeRects[node.id];
                            return rect ? <FlowNode key={node.id} {...rect} label={mode === 'long-text' ? `${node.id} · 长文本 Enterprise` : node.id}
                                fill={selected === node.id ? token.color.selection.background : undefined} labelColor={selected === node.id ? token.color.selection.foreground : undefined}
                                stroke={selected === node.id ? token.color.selection.border : undefined} strokeWidth={selected === node.id ? 2 : 1}
                                draggable onClick={() => setSelected(node.id)} onDrag={(dx, dy) => move(node.id, rect.x, rect.y, dx, dy)} /> : null;
                        })}
                        <div className={rowStyle} role="group" aria-label="节点键盘入口">
                            {visibleNodes.map(node => <button className={nodeControlStyle} key={node.id} type="button" aria-pressed={selected === node.id}
                                onClick={() => setSelected(node.id)} onKeyDown={event => {
                                    const deltas: Record<string, [number, number]> = { ArrowRight: [10, 0], ArrowLeft: [-10, 0], ArrowUp: [0, -10], ArrowDown: [0, 10] };
                                    const delta = deltas[event.key], rect = context.nodeRects[node.id];
                                    if (delta && rect) { event.preventDefault(); move(node.id, rect.x, rect.y, ...delta); }
                                }}>{node.id}</button>)}
                        </div>
                    </>}
                </FlowDiagram>
            </div>
            {exported && <img src={exported} alt="导出的流程图 PNG" />}
        </section>
    </div>;
}
