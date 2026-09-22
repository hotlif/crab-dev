import { Circle, Group, Line, Rect } from '@crab-dev/rc-canvas';
import type { Drawing, Point } from './protocol.js';
import { arrowWings, drawingBounds } from './drawing.js';
import { colorCss } from './color.js';

export default function DrawingPreview({ drawing }: { drawing: Drawing }) {
    const { shape, style } = drawing;
    const bounds = drawingBounds(drawing.points);
    let points: Point[] = drawing.points;
    if (shape === 'rectangle') {
        const { x, y, width: w, height: h } = bounds;
        points = [{ x, y }, { x: x + w, y }, { x: x + w, y: y + h }, { x, y: y + h }, { x, y }];
    } else if (shape === 'ellipse') {
        points = Array.from({ length: 97 }, (_, i) => ({ x: bounds.x + bounds.width / 2 * (1 + Math.cos(i * Math.PI / 48)), y: bounds.y + bounds.height / 2 * (1 + Math.sin(i * Math.PI / 48)) }));
    }
    let phase = 0;
    const lines = points.slice(1).map((point, index) => {
        const previous = points[index], offset = phase;
        phase += Math.hypot(point.x - previous.x, point.y - previous.y);
        return <Line key={index} x1={previous.x} y1={previous.y} x2={point.x} y2={point.y} color={colorCss(style.stroke)} lineWidth={style.strokeWidth}
            dashLength={style.dashed ? style.strokeWidth * 4 : 0} gapLength={style.strokeWidth * 2} dashPhase={offset} zIndex={2} />;
    });
    return <Group zIndex={2000000}>
        {shape === 'rectangle' && style.fill && <Rect {...bounds} fill={colorCss(style.fill)} />}
        {shape === 'ellipse' && style.fill && <Group x={bounds.x + bounds.width / 2} y={bounds.y + bounds.height / 2} scaleX={bounds.width / 2} scaleY={bounds.height / 2}>
            <Circle cx={0} cy={0} r={1} fill={colorCss(style.fill)} />
        </Group>}
        {lines}
        {shape === 'arrow' && arrowWings(points[0], points[1], style.strokeWidth).map((wing, index) => <Line key={`wing-${index}`} x1={points[1].x} y1={points[1].y} x2={wing.x} y2={wing.y}
            color={colorCss(style.stroke)} lineWidth={style.strokeWidth} dashLength={style.dashed ? style.strokeWidth * 4 : 0} gapLength={style.strokeWidth * 2} zIndex={2} />)}
    </Group>;
}
