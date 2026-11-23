import { clock, describe, expect, it } from '@crab-dev/wake/test';
import type { Row } from '@crab-dev/rc-table';
import { createBlockCache } from '../blockCache.js';
import type { TableBlockQuery, TableDataResult } from '../types.js';

const total = 1_000_000;

function blockResult(query: TableBlockQuery, count = total, label = 'row'): TableDataResult<Row> {
    return {
        total: count,
        rows: Array.from({ length: Math.max(0, Math.min(count, query.endIndex) - query.startIndex) },
            (_, offset) => ({ id: query.startIndex + offset, dataRef: label })),
    };
}

const flush = () => new Promise<void>(resolve => setTimeout(resolve, 0));

function controlledRequests() {
    const pending: {
        query: TableBlockQuery;
        resolve: (result: TableDataResult<Row>) => void;
        reject: (reason: Error) => void;
    }[] = [];
    const errors: Error[] = [];
    const cache = createBlockCache<Row>({
        blockSize: 100,
        maxCachedBlocks: 2,
        maxConcurrentRequests: 2,
        query: { filters: { state: 'open' }, keyword: 'test', sort: [{ columnName: 'id', direction: 'asc' }] },
        onError: error => errors.push(error),
        request: query => new Promise((resolve, reject) => pending.push({ query, resolve, reject })),
    });
    const take = (start: number) => {
        const index = pending.findIndex(({ query }) => query.startIndex === start);
        expect(index).toBeGreaterThanOrEqual(0);
        return pending.splice(index, 1)[0];
    };
    const reply = async (start: number, count = total, label?: string) => {
        const request = take(start);
        request.resolve(blockResult(request.query, count, label));
        await flush();
    };
    return { cache, pending, errors, take, reply };
}

describe('TablePro remote block cache', () => {
    it('coalesces rapid jumps over whole blocks and loads the final viewport', async () => {
        await clock.fake({ exclude: ['microtask'] });
        const requests: number[] = [];
        const cache = createBlockCache<Row>({
            blockSize: 100,
            maxCachedBlocks: 6,
            maxConcurrentRequests: 2,
            query: { filters: {}, sort: [] },
            request: async query => {
                requests.push(query.startIndex);
                return blockResult(query);
            },
            onError: error => { throw error; },
        });
        const whenLoaded = (index: number) => new Promise<void>(resolve => {
            if (cache.getSnapshot().rows.has(index)) {
                resolve();
                return;
            }
            const unsubscribe = cache.subscribe(() => {
                if (!cache.getSnapshot().rows.has(index)) return;
                unsubscribe();
                resolve();
            });
        });
        try {
            cache.start();
            await whenLoaded(0);
            expect(cache.getSnapshot().total).toBe(total);

            for (const startIndex of [100_010, 200_010, 300_010, 400_010]) {
                cache.setRange({ startIndex, endIndex: startIndex + 20 });
                await clock.advanceBy(16);
            }
            expect(requests).toEqual([0, 100_000]);
            await clock.advanceBy(100);
            await whenLoaded(400_029);
            expect(requests).toEqual([0, 100_000, 400_000]);
            expect(cache.getSnapshot().rows.get(400_029)?.id).toBe(400_029);

            cache.setRange({ startIndex: 400_090, endIndex: 400_110 });
            await whenLoaded(400_100);
            expect(requests.at(-1)).toBe(400_100);

            cache.setRange({ startIndex: 500_010, endIndex: 500_030 });
            await clock.advanceBy(16);
            cache.setRange({ startIndex: 600_010, endIndex: 600_030 });
            cache.stop();
            await clock.advanceBy(100);
            expect(requests.at(-1)).toBe(500_000);
        } finally {
            cache.stop();
            await clock.restore();
        }
    });

    it('jumps directly to a distant block and retains only the most recently used blocks', async () => {
        const { cache, pending, reply } = controlledRequests();
        try {
            cache.start();
            await flush();
            expect(pending.map(({ query }) => [query.startIndex, query.endIndex])).toEqual([[0, 100]]);
            await reply(0);
            expect(cache.getSnapshot().total).toBe(total);
            expect(cache.getSnapshot().rows.size).toBe(100);

            cache.setRange({ startIndex: 500_002, endIndex: 500_020 });
            await flush();
            expect(pending.map(({ query }) => [query.startIndex, query.endIndex])).toEqual([[500_000, 500_100]]);
            cache.setRange({ startIndex: 500_004, endIndex: 500_022 });
            await flush();
            expect(pending).toHaveLength(1);
            await reply(500_000);

            const snapshot = cache.getSnapshot();
            cache.setRange({ startIndex: 0, endIndex: 12 });
            await flush();
            expect(cache.getSnapshot()).toBe(snapshot);
            expect(pending).toHaveLength(0);

            cache.setRange({ startIndex: 900_002, endIndex: 900_020 });
            await flush();
            await reply(900_000);
            expect(cache.getSnapshot().rows.size).toBe(200);
            expect(cache.getSnapshot().rows.get(0)?.id).toBe(0);
            expect(cache.getSnapshot().rows.get(500_002)).toBeUndefined();
            expect(cache.getSnapshot().rows.get(900_002)?.id).toBe(900_002);
        } finally {
            cache.stop();
        }
    });

    it('caps parallel requests, keeps overlapping work, and ignores late results from abandoned ranges', async () => {
        const { cache, pending, take, reply, errors } = controlledRequests();
        try {
            cache.start();
            await flush();
            await reply(0);
            cache.setRange({ startIndex: 195, endIndex: 315 });
            await flush();
            expect(pending.map(({ query }) => query.startIndex)).toEqual([100, 200]);

            cache.setRange({ startIndex: 198, endIndex: 310 });
            await flush();
            expect(pending).toHaveLength(2);
            const one = take(100);
            const two = take(200);
            expect(one.query.signal.aborted).toBe(false);
            expect(two.query.signal.aborted).toBe(false);

            cache.setRange({ startIndex: 700_210, endIndex: 700_225 });
            await flush();
            expect(one.query.signal.aborted).toBe(true);
            expect(two.query.signal.aborted).toBe(true);
            expect(pending.map(({ query }) => query.startIndex)).toEqual([700_200]);
            two.reject(new Error('late error'));
            one.resolve(blockResult(one.query));
            await reply(700_200);
            expect(errors).toEqual([]);
            expect(cache.getSnapshot().rows.has(100)).toBe(false);
            expect(cache.getSnapshot().rows.has(700_210)).toBe(true);
        } finally {
            cache.stop();
        }
    });

    it('retries a failed block in place and preserves cached data during refresh and refresh failure', async () => {
        const { cache, pending, errors, take, reply } = controlledRequests();
        try {
            cache.start();
            await flush();
            await reply(0);
            cache.setRange({ startIndex: 95, endIndex: 110 });
            await flush();
            const networkError = new Error('retry this block');
            take(100).reject(networkError);
            await flush();
            expect(cache.getSnapshot().errors.get(1)).toBe(networkError);
            expect(cache.getSnapshot().rows.get(95)?.dataRef).toBe('row');
            cache.setRange({ startIndex: 94, endIndex: 112 });
            await flush();
            expect(pending).toHaveLength(0);
            cache.retry(1);
            cache.retry(1);
            await flush();
            expect(pending).toHaveLength(1);
            await reply(100);

            const refreshed = cache.refresh();
            await flush();
            expect(cache.getSnapshot().refreshing).toBe(true);
            expect(cache.getSnapshot().rows.get(105)?.dataRef).toBe('row');
            await reply(0, total, 'new');
            expect(cache.getSnapshot().rows.get(95)?.dataRef).toBe('row');
            await reply(100, total, 'new');
            await refreshed;
            expect(cache.getSnapshot().rows.get(95)?.dataRef).toBe('new');

            const failed = cache.refresh().catch(error => error);
            await flush();
            take(0).reject(networkError);
            expect(await failed).toBe(networkError);
            await flush();
            expect(errors).toEqual([networkError, networkError]);
            expect(cache.getSnapshot().error).toBe(networkError);
            expect(cache.getSnapshot().rows.get(105)?.dataRef).toBe('new');
        } finally {
            cache.stop();
        }
    });

    it('clamps a refresh to the final blocks when the result shrinks', async () => {
        const { cache, pending, reply } = controlledRequests();
        try {
            cache.start();
            await flush();
            await reply(0);
            cache.setRange({ startIndex: 999_980, endIndex: total });
            await flush();
            await reply(999_900);
            const refreshed = cache.refresh();
            await flush();
            await reply(999_900, 120);
            expect(pending.map(({ query }) => [query.startIndex, query.endIndex])).toEqual([[100, 120]]);
            await reply(100, 120);
            await refreshed;
            expect(cache.getSnapshot().total).toBe(120);
            expect(cache.getSnapshot().rows.has(999_980)).toBe(false);
            expect(cache.getSnapshot().rows.get(119)?.id).toBe(119);
        } finally {
            cache.stop();
        }
    });
});
