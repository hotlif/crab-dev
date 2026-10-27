import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import type { ReactNode } from 'react';
import type { TransformState } from '../transform-types.js';
import type { ViewportProps } from '../viewport.js';

// The DOM environment has no WebGL layout. Capture the demo's real scene
// geometry and interaction callbacks; pixel/focus appearance remains a browser check.
let viewport: ViewportProps;
mock.module('@crab-dev/rc-canvas', () => ({
    Canvas: ({ width, height, children }: { width: number; height: number; children?: ReactNode }) => (
        <div data-canvas-width={width} data-canvas-height={height}>{children}</div>
    ),
    Viewport: (props: ViewportProps) => { viewport = props; return <>{props.children}</>; },
    Group: ({ x, y, rotation, children }: { x: number; y: number; rotation: number; children?: ReactNode }) => (
        <section data-group-x={x} data-group-y={y} data-group-rotation={rotation}>{children}</section>
    ),
    Rect: ({ x, y, width, height, onClick }: { x: number; y: number; width: number; height: number; onClick?: () => void }) => (
        <button type="button" data-rect-x={x} data-rect-y={y} data-rect-width={width} data-rect-height={height} onClick={onClick}>Select shape</button>
    ),
    Text: ({ children }: { children?: ReactNode }) => <span>{children}</span>,
    InfiniteGrid: () => null,
    Transformer: ({ width, onChange, ...state }: TransformState & { onChange: (next: TransformState) => void }) => (
        <button type="button" data-transformer onClick={() => onChange({ ...state, width: width + 20 })}>Resize shape</button>
    ),
}));

let TransformerDemo: (typeof import('../../docs/demos/transformer.demo.js'))['default'];
beforeAll(async () => {
    TransformerDemo = (await mock.import<typeof import('../../docs/demos/transformer.demo.js')>('../../docs/demos/transformer.demo.js')).default;
});

describe('Transformer example scene', () => {
    it('starts with every rotated shape fully inside the actual Canvas dimensions', async () => {
        const { container } = await render(<TransformerDemo />);
        const canvas = container.querySelector<HTMLElement>('[data-canvas-width]')!;
        const rectangles = container.querySelectorAll<HTMLElement>('[data-rect-width]');
        expect(rectangles).toHaveLength(3);
        expect(container.textContent).toContain('矩形 A');
        expect(container.textContent).toContain('矩形 B');
        expect(container.textContent).toContain('矩形 C');
        for (const rectangle of rectangles) {
            const group = rectangle.closest<HTMLElement>('[data-group-x]')!;
            const x = Number(rectangle.dataset.rectX), y = Number(rectangle.dataset.rectY);
            const width = Number(rectangle.dataset.rectWidth), height = Number(rectangle.dataset.rectHeight);
            const rotation = Number(group.dataset.groupRotation), cos = Math.cos(rotation), sin = Math.sin(rotation);
            for (const [cornerX, cornerY] of [[x, y], [x + width, y], [x, y + height], [x + width, y + height]] as const) {
                const screenX = (viewport.zoom ?? 1) * (Number(group.dataset.groupX) + cos * cornerX - sin * cornerY) + (viewport.panX ?? 0);
                const screenY = (viewport.zoom ?? 1) * (Number(group.dataset.groupY) + sin * cornerX + cos * cornerY) + (viewport.panY ?? 0);
                expect(screenX).toBeGreaterThan(0); expect(screenX).toBeLessThan(Number(canvas.dataset.canvasWidth));
                expect(screenY).toBeGreaterThan(0); expect(screenY).toBeLessThan(Number(canvas.dataset.canvasHeight));
            }
        }
    });

    it('keeps user pan and zoom while selecting and resizing a shape', async () => {
        const { container } = await render(<TransformerDemo />);
        const nextViewport = { zoom: 1.25, panX: 350, panY: 240 };
        await act(async () => { viewport.onViewportChange?.(nextViewport); });
        const rectangle = container.querySelector<HTMLElement>('[data-rect-width]')!;
        const width = Number(rectangle.dataset.rectWidth);
        await fireEvent.click(rectangle);
        expect(container.querySelectorAll('[data-transformer]')).toHaveLength(1);
        await fireEvent.click(container.querySelector<HTMLElement>('[data-transformer]')!);
        expect(Number(container.querySelector<HTMLElement>('[data-rect-width]')!.dataset.rectWidth)).toBe(width + 20);
        expect({ zoom: viewport.zoom, panX: viewport.panX, panY: viewport.panY }).toEqual(nextViewport);
    });
});
