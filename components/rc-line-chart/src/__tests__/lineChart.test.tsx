import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';

// The DOM suite exercises the chart's own accessible controls. The browser suite
// mounts the published Canvas and checks the drawing and pointer hit testing.
mock.module('@crab-dev/rc-canvas', () => ({
    Canvas: ({ tabIndex }: { tabIndex?: number }) => <canvas tabIndex={tabIndex} />,
    Circle: () => null,
    Line: () => null,
    Rect: () => null,
    Text: () => null,
}));
let LineChart: typeof import('../lineChart.js')['default'];
beforeAll(async () => {
    LineChart = (await mock.import<typeof import('../lineChart.js')>('../lineChart.js')).default;
});

describe('LineChart accessible data and controls', () => {
    it('preserves missing and non-finite observations as gaps, while formatting real zeroes', async () => {
        const categories = ['Measured', 'Missing', 'Invalid', 'Short'];
        const series = [{ name: 'Sales', data: [0, null, Number.NaN] }];
        const view = await render(
            <ConfigProvider locale="en-US">
                <LineChart categories={categories} series={series} formatValue={value => `$${value}`} />
            </ConfigProvider>,
        );
        const table = view.container.querySelector('table')!;
        expect(table.caption?.textContent).toBe('Line chart');
        expect(Array.from(table.querySelectorAll('tbody td'), cell => cell.textContent)).toEqual(['$0', '—', '—', '—']);
        expect(table.querySelector('thead th')?.textContent).toBe('Category');
        expect(screen.getByRole('button', { name: 'Measured $0' }).tabIndex).toBe(0);
        expect(view.container.querySelectorAll('button')).toHaveLength(1);
    });

    it('moves the single tab stop over finite observations and clears stale data on update', async () => {
        const firstSeries = [{ name: 'Sales', data: [4, null, 9, -3] }];
        const view = await render(<LineChart categories={['A', 'B', 'C', 'D']} series={firstSeries} />);
        const first = screen.getByRole('button', { name: 'A 4' });
        const middle = screen.getByRole('button', { name: 'C 9' });
        const last = screen.getByRole('button', { name: 'D -3' });
        expect(view.container.querySelectorAll('button[tabindex="0"]')).toHaveLength(1);
        await act(() => first.focus());
        await fireEvent.keyDown(first, { key: 'ArrowRight' });
        expect(document.activeElement).toBe(middle);
        expect(middle.tabIndex).toBe(0);
        await fireEvent.keyDown(middle, { key: 'End' });
        expect(document.activeElement).toBe(last);
        await fireEvent.keyDown(last, { key: 'Home' });
        expect(document.activeElement).toBe(first);
        await fireEvent.keyDown(first, { key: 'End' });
        const tooltipTitle = () => view.container.querySelector('[aria-hidden="true"] > div:first-child')?.textContent;
        expect(tooltipTitle()).toBe('D');
        await fireEvent.keyDown(last, { key: 'Escape' });
        expect(tooltipTitle()).toBeUndefined();
        await view.rerender(<LineChart categories={['A']} series={[{ name: 'Sales', data: [8] }]} />);
        expect(screen.getByRole('button', { name: 'A 8' }).tabIndex).toBe(0);
        expect(screen.queryByRole('button', { name: 'C 9' })).toBeNull();
    });

    it('keeps the table complete and reports original series indices after a legend toggle', async () => {
        const onPointClick = mock.fn();
        const series = [{ name: 'Current', data: [4, null] }, { name: 'Previous', data: [6, 8] }];
        const view = await render(<LineChart categories={['Mon', 'Tue']} series={series} onPointClick={onPointClick}
            aria-label="Weekly sales" labels={{ legend: 'Compare series', category: 'Day' }} />);
        const legend = screen.getByRole('group', { name: 'Compare series' });
        const current = screen.getByRole('button', { name: 'Current', pressed: true });
        expect(legend.contains(current)).toBe(true);
        await fireEvent.click(current);
        expect(current.getAttribute('aria-pressed')).toBe('false');
        expect(screen.queryByRole('button', { name: 'Mon Current 4' })).toBeNull();
        const table = view.container.querySelector('table')!;
        expect(table.caption?.textContent).toBe('Weekly sales');
        expect(Array.from(table.querySelectorAll('thead th'), cell => cell.textContent)).toEqual(['Day', 'Current', 'Previous']);
        await fireEvent.click(screen.getByRole('button', { name: 'Tue Previous 8' }));
        expect(onPointClick).toHaveBeenCalledWith({
            categoryIndex: 1, seriesIndex: 1, category: 'Tue', seriesName: 'Previous', value: 8,
        });
        await fireEvent.click(screen.getByRole('button', { name: 'Previous', pressed: true }));
        expect(document.querySelectorAll('button[tabindex="0"]')).toHaveLength(0);
        await fireEvent.click(current);
        expect(screen.getByRole('button', { name: 'Mon Current 4' }).tabIndex).toBe(0);
    });

    it('keeps legend choices by series after a reorder and shows the last remaining series', async () => {
        const sales = { name: 'Sales', data: [3] };
        const orders = { name: 'Orders', data: [6] };
        const view = await render(<LineChart categories={['Mon']} series={[sales, orders]} />);
        await fireEvent.click(screen.getByRole('button', { name: 'Sales', pressed: true }));
        await view.rerender(<LineChart categories={['Mon']} series={[orders, sales]} />);
        expect(screen.getByRole('button', { name: 'Sales', pressed: false })).toBeTruthy();
        expect(screen.queryByRole('button', { name: 'Mon Sales 3' })).toBeNull();
        expect(screen.getByRole('button', { name: 'Mon Orders 6' })).toBeTruthy();
        await view.rerender(<LineChart categories={['Mon']} series={[sales]} />);
        expect(screen.queryByRole('button', { name: 'Sales' })).toBeNull();
        expect(screen.getByRole('button', { name: 'Mon 3' }).tabIndex).toBe(0);
    });

    it('renders an empty state for an absent series or an entirely missing trend', async () => {
        const view = await render(<LineChart categories={['A']} series={[]} />);
        expect(view.container.querySelector('canvas')).toBeNull();
        await view.rerender(<LineChart categories={['A', 'B']} series={[{ name: 'Sales', data: [null, Infinity] }]} />);
        expect(view.container.querySelector('canvas')).toBeNull();
        expect(view.container.querySelector('button')).toBeNull();
    });
});
