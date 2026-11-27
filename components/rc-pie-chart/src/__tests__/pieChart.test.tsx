import { beforeAll, describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render, screen } from '@crab-dev/wake/test/react';
import ConfigProvider from '@crab-dev/rc-config-provider';

// DOM tests exercise the chart's accessible controls. The browser suite draws actual sectors.
mock.module('@crab-dev/rc-canvas', () => ({
    Canvas: ({ tabIndex }: { tabIndex?: number }) => <canvas tabIndex={tabIndex} />,
    Circle: () => null,
}));
let PieChart: typeof import('../pieChart.js')['default'];
beforeAll(async () => {
    PieChart = (await mock.import<typeof import('../pieChart.js')>('../pieChart.js')).default;
});

const data = [
    { name: 'Unknown', value: Infinity },
    { name: 'Direct', value: 3 },
    { name: 'Search', value: 1 },
];

describe('PieChart accessible data and controls', () => {
    it('exposes original rows, custom labels and the share of the visible total', async () => {
        const view = await render(<ConfigProvider locale="en-US"><PieChart data={data}
            aria-label="Traffic sources" labels={{ legend: 'Filter sources', category: 'Source', value: 'Visits', percentage: 'Portion' }}
            formatValue={value => `${value} visits`} /></ConfigProvider>);
        const table = view.container.querySelector('table')!;
        expect(table.caption?.textContent).toBe('Traffic sources');
        expect(Array.from(table.querySelectorAll('thead th'), cell => cell.textContent)).toEqual(['Source', 'Visits', 'Portion']);
        const rows = () => Array.from(table.querySelectorAll<HTMLTableRowElement>('tbody tr'), row => Array.from(row.cells, cell => cell.textContent));
        expect(rows()).toEqual([['Unknown', '—', '—'], ['Direct', '3 visits', '75%'], ['Search', '1 visits', '25%']]);
        const legend = screen.getByRole('group', { name: 'Filter sources' });
        const direct = screen.getByRole('button', { name: 'Direct', pressed: true });
        expect(legend.contains(direct)).toBe(true);
        await fireEvent.click(direct);
        expect(rows()).toEqual([['Unknown', '—', '—'], ['Direct', '3 visits', '—'], ['Search', '1 visits', '100%']]);
    });

    it('uses one tab stop across sectors, navigates by keyboard and reports the original index', async () => {
        const onSliceClick = mock.fn();
        const view = await render(<PieChart data={data} onSliceClick={onSliceClick} />);
        const direct = screen.getByRole('button', { name: 'Direct 3 75%' });
        const search = screen.getByRole('button', { name: 'Search 1 25%' });
        expect(view.container.querySelectorAll('button[tabindex="0"]')).toHaveLength(1);
        expect(direct.tabIndex).toBe(0);
        await act(() => direct.focus());
        await fireEvent.keyDown(direct, { key: 'ArrowRight' });
        expect(document.activeElement).toBe(search);
        expect(search.tabIndex).toBe(0);
        await fireEvent.keyDown(search, { key: 'Home' });
        expect(document.activeElement).toBe(direct);
        await fireEvent.keyDown(direct, { key: 'End' });
        expect(document.activeElement).toBe(search);
        await fireEvent.click(search);
        expect(onSliceClick).toHaveBeenCalledWith({ index: 2, name: 'Search', value: 1, percentage: 25 });
        await fireEvent.click(screen.getByRole('button', { name: 'Direct', pressed: true }));
        await fireEvent.click(screen.getByRole('button', { name: 'Search 1 100%' }));
        expect(onSliceClick).toHaveBeenCalledWith({ index: 2, name: 'Search', value: 1, percentage: 100 });
        await fireEvent.click(screen.getByRole('button', { name: 'Search', pressed: true }));
        expect(view.container.querySelectorAll('button[tabindex="0"]')).toHaveLength(0);
        await fireEvent.click(screen.getByRole('button', { name: 'Search', pressed: false }));
        expect(screen.getByRole('button', { name: 'Search 1 100%' }).tabIndex).toBe(0);
    });

    it('shows an empty state for a dataset without positive finite values and recovers when data arrives', async () => {
        const view = await render(<PieChart data={[]} />);
        expect(view.container.querySelector('canvas')).toBeNull();
        await view.rerender(<PieChart data={[0, -5, Infinity, NaN].map((value, index) => ({ name: String(index), value }))} />);
        expect(view.container.querySelector('canvas')).toBeNull();
        expect(view.container.querySelector('button')).toBeNull();
        await view.rerender(<ConfigProvider locale="en-US"><PieChart data={data} /></ConfigProvider>);
        expect(view.container.querySelector('canvas')).toBeTruthy();
        expect(view.container.querySelector('caption')?.textContent).toBe('Pie chart');
        expect(screen.getByRole('button', { name: 'Direct 3 75%' }).tabIndex).toBe(0);
    });

    it('keeps legend filters and keyboard focus on their categories across a reorder', async () => {
        const onSliceClick = mock.fn();
        const view = await render(<PieChart data={data} onSliceClick={onSliceClick} />);
        await fireEvent.click(screen.getByRole('button', { name: 'Direct', pressed: true }));
        const search = screen.getByRole('button', { name: 'Search 1 100%' });
        await act(() => search.focus());
        await view.rerender(<PieChart data={[data[2]!, data[0]!, data[1]!]} onSliceClick={onSliceClick} />);
        expect(screen.getByRole('button', { name: 'Direct', pressed: false })).toBeTruthy();
        expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Search 1 100%' }));
        await fireEvent.click(search);
        expect(onSliceClick).toHaveBeenCalledWith({ index: 0, name: 'Search', value: 1, percentage: 100 });
    });
});
