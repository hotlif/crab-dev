import { useRef, useState } from 'react';
import Canvas from '../../src/canvas.js';
import Rect from '../../src/shapes/rect.js';
import Circle from '../../src/shapes/circle.js';
import Group from '../../src/shapes/group.js';
import Text from '../../src/shapes/text.js';
import Viewport from '../../src/viewport.js';
import InfiniteGrid from '../../src/shapes/infinite-grid.js';
import Minimap from '../../src/shapes/minimap.js';
import type { DragMoveEvent } from '../../src/drag-types.js';

interface CardData {
    id: number;
    x: number;
    y: number;
    label: string;
    fill: string;
}

const INITIAL_CARDS: CardData[] = [
    { id: 1, x: -300, y: -150, label: '节点 A', fill: 'oklch(0.55 0.2 260)' },
    { id: 2, x: 50,   y: -200, label: '节点 B', fill: 'oklch(0.55 0.2 30)' },
    { id: 3, x: 250,  y: 50,   label: '节点 C', fill: 'oklch(0.55 0.2 140)' },
    { id: 4, x: -150, y: 180,  label: '节点 D', fill: 'oklch(0.55 0.2 320)' },
    { id: 5, x: 400,  y: -100, label: '节点 E', fill: 'oklch(0.55 0.2 60)' },
    { id: 6, x: -400, y: 100,  label: '节点 F', fill: 'oklch(0.55 0.2 200)' },
    { id: 7, x: 100,  y: 250,  label: '节点 G', fill: 'oklch(0.55 0.2 350)' },
];

function DraggableCard({
    data,
    getNextZ,
}: {
    data: CardData;
    getNextZ: () => number;
}) {
    const [pos, setPos] = useState({ x: data.x, y: data.y });
    const [z, setZ] = useState(0);

    return (
        <Group x={pos.x} y={pos.y} zIndex={z}>
            <Rect
                x={0} y={0} width={160} height={72}
                fill={data.fill}
                radius={10}
                draggable
                cursor="grab"
                onDragStart={() => setZ(getNextZ())}
                onDrag={({ localDx, localDy }: DragMoveEvent) =>
                    setPos(p => ({ x: p.x + localDx, y: p.y + localDy }))
                }
            />
            <Text x={16} y={26} fontSize={14} fill="#ffffff">{data.label}</Text>
            <Text x={16} y={50} fontSize={11} fill="rgba(255,255,255,0.65)">
                {`(${Math.round(pos.x)}, ${Math.round(pos.y)})`}
            </Text>
        </Group>
    );
}

const CLUSTERS: { cx: number; cy: number; color: string }[] = [
    { cx: -600, cy: -300, color: 'oklch(0.65 0.2 280)' },
    { cx: 600,  cy: 300,  color: 'oklch(0.65 0.2 120)' },
];

function CircleCluster({ cx, cy, color }: { cx: number; cy: number; color: string }) {
    return (
        <Group x={cx} y={cy}>
            {Array.from({ length: 6 }, (_, i) => {
                const angle = (i / 6) * Math.PI * 2;
                return (
                    <Circle
                        key={i}
                        cx={Math.cos(angle) * 60}
                        cy={Math.sin(angle) * 60}
                        r={18}
                        fill={color}
                        stroke="#ffffff"
                        strokeWidth={2}
                    />
                );
            })}
            <Circle cx={0} cy={0} r={24} fill="oklch(0.35 0.08 250)" />
        </Group>
    );
}

export default function MinimapDemo() {
    const maxZRef = useRef(1);
    const getNextZ = () => ++maxZRef.current;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 13, color: '#666', padding: '4px 0' }}>
                滚轮缩放 · 拖拽空白区域平移 · 拖拽节点移动 · 右下角 Minimap 显示全局视图
            </div>
            <Canvas
                width={800}
                height={520}
                style={{ border: '1px solid #e0e0e0', borderRadius: 8, background: '#fafafa' }}
            >
                <Viewport minZoom={0.08} maxZoom={8}>
                    <InfiniteGrid baseSpacing={50} subdivisions={5} color="#d8d8d8" />
                    {INITIAL_CARDS.map(card => (
                        <DraggableCard key={card.id} data={card} getNextZ={getNextZ} />
                    ))}
                    {CLUSTERS.map(cl => (
                        <CircleCluster key={`${cl.cx},${cl.cy}`} {...cl} />
                    ))}
                </Viewport>
                <Minimap position="bottom-right" padding={12} width={180} height={120} />
            </Canvas>
        </div>
    );
}
