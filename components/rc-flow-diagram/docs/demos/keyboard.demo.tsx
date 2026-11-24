import { css } from '@crab-dev/css';
import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import FlowDiagram, { FlowEdge, FlowNode } from '../../src/index.js';

export const meta = {
    title: '键盘选择与移动节点',
    description: '用 Tab 进入节点列表，再用 Enter 或 Space 选中节点。方向键和拖动共享位置与连线。',
};

const nodes = [{ id: 'intake', width: 90, height: 42 }, { id: 'review', width: 90, height: 42 }];
const edge = [{ id: 'signal', source: 'intake', target: 'review' }];
const labels: Record<string, string> = { intake: '进水监测', review: '班次复核' };
const baseline = { intake: { x: 24, y: 68 }, review: { x: 160, y: 120 } };
const scene = css`display: grid; justify-items: start; gap: 0.35rem; max-inline-size: 100%;`;

export default function FlowKeyboardDemo() {
    const [positions, setPositions] = useState(baseline);
    const [selected, setSelected] = useState<string | null>(null);
    const [readOnly, setReadOnly] = useState(false);
    return <div className={scene}>
        <Button size="s" appearance="text" isSelected={readOnly} onClick={() => setReadOnly(value => !value)}>只读模式</Button>
        <FlowDiagram nodes={nodes} edges={edge} width={276} height={220} layoutMode="manual"
            nodePositions={positions} keyboard={{
                label: '巡检节点',
                getNodeLabel: id => labels[id],
                selectedNodeId: selected,
                onSelectNode: setSelected,
                onMoveNode: readOnly ? undefined : (id, point) => setPositions(previous => ({ ...previous, [id]: point })),
            }}>
            {({ nodeRects, routes }) => <>
                {routes.signal && <FlowEdge points={routes.signal.points} />}
                {nodes.map(({ id }) => <FlowNode key={id} {...nodeRects[id]} label={labels[id]}
                    strokeWidth={selected === id ? 3 : 1} draggable={!readOnly} onClick={() => setSelected(id)}
                    onDrag={(dx, dy) => setPositions(previous => {
                        const point = previous[id as keyof typeof previous];
                        return { ...previous, [id]: { x: point.x + dx, y: point.y + dy } };
                    })} />)}
            </>}
        </FlowDiagram>
    </div>;
}
