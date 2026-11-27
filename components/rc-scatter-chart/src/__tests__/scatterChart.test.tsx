import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';

// Keep the DOM tests focused on public controls; the browser tests mount the real WebGL canvas.
mock.module('@crab-dev/rc-canvas', () => ({
    Canvas: ({ tabIndex }: { tabIndex?: number }) => <canvas tabIndex={tabIndex} />,
    Circle: () => null,
    Line: () => null,
    Rect: () => null,
    Text: () => null,
}));
let ScatterChart: typeof import('../scatterChart.js')['default'];
beforeAll(async () => {
    ScatterChart = (await mock.import<typeof import('../scatterChart.js')>('../scatterChart.js')).default;
});

describe('ScatterChart data and accessible controls', () => {
    it('formats each axis independently and includes only finite coordinate pairs in the table and controls', async () => {
        const series = [{ name: 'Batch', data: [
            { x: 0, y: -3.5, label: 'Origin' }, { x: Infinity, y: 7, label: 'Invalid X' },
            { x: 4, y: Number.NaN, label: 'Invalid Y' }, { x: 2.5, y: 0 },
        ] }];
        const view = await render(<ConfigProvider locale="en-US">
            <ScatterChart series={series} aria-label="Sample measurements" labels={{ x: 'Time', y: 'Rate' }}
                formatX={value => `${value}ms`} formatY={value => `${value}%`} />
        </ConfigProvider>);
        const table = view.container.querySelector('table')!;
        expect(table.caption?.textContent).toBe('Sample measurements');
        expect(Array.from(table.querySelectorAll('thead th'), cell => cell.textContent)).toEqual(['Series', 'Point', 'Time', 'Rate']);
        const rows = Array.from(table.querySelectorAll<HTMLTableRowElement>('tbody tr'), row => Array.from(row.cells, cell => cell.textContent));
        expect(rows).toEqual([['Batch', 'Origin', '0ms', '-3.5%'], ['Batch', 'Point 4', '2.5ms', '0%']]);
        expect(screen.getByRole('button', { name: 'Batch Origin Time 0ms Rate -3.5%' }).tabIndex).toBe(0);
        expect(view.container.querySelectorAll('button')).toHaveLength(2);
    });

    it('allows separate keyboard access to overlapping points and preserves the original point object on activation', async () => {
        const first = { x: 7, y: -4, label: 'First' };
        const twin = { x: 7, y: -4, label: 'Twin' };
        const onPointClick = mock.fn();
        const view = await render(<ScatterChart series={[{ name: 'Samples', data: [first, twin] }]} onPointClick={onPointClick} />);
        const start = screen.getByRole('button', { name: 'Samples First X 7 Y -4' });
        const next = screen.getByRole('button', { name: 'Samples Twin X 7 Y -4' });
        expect(view.container.querySelectorAll('button[tabindex="0"]')).toHaveLength(1);
        await act(() => start.focus());
        await fireEvent.keyDown(start, { key: 'ArrowRight' });
        expect(document.activeElement).toBe(next);
        expect(next.tabIndex).toBe(0);
        await fireEvent.click(next);
        expect(onPointClick).toHaveBeenCalledWith({ seriesIndex: 0, pointIndex: 1, seriesName: 'Samples', point: twin });
        expect(onPointClick.calls.calls[0]?.[0]?.point).toBe(twin);
        await fireEvent.keyDown(next, { key: 'Home' });
        expect(document.activeElement).toBe(start);
        await fireEvent.keyDown(start, { key: 'End' });
        expect(document.activeElement).toBe(next);
    });

    it('retains legend choices and reports current input indices after filtering and reordering', async () => {
        const onPointClick = mock.fn();
        const measurement = { x: -5, y: 6, label: 'Valid' };
        const batch = { name: 'Batch', data: [{ x: Number.NaN, y: 2 }, measurement] };
        const control = { name: 'Control', data: [{ x: -4, y: 1, label: 'Reference' }] };
        const view = await render(<ScatterChart series={[control, batch]} onPointClick={onPointClick} />);
        await fireEvent.click(screen.getByRole('button', { name: 'Control', pressed: true }));
        expect(screen.queryByRole('button', { name: 'Control Reference X -4 Y 1' })).toBeNull();
        expect(view.container.querySelectorAll('table tbody tr')).toHaveLength(2);
        await fireEvent.click(screen.getByRole('button', { name: 'Batch Valid X -5 Y 6' }));
        expect(onPointClick).toHaveBeenCalledWith({ seriesIndex: 1, pointIndex: 1, seriesName: 'Batch', point: measurement });
        await view.rerender(<ScatterChart series={[{ ...batch, data: [measurement] }, control]} onPointClick={onPointClick} />);
        expect(screen.getByRole('button', { name: 'Control', pressed: false })).toBeDefined();
        await fireEvent.click(screen.getByRole('button', { name: 'Batch Valid X -5 Y 6' }));
        expect(onPointClick).toHaveBeenCalledWith({ seriesIndex: 0, pointIndex: 0, seriesName: 'Batch', point: measurement });
    });

    it('shows the empty state when no finite observations remain', async () => {
        const view = await render(<ScatterChart series={[]} />);
        expect(view.container.querySelector('canvas')).toBeNull();
        await view.rerender(<ScatterChart series={[{ name: 'Missing', data: [{ x: 0, y: Infinity }] }]} />);
        expect(view.container.querySelector('canvas')).toBeNull();
        expect(view.container.querySelector('button')).toBeNull();
    });
});
