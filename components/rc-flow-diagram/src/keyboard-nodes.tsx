import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import type { Pt } from '@crab-dev/rc-canvas';
import { useState, type KeyboardEvent, type MouseEvent } from 'react';
import type { FlowDiagramControls, FlowNodeRect } from './flow-diagram.js';
import type { ElkLayoutNode } from './hooks/useElkLayout.js';

export interface FlowDiagramKeyboardOptions {
    label?: string;
    emptyLabel?: string;
    getNodeLabel: (nodeId: string) => string;
    selectedNodeId?: string | null;
    onSelectNode?: (nodeId: string, event: MouseEvent<HTMLButtonElement>) => void;
    /** 将位置写回 nodePositions，与指针拖动使用同一数据源。 */
    onMoveNode?: (nodeId: string, position: Pt, event: KeyboardEvent<HTMLButtonElement>) => void;
    /** 每次移动的画布世界坐标距离，默认 16。 */
    step?: number;
}

const arrows: Readonly<Record<string, Pt | undefined>> = {
    ArrowLeft: { x: -1, y: 0 }, ArrowRight: { x: 1, y: 0 },
    ArrowUp: { x: 0, y: -1 }, ArrowDown: { x: 0, y: 1 },
};

const controlsStyle = css`display: grid; gap: 0.5rem; min-inline-size: 0; margin-block-end: 0.5rem;`;
const nodesStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: 0.25rem; min-inline-size: 0;`;

export function FlowDiagramKeyboardNodes({ nodes, nodeRects, controls, options }: {
    nodes: ElkLayoutNode[];
    nodeRects: Record<string, FlowNodeRect>;
    controls: FlowDiagramControls;
    options: FlowDiagramKeyboardOptions;
}) {
    const [internal, setInternal] = useState<string | null>(null);
    const requested = options.selectedNodeId === undefined ? internal : options.selectedNodeId;
    const selected = nodes.some(node => node.id === requested) ? requested : null;
    const position = selected === null ? undefined : nodeRects[selected];
    const step = options.step && Number.isFinite(options.step) && options.step > 0 ? options.step : 16;
    const move = (nodeId: string, event: KeyboardEvent<HTMLButtonElement>) => {
        const delta = arrows[event.key];
        const rect = nodeRects[nodeId];
        if (!delta || !rect || !options.onMoveNode || selected !== nodeId || event.defaultPrevented) return;
        event.preventDefault();
        event.stopPropagation();
        const next = { x: rect.x + delta.x * step, y: rect.y + delta.y * step };
        options.onMoveNode(nodeId, next, event);
        controls.centerOn({ x: next.x + rect.width / 2, y: next.y + rect.height / 2 });
    };
    if (!nodes.length) return <p role="status">{options.emptyLabel ?? '暂无节点'}</p>;
    return <div className={controlsStyle}>
        <div className={nodesStyle} role="group" aria-label={options.label ?? '流程节点'}>
            {nodes.map(({ id }) => <Button key={id} type="button" size="s" appearance="outlined"
                isSelected={selected === id}
                onFocus={() => { controls.focusNode(id); }}
                onClick={event => {
                    if (options.selectedNodeId === undefined) setInternal(id);
                    options.onSelectNode?.(id, event);
                }}
                onKeyDown={event => move(id, event)}>
                {options.getNodeLabel(id)}
            </Button>)}
        </div>
        <output>{selected !== null && options.getNodeLabel(selected)}
            {position && ` (${position.x}, ${position.y})`}
        </output>
    </div>;
}
