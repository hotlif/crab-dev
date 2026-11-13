import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render, userEvent, waitFor } from '@crab-dev/wake/test/react';
import { createRef } from 'react';
import ConfigProvider from '@crab-dev/rc-config-provider';
// 浏览器集成验证使用真实发布产物，确保 Crab CSS 已由 Wake 提取。
import TablePro, { type ProtocolColumnType, type TableProHandle, type TableQuery } from '@crab-dev/rc-table-pro';
import type { Row } from '@crab-dev/rc-table';
import publishedCss from '../../../.cache/browser-css.json';
import { RefreshDemo } from '../../../.cache/sidebar-demo.mjs';

const columns: ProtocolColumnType[] = [{ name: '$.name', title: '名称', dataType: 'text', width: 260 }];
const fetchColumns = async () => columns;

describe('TablePro refresh in a real browser', () => {
    it('locates newly loaded rows immediately after awaiting refresh without issuing another query', async () => {
        const ref = createRef<TableProHandle>();
        let revision = 0;
        let requests = 0;
        const request = async () => {
            requests++;
            const rows: Row[] = Array.from({ length: 100 }, (_, index) => ({
                id: `${revision}-${index}`, dataRef: { name: `Version ${revision} row ${index}` },
            }));
            return { rows, total: rows.length };
        };
        const view = await render(<><style>{publishedCss}</style><button>Outside</button>
            <TablePro ref={ref} style={{ width: 600, height: 300 }} request={request} fetchColumns={fetchColumns} />
        </>);
        try {
            await waitFor(() => expect(view.container.textContent).toContain('Version 0 row 0'));
            const handle = ref.current!;
            const count = requests;
            const outside = view.container.querySelector('button')!;
            await act(() => outside.focus());
            let located!: Promise<boolean>;
            await act(async () => {
                revision = 1;
                await handle.refresh();
                located = handle.scrollToRow('1-90', { align: 'center' });
            });
            expect(await located).toBe(true);
            expect(view.container.textContent).toContain('Version 1 row 90');
            expect(document.activeElement).toBe(outside);
            expect(requests).toBe(count + 1);
            await act(() => { located = handle.scrollToRow('0-90'); });
            expect(await located).toBe(false);
            expect(requests).toBe(count + 1);
            await act(() => handle.focus());
            expect(document.activeElement).toBe(view.container.querySelector('[role="grid"]'));
            expect(ref.current).toBe(handle);
        } finally { await view.unmount(); }
    });

    it('runs the actual demo and shows completion only after refreshing the current page', async () => {
        // 演示请求使用真实 300ms 定时器，响应及 React 提交必须位于异步 act 内。
        const settleRequest = () => act(async () => {
            await new Promise<void>(resolve => setTimeout(resolve, 350));
        });
        const view = await render(<><style>{publishedCss}</style><div style={{ width: 700 }}><RefreshDemo /></div></>);
        try {
            const user = userEvent.setup();
            await settleRequest();
            await waitFor(() => expect(view.container.textContent).toContain('记录 1'));
            await act(() => user.click(view.container.querySelector<HTMLButtonElement>('button[aria-label="页码 2"]')!));
            await settleRequest();
            await waitFor(() => expect(view.container.textContent).toContain('记录 11'));
            const grid = view.container.querySelector('[role="grid"]');
            const button = Array.from(view.container.querySelectorAll('button')).find(item => item.textContent === '更新并刷新')!;
            await act(() => user.click(button));
            expect(view.container.querySelector('[role="status"]')?.textContent).toBe('正在刷新');
            expect(button.disabled).toBe(true);
            await settleRequest();
            await waitFor(() => expect(view.container.querySelector('[role="status"]')?.textContent).toBe('刷新完成，可以继续后续操作'));
            expect(view.container.querySelector('[role="grid"]')).toBe(grid);
            expect(view.container.querySelector('[aria-current="page"]')?.textContent).toBe('2');
            expect(view.container.textContent).toContain('记录 11');
            expect(button.disabled).toBe(false);
            const locate = Array.from(view.container.querySelectorAll('button')).find(item => item.textContent === '定位记录 10')!;
            await act(() => user.click(locate));
            await waitFor(() => expect(view.container.querySelector('[role="status"]')?.textContent).toBe('记录 10 不在当前页'));
            expect(view.container.querySelector('[aria-current="page"]')?.textContent).toBe('2');
            const focus = Array.from(view.container.querySelectorAll('button')).find(item => item.textContent === '聚焦表格')!;
            await act(() => user.click(focus));
            expect(document.activeElement).toBe(grid);
        } finally {
            await view.unmount();
        }
    });

    for (const designSystem of ['md3', 'macos', 'shadcn'] as const) {
        for (const colorMode of ['light', 'dark'] as const) {
            it(`preserves the mounted grid, pagination, selection and focus in ${designSystem}/${colorMode}`, async () => {
                const ref = createRef<TableProHandle>();
                const queries: TableQuery[] = [];
                let revision = 1;
                const request = async (query: TableQuery) => {
                    queries.push(query);
                    const rows: Row[] = Array.from({ length: query.pageSize }, (_, index) => ({
                        id: (query.page - 1) * query.pageSize + index,
                        dataRef: { name: `记录 ${index + 1} / 版本 ${revision}` },
                    }));
                    return { rows, total: 30 };
                };
                const view = await render(<><style>{publishedCss}</style>
                    <ConfigProvider designSystem={designSystem} colorMode={colorMode}>
                        <TablePro ref={ref} style={{ width: 700, height: 420 }} fetchColumns={fetchColumns} request={request}
                            pagination={{}} showSearchBar rowSelection={{ type: 'checkbox' }} />
                    </ConfigProvider>
                </>);
                try {
                    const user = userEvent.setup();
                    await waitFor(() => expect(view.container.textContent).toContain('记录 1 / 版本 1'));
                    const page = view.container.querySelector<HTMLButtonElement>('button[aria-label="页码 2"]')!;
                    await act(() => user.click(page));
                    const rowCheckbox = view.container.querySelector<HTMLInputElement>('input[aria-label="选择行"]');
                    expect(rowCheckbox).not.toBeNull();
                    await act(() => user.click(rowCheckbox!));
                    const search = view.container.querySelector<HTMLInputElement>('input[aria-label="搜索表格"]')!;
                    await act(() => user.click(search));
                    const grid = view.container.querySelector('[role="grid"]');
                    const count = queries.length;
                    revision = 2;
                    await act(() => ref.current!.refresh());
                    await waitFor(() => expect(view.container.textContent).toContain('记录 1 / 版本 2'));
                    expect(queries.length).toBe(count + 1);
                    expect(queries.at(-1)?.page).toBe(2);
                    expect(view.container.querySelector('[role="grid"]')).toBe(grid);
                    expect(view.container.querySelector('input[aria-label="搜索表格"]')).toBe(search);
                    expect(document.activeElement).toBe(search);
                    expect(rowCheckbox!.checked).toBe(true);
                    expect(view.container.querySelector('[aria-current="page"]')?.textContent).toBe('2');
                } finally {
                    await view.unmount();
                }
                expect(ref.current).toBeNull();
            });
        }
    }
});
