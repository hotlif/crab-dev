import { describe, expect, it, mock } from '@crab-dev/wake/test';
import { act, fireEvent, render } from '@crab-dev/wake/test/react';
import { createRef } from 'react';
import ConfigProvider from '@crab-dev/rc-config-provider';
import type { ColumnType, Row, TableHandle, TableScrollToRowOptions } from '../../types.js';
// 几何与焦点验收必须使用真实发布 CSS 和虚拟滚动实现。
import Table from '../../../esm/index.mjs';
import compiledCss from '../../../.cache/browser-css.json';

const rows: Row[] = Array.from({ length: 100 }, (_, index) => ({ id: index, height: index % 2 ? 40 : 20, dataRef: { name: `Record ${index}` } }));
const columns: ColumnType<Row>[] = [{ name: '$.name', title: 'Name', width: 800 }];
const settle = () => act(async () => {
    await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())));
});

describe('Table handle published geometry', () => {
    for (const designSystem of ['md3', 'macos', 'shadcn'] as const) {
        it(`${designSystem}: aligns variable-height rows around sticky content and preserves horizontal scrolling and focus`, async () => {
            const ref = createRef<TableHandle>();
            const selection = mock.fn();
            const view = await render(<><style>{compiledCss}</style><button>Outside</button>
                <ConfigProvider designSystem={designSystem}>
                    <Table ref={ref} rows={rows} columns={columns} width={400} height={240} headerRowHeight={32}
                        showSummary summaryRowHeight={28} onSelectCellsChange={selection} />
                </ConfigProvider>
            </>);
            try {
                await settle();
                const root = view.container.querySelector<HTMLElement>('[role="grid"]')!;
                const scroller = root.firstElementChild!.firstElementChild as HTMLElement;
                const outside = view.container.querySelector('button')!;
                await act(async () => { outside.focus(); scroller.scrollLeft = 100; await fireEvent(scroller, new Event('scroll', { bubbles: true })); });
                await settle();
                const horizontal = scroller.scrollLeft;
                const scroll = async (id: number, align?: TableScrollToRowOptions['align']) => {
                    let promise!: Promise<boolean>;
                    await act(() => { promise = ref.current!.scrollToRow(id, { align }); });
                    const result = await promise;
                    await settle();
                    return result;
                };
                for (const align of ['start', 'center', 'end'] as const) {
                    expect(await scroll(50, align)).toBe(true);
                    const target = root.querySelector<HTMLElement>('[data-row-index="50"]')!.getBoundingClientRect();
                    const bounds = scroller.getBoundingClientRect();
                    const top = bounds.top + 32, bottom = bounds.top + 240 - 28;
                    const expected = align === 'start' ? top : align === 'end' ? bottom - target.height : (top + bottom - target.height) / 2;
                    expect(Math.abs(target.top - expected)).toBeLessThan(2);
                    expect(scroller.scrollLeft).toBe(horizontal);
                    expect(document.activeElement).toBe(outside);
                }
                await scroll(50, 'start');
                const before = scroller.scrollTop;
                expect(await scroll(51)).toBe(true);
                expect(scroller.scrollTop).toBe(before);
                expect(await scroll(999)).toBe(false);
                expect(scroller.scrollTop).toBe(before);
                await scroll(99, 'end');
                const last = root.querySelector<HTMLElement>('[data-row-index="99"]')!.getBoundingClientRect();
                expect(Math.abs(last.bottom - (scroller.getBoundingClientRect().top + 212))).toBeLessThan(2);
                await act(() => ref.current!.focus());
                expect(document.activeElement).toBe(root);
                expect(scroller.scrollLeft).toBe(horizontal);
                expect(selection).not.toHaveBeenCalled();
            } finally { await view.unmount(); }
        });
    }
});
