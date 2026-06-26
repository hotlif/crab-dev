import React, { useRef, useState } from 'react';
import Canvas from '../../src/canvas.js';
import Rect from '../../src/shapes/rect.js';
import Group from '../../src/shapes/group.js';
import Text from '../../src/shapes/text.js';
import type { DragMoveEvent } from '../../src/drag-types.js';

function DraggableCard({
    label,
    initX,
    initY,
    fill,
    getNextZ,
}: {
    label: string;
    initX: number;
    initY: number;
    fill: string;
    getNextZ: () => number;
}) {
    const [pos, setPos] = useState({ x: initX, y: initY });
    const [z, setZ] = useState(0);

    return (
        <Group
            x={pos.x}
            y={pos.y}
            zIndex={z}
            draggable
            hitArea={{ x: 0, y: 0, width: 160, height: 80 }}
            cursor="grab"
            onDragStart={() => setZ(getNextZ())}
            onDrag={({ localDx, localDy }: DragMoveEvent) =>
                setPos(p => ({ x: p.x + localDx, y: p.y + localDy }))
            }
        >
            <Rect x={0} y={0} width={160} height={80} fill={fill} radius={8} />
            <Text x={16} y={24} fontSize={14} fill="#ffffff">{label}</Text>
        </Group>
    );
}

function RotatedDraggable({ getNextZ }: { getNextZ: () => number }) {
    const [pos, setPos] = useState({ x: 300, y: 200 });
    const [z, setZ] = useState(0);

    return (
        <Group x={pos.x} y={pos.y} rotation={Math.PI / 6} zIndex={z}>
            <Rect
                x={0}
                y={0}
                width={120}
                height={60}
                fill="oklch(0.6 0.2 160)"
                radius={6}
                draggable
                cursor="move"
                onDragStart={() => setZ(getNextZ())}
                onDrag={({ canvasFrameDx, canvasFrameDy }: DragMoveEvent) =>
                    setPos(p => ({ x: p.x + canvasFrameDx, y: p.y + canvasFrameDy }))
                }
            />
            <Text x={10} y={18} fontSize={12} fill="#ffffff">旋转 30°</Text>
        </Group>
    );
}

export default function DraggableDemo() {
    const maxZRef = useRef(0);
    const getNextZ = () => ++maxZRef.current;

    return (
        <Canvas width={600} height={400} style={{ border: '1px solid #e0e0e0', borderRadius: 8 }}>
            <DraggableCard label="卡片 A" initX={40} initY={60} fill="oklch(0.55 0.2 260)" getNextZ={getNextZ} />
            <DraggableCard label="卡片 B" initX={140} initY={120} fill="oklch(0.55 0.2 30)" getNextZ={getNextZ} />
            <RotatedDraggable getNextZ={getNextZ} />
        </Canvas>
    );
}
