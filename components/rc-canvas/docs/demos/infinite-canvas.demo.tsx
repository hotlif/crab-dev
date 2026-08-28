import { useRef, useState } from 'react';
import Canvas from '../../src/canvas.js';
import Rect from '../../src/shapes/rect.js';
import Circle from '../../src/shapes/circle.js';
import Group from '../../src/shapes/group.js';
import Text from '../../src/shapes/text.js';
import Viewport from '../../src/viewport.js';
import InfiniteGrid from '../../src/shapes/infinite-grid.js';
import type { DragMoveEvent } from '../../src/drag-types.js';
export const meta = {
    title: "Infinite Canvas",
    description: "Infinite Canvas 示例",
};
interface CardData {
    id: number;
    x: number;
    y: number;
    label: string;
    fill: string;
}

const INITIAL_CARDS: CardData[] = [
    { id: 1, x: -200, y: -100, label: '卡片 A', fill: 'oklch(0.55 0.2 260)' },
    { id: 2, x: 50,   y: -150, label: '卡片 B', fill: 'oklch(0.55 0.2 30)' },
    { id: 3, x: 150,  y: 80,   label: '卡片 C', fill: 'oklch(0.55 0.2 140)' },
    { id: 4, x: -100, y: 120,  label: '卡片 D', fill: 'oklch(0.55 0.2 320)' },
    { id: 5, x: 300,  y: -50,  label: '卡片 E', fill: 'oklch(0.55 0.2 60)' },
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
                x={0} y={0} width={160} height={80}
                fill={data.fill}
                radius={10}
                draggable
                cursor="grab"
                onDragStart={() => setZ(getNextZ())}
                onDrag={({ localDx, localDy }: DragMoveEvent) =>
                    setPos(p => ({ x: p.x + localDx, y: p.y + localDy }))
                }
            />
            <Text x={16} y={28} fontSize={14} fill="#ffffff">{data.label}</Text>
            <Text x={16} y={52} fontSize={11} fill="rgba(255,255,255,0.7)">
                {`(${Math.round(pos.x)}, ${Math.round(pos.y)})`}
            </Text>
        </Group>
    );
}

function CircleCluster() {
    return (
        <Group x={-400} y={200}>
            {Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const r = 80;
                return (
                    <Circle
                        key={i}
                        cx={Math.cos(angle) * r}
                        cy={Math.sin(angle) * r}
                        r={20}
                        fill={`oklch(0.65 0.25 ${i * 45})`}
                        stroke="#ffffff"
                        strokeWidth={2}
                    />
                );
            })}
            <Circle cx={0} cy={0} r={28} fill="oklch(0.4 0.1 250)" />
            <Text x={-16} y={6} fontSize={12} fill="#ffffff">中心</Text>
        </Group>
    );
}

export default function InfiniteCanvasDemo() {
    const maxZRef = useRef(1);
    const getNextZ = () => ++maxZRef.current;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <div style={{ fontSize: 13, color: '#666', padding: '4px 0' }}>
                滚轮缩放 · 拖拽空白区域平移 · 拖拽卡片移动
            </div>
            <Canvas
                width={800}
                height={520}
                style={{ border: '1px solid #e0e0e0', borderRadius: 8, background: '#fafafa' }}
            >
                <Viewport minZoom={0.1} maxZoom={8}>
                    <InfiniteGrid baseSpacing={50} subdivisions={5} color="#cccccc" originColor="oklch(0.55 0.2 260)" />
                    {INITIAL_CARDS.map(card => (
                        <DraggableCard key={card.id} data={card} getNextZ={getNextZ} />
                    ))}
                    <CircleCluster />
                </Viewport>
            </Canvas>
        </div>
    );
}
