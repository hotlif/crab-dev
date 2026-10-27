import { canvasViewportStyle, canvasFrameStyle, demoStackStyle, demoHintStyle } from "../demo-layout.js";
import { useState } from 'react';
import { Canvas, Rect, Group, Text, Viewport, InfiniteGrid, Transformer, type TransformState } from '@crab-dev/rc-canvas';
export const meta = {
    title: "Transformer",
    description: "初始视口完整显示三个形状；点击形状后拖拽手柄缩放与旋转，也可平移和缩放画布。",
};
interface ShapeData {
    id: number;
    label: string;
    fill: string;
    state: TransformState;
}

const INITIAL_SHAPES: ShapeData[] = [
    {
        id: 1,
        label: '矩形 A',
        fill: 'oklch(0.55 0.2 260)',
        state: { x: -220, y: -80, width: 180, height: 100, rotation: 0 },
    },
    {
        id: 2,
        label: '矩形 B',
        fill: 'oklch(0.55 0.2 30)',
        state: { x: 60, y: -120, width: 140, height: 120, rotation: 0.3 },
    },
    {
        id: 3,
        label: '矩形 C',
        fill: 'oklch(0.55 0.2 140)',
        state: { x: -60, y: 80, width: 200, height: 80, rotation: -0.2 },
    },
];

export default function TransformerDemo() {
    const [shapes, setShapes] = useState<ShapeData[]>(INITIAL_SHAPES);
    const [selectedId, setSelectedId] = useState<number | null>(null);
    const [viewport, setViewport] = useState({ zoom: 1, panX: 400, panY: 260 });

    const updateShape = (id: number, next: TransformState) => {
        setShapes(prev => prev.map(s => s.id === id ? { ...s, state: next } : s));
    };

    return (
        <div className={demoStackStyle}>
            <div className={demoHintStyle}>
                点击形状选中 · 拖拽边框移动 · 拖拽角/边 handle 缩放 · 拖拽顶部圆圈旋转 · 点击空白取消选中
            </div>
            <div className={canvasViewportStyle} role="region" aria-label={`${meta.title}画布，可横向滚动`} tabIndex={0}>

                <Canvas
                    width={800}
                    height={520}
                    className={canvasFrameStyle}
                    onEmptyClick={() => setSelectedId(null)}
                >
                    <Viewport {...viewport} onViewportChange={setViewport} minZoom={0.1} maxZoom={8}>
                        <InfiniteGrid baseSpacing={50} subdivisions={5} originColor="oklch(0.55 0.2 260)" />

                        {shapes.map(shape => {
                            const { state } = shape;
                            // Group 以 x/y 为平移原点，rotation 绕 Group 原点旋转
                            // Transformer 以中心为 Group 锚点，children 需相对于中心偏移
                            return (
                                <Group key={shape.id} x={state.x + state.width / 2} y={state.y + state.height / 2} rotation={state.rotation}>
                                    {/* 主体形状，偏移到以中心为原点的局部坐标系 */}
                                    <Rect
                                        x={-state.width / 2}
                                        y={-state.height / 2}
                                        width={state.width}
                                        height={state.height}
                                        fill={shape.fill}
                                        radius={8}
                                        onClick={() => setSelectedId(shape.id)}
                                        cursor="pointer"
                                    />
                                    <Text
                                        x={-state.width / 2 + 14}
                                        y={-state.height / 2 + 22}
                                        fontSize={13}
                                        fill="#ffffff"
                                    >
                                        {shape.label}
                                    </Text>
                                </Group>
                            );
                        })}

                        {/* Transformer 覆盖在选中形状上 */}
                        {shapes.map(shape => selectedId === shape.id && (
                            <Transformer
                                key={shape.id}
                                {...shape.state}
                                zIndex={100}
                                onChange={next => updateShape(shape.id, next)}
                            />
                        ))}
                    </Viewport>
                </Canvas>

            </div>
        </div>
    );
}
