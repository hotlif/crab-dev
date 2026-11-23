import { describe, expect, it } from '@crab-dev/wake/test';
import { act, render, userEvent, waitFor } from '@crab-dev/wake/test/react';
import { createRef, type RefObject } from 'react';
import TablePro, { type ProtocolColumnType, type TableBlockQuery, type TableProHandle } from '@crab-dev/rc-table-pro';
import publishedCss from '../../../.cache/browser-css.json';

const total = 1_000_000;
const columns: ProtocolColumnType[] = [
    { name: 'name', title: '名称', dataType: 'text', fixed: 'left', width: 210, sortable: true },
    { name: 'number', title: '流水号', dataType: 'number', width: 500 },
];
const fetchColumns = async () => columns;
const result = (query: TableBlockQuery, count = total) => ({
    total: count,
    rows: Array.from({ length: Math.min(query.endIndex, count) - query.startIndex }, (_, offset) => {
        const index = query.startIndex + offset;
        return { id: index, dataRef: { name: `${query.keyword || '旧'}记录 ${index}`, number: index } };
    }),
});

function deferred() {
    let resolve!: () => void;
    const promise = new Promise<void>(done => { resolve = done; });
    return { resolve, promise };
}

async function jump(ref: RefObject<TableProHandle | null>, index: number) {
    let positioned!: Promise<boolean>;
    await act(() => { positioned = ref.current!.scrollToRowIndex(index, { align: 'center' }); });
    expect(await positioned).toBe(true);
}

describe('TablePro remote blocks in a real browser', () => {
    it('renders a bounded window in a million rows, loads a distant block, and reuses the cache', async () => {
        const ref = createRef<TableProHandle>();
        const queries: TableBlockQuery[] = [];
        const farBlock = deferred();
        const view = await render(<><style>{publishedCss}</style>
            <TablePro ref={ref} fetchColumns={fetchColumns} style={{ width: 580, height: 340 }}
                rowSelection={{ type: 'checkbox' }}
                initialState={{ columnProps: {}, sortColumns: [{ columnName: 'name', direction: 'asc' }], filters: { status: 'open' } }}
                remoteRows={{ rowHeight: 44, maxCachedBlocks: 2, request: async query => {
                    queries.push(query);
                    if (query.startIndex === 900_000) await farBlock.promise;
                    return result(query);
                } }} />
        </>);
        const row = (index: number) => view.container.querySelector(`[data-row-index="${index}"]`);
        try {
            await waitFor(() => expect(row(0)?.textContent).toContain('旧记录 0'));
            expect(view.container.querySelector('[role="grid"]')?.getAttribute('aria-rowcount')).toBe('1000001');
            expect(queries.map(query => query.startIndex)).toEqual([0]);
            expect(queries[0]).toEqual(expect.objectContaining({
                endIndex: 100, filters: { status: 'open' }, sort: [{ columnName: 'name', direction: 'asc' }],
            }));
            await userEvent.setup().click(row(0)!.querySelector('input[type="checkbox"]')!);

            await jump(ref, 900_012);
            await waitFor(() => expect(queries.map(query => query.startIndex)).toEqual([0, 900_000]));
            const placeholder = view.container.querySelector('[data-table-row-placeholder="900012"]')!;
            expect(placeholder.getBoundingClientRect().height).toBe(44);
            expect(view.container.querySelectorAll('[data-table-row-placeholder]').length).toBeLessThanOrEqual(24);
            expect(view.container.querySelector('[data-testid="protocol-table-loading"]')).toBeNull();

            await jump(ref, 900_014);
            expect(queries).toHaveLength(2);
            await act(async () => { farBlock.resolve(); await farBlock.promise; });
            await waitFor(() => expect(row(900_014)?.textContent).toContain('旧记录 900014'));
            expect(row(900_014)?.getAttribute('aria-rowindex')).toBe('900016');
            expect(row(900_014)?.getBoundingClientRect().height).toBe(44);
            expect(view.container.querySelectorAll('[data-row-index]').length).toBeLessThanOrEqual(24);

            await jump(ref, 0);
            await waitFor(() => expect(row(0)?.getAttribute('aria-selected')).toBe('true'));
            expect(queries).toHaveLength(2);
        } finally {
            await view.unmount();
        }
    });

    it('cancels the former search and retries only the failed viewport block', async () => {
        const ref = createRef<TableProHandle>();
        const queries: TableBlockQuery[] = [];
        const obsolete = deferred();
        let failOnce = true;
        const view = await render(<><style>{publishedCss}</style>
            <TablePro ref={ref} fetchColumns={fetchColumns} style={{ width: 580, height: 340 }} showSearchBar
                remoteRows={{ rowHeight: 44, request: async query => {
                    queries.push(query);
                    if (query.startIndex === 800_000) await obsolete.promise;
                    if (query.startIndex === 30_000 && failOnce) {
                        failOnce = false;
                        throw new Error('Temporary block failure');
                    }
                    return result(query, query.keyword ? 200_000 : total);
                } }} />
        </>);
        const row = (index: number) => view.container.querySelector(`[data-row-index="${index}"]`);
        const user = userEvent.setup();
        try {
            await waitFor(() => expect(row(0)?.textContent).toContain('旧记录 0'));
            await jump(ref, 800_014);
            await waitFor(() => expect(queries).toHaveLength(2));
            await user.type(view.container.querySelector<HTMLInputElement>('input[aria-label="搜索全部记录"]')!, '新');
            await waitFor(() => expect(row(0)?.textContent).toContain('新记录 0'));
            expect(queries[1].signal.aborted).toBe(true);
            expect(queries[2]).toEqual(expect.objectContaining({ startIndex: 0, keyword: '新' }));
            await act(async () => { obsolete.resolve(); await obsolete.promise; });
            expect(view.container.querySelector('[role="grid"]')?.getAttribute('aria-rowcount')).toBe('200001');
            expect(row(0)?.textContent).toContain('新记录 0');

            await jump(ref, 30_014);
            const retry = () => view.container.querySelector<HTMLButtonElement>('[data-table-row-placeholder] button');
            await waitFor(() => expect(retry()?.textContent).toContain('重试'));
            expect(view.container.querySelector('[data-testid="protocol-table-data-error"]')).toBeNull();
            await user.click(retry()!);
            await waitFor(() => expect(row(30_014)?.textContent).toContain('新记录 30014'));
            expect(queries.map(query => query.startIndex)).toEqual([0, 800_000, 0, 30_000, 30_000]);
        } finally {
            await view.unmount();
        }
    });
});
