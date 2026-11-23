import type { Row, TableRowRange } from '@crab-dev/rc-table';
import type { TableBlockQuery, TableBlockRequest, TableDataResult } from './types.js';

interface BlockCacheOptions<T extends Row> {
    blockSize: number;
    maxCachedBlocks: number;
    maxConcurrentRequests: number;
    query: Omit<TableBlockQuery, 'startIndex' | 'endIndex' | 'signal'>;
    request: TableBlockRequest<T>;
    onError: (error: Error) => void;
}

type Block<T extends Row> = { rows: T[] } | { error: Error };
type Summary<T extends Row> = TableDataResult<T>['summary'];
type BlockBounds = { first: number; last: number };

const RANGE_SETTLE_MS = 80;

interface CacheData<T extends Row> {
    total?: number;
    summary?: Summary<T>;
    blocks: Map<number, Block<T>>;
}

interface BlockSnapshot<T extends Row> {
    total?: number;
    summary?: Summary<T>;
    rows: ReadonlyMap<number, T>;
    errors: ReadonlyMap<number, Error>;
    error: Error | null;
    refreshing: boolean;
}

interface Refresh<T extends Row> {
    previous: CacheData<T>;
    resolve: () => void;
    reject: (error: Error) => void;
}

export interface BlockCache<T extends Row> {
    getSnapshot: () => BlockSnapshot<T>;
    subscribe: (listener: () => void) => () => void;
    start: () => void;
    stop: () => void;
    setRange: (range: TableRowRange) => void;
    retry: (block: number) => void;
    refresh: () => Promise<void>;
}

/**
 * Owns one query's requests and its LRU. Derive queued work from the latest range
 * instead of keeping a queue of every block the user scrolled past.
 */
export function createBlockCache<T extends Row>(options: BlockCacheOptions<T>): BlockCache<T> {
    let active = false;
    let range: TableRowRange = { startIndex: 0, endIndex: 1 };
    let data: CacheData<T> = { blocks: new Map() };
    const inFlight = new Map<number, AbortController>();
    const listeners = new Set<() => void>();
    let pendingRefresh: Refresh<T> | undefined;
    let queryError: Error | null = null;
    let publishQueued = false;
    let lastDistantMiss: number | undefined;
    let deferredLoad: ReturnType<typeof setTimeout> | undefined;
    let snapshot: BlockSnapshot<T> = { rows: new Map(), errors: new Map(), error: null, refreshing: false };

    function getSnapshot(): BlockSnapshot<T> {
        return snapshot;
    }

    function subscribe(listener: () => void): () => void {
        listeners.add(listener);
        return () => { listeners.delete(listener); };
    }

    function start(): void {
        active = true;
        if (snapshot.refreshing) publish();
        loadRange();
    }

    function stop(): void {
        active = false;
        cancelDeferredLoad();
        lastDistantMiss = undefined;
        abortRequests();
        if (pendingRefresh) {
            data = pendingRefresh.previous;
            pendingRefresh.reject(new globalThis.DOMException('The query changed or the table unmounted', 'AbortError'));
            pendingRefresh = undefined;
        }
    }

    function setRange(nextRange: TableRowRange): void {
        if (!active || nextRange.endIndex <= nextRange.startIndex) return;
        const previous = bounds();
        range = nextRange;
        const next = bounds();
        if (next.first === previous.first && next.last === previous.last) return;
        for (let block = next.first; block <= next.last; block++) {
            const cached = data.blocks.get(block);
            if (!cached) continue;
            data.blocks.delete(block);
            data.blocks.set(block, cached);
        }
        if (trim(next)) publish();

        // Load the first jump immediately. Consecutive misses that skip whole
        // blocks are likely transient during a scrollbar sweep.
        const skippedBlocks = next.first > previous.last + 1 || next.last < previous.first - 1;
        const now = Date.now();
        const distantMiss = skippedBlocks && data.total !== undefined && !pendingRefresh && !queryError && hasMissingBlock(next);
        const movingQuickly = distantMiss && lastDistantMiss !== undefined && now - lastDistantMiss < RANGE_SETTLE_MS;
        lastDistantMiss = distantMiss ? now : undefined;
        cancelDeferredLoad();
        if (movingQuickly) {
            deferredLoad = setTimeout(() => {
                deferredLoad = undefined;
                loadRange();
            }, RANGE_SETTLE_MS);
        }
        loadRange();
    }

    function retry(block: number): void {
        const entry = data.blocks.get(block);
        if (!active || !entry || !('error' in entry)) return;
        cancelDeferredLoad();
        lastDistantMiss = undefined;
        data.blocks.delete(block);
        publish();
        loadRange();
    }

    function refresh(): Promise<void> {
        if (!active) return Promise.reject(new globalThis.DOMException('The table is unmounted', 'AbortError'));
        const previous = pendingRefresh?.previous ?? data;
        pendingRefresh?.reject(new globalThis.DOMException('Refresh was superseded', 'AbortError'));
        cancelDeferredLoad();
        lastDistantMiss = undefined;
        abortRequests();
        data = { blocks: new Map() };
        queryError = null;
        const promise = new Promise<void>((resolve, reject) => {
            pendingRefresh = { previous, resolve, reject };
        });
        publish();
        loadRange();
        return promise;
    }

    function bounds(): BlockBounds {
        const { blockSize } = options;
        const { startIndex, endIndex } = range;
        const { total } = data;
        if (total === undefined) {
            const first = Math.floor(startIndex / blockSize);
            return { first, last: first };
        }
        if (total === 0) return { first: 0, last: -1 };
        // A refresh may shrink the dataset and clamp the virtual viewport to the end.
        const length = endIndex - startIndex;
        const start = Math.min(startIndex, Math.max(0, total - length));
        const end = Math.min(start + length, total);
        return { first: Math.floor(start / blockSize), last: Math.floor((end - 1) / blockSize) };
    }

    function abortRequests(): void {
        for (const controller of inFlight.values()) controller.abort();
        inFlight.clear();
    }

    function cancelDeferredLoad(): void {
        if (deferredLoad === undefined) return;
        clearTimeout(deferredLoad);
        deferredLoad = undefined;
    }

    function hasMissingBlock({ first, last }: BlockBounds): boolean {
        for (let block = first; block <= last; block++) {
            if (!data.blocks.has(block)) return true;
        }
        return false;
    }

    function trim({ first, last }: BlockBounds): boolean {
        const { blocks } = data;
        const capacity = Math.max(options.maxCachedBlocks, last - first + 1);
        let changed = false;
        for (const block of blocks.keys()) {
            if (blocks.size <= capacity) break;
            if (block < first || block > last) {
                blocks.delete(block);
                changed = true;
            }
        }
        return changed;
    }

    function loadRange(): void {
        if (!active || queryError) return;
        const { first, last } = bounds();
        for (const [block, controller] of inFlight) {
            if (block >= first && block <= last) continue;
            inFlight.delete(block);
            controller.abort();
        }
        if (deferredLoad !== undefined) return;

        let complete = data.total !== undefined;
        for (let block = first; block <= last; block++) {
            if (data.blocks.has(block)) continue;
            complete = false;
            if (inFlight.has(block)) continue;
            if (inFlight.size >= options.maxConcurrentRequests) break;
            requestBlock(block);
        }
        if (complete && pendingRefresh) {
            const { resolve } = pendingRefresh;
            pendingRefresh = undefined;
            publish();
            resolve();
        }
    }

    function requestBlock(block: number): void {
        const { blockSize, query, request } = options;
        const startIndex = block * blockSize;
        const endIndex = Math.min(startIndex + blockSize, data.total ?? Number.MAX_SAFE_INTEGER);
        const controller = new AbortController();
        const { signal } = controller;
        inFlight.set(block, controller);
        // Defer the caller's request until the current commit is finished.
        void Promise.resolve().then(() => {
            signal.throwIfAborted();
            return request({
                ...query, filters: { ...query.filters }, sort: query.sort.map(column => ({ ...column })),
                startIndex, endIndex, signal,
            });
        }).then(result => {
            if (inFlight.get(block) !== controller) return;
            const { rows, total, summary } = result;
            const expected = Math.max(0, Math.min(endIndex, total) - startIndex);
            if (!Number.isSafeInteger(total) || total < 0 || !Array.isArray(rows) || rows.length !== expected) {
                fail(block, controller, new Error('Invalid remote row count for the requested range'));
                return;
            }
            if (data.total !== undefined && total !== data.total) {
                fail(block, controller, new Error('The remote row count changed. Refresh the query to load the new result.'), true);
                return;
            }
            inFlight.delete(block);
            data.total = total;
            data.summary ??= summary;
            if (rows.length > 0) data.blocks.set(block, { rows });
            trim(bounds());
            if (!pendingRefresh) publish();
            loadRange();
        }, reason => fail(block, controller, reason));
    }

    function fail(block: number, controller: AbortController, reason: unknown, queryChanged = false): void {
        if (inFlight.get(block) !== controller) return;
        inFlight.delete(block);
        const error = reason instanceof Error ? reason : new Error(String(reason));
        if (pendingRefresh) {
            const { previous, reject } = pendingRefresh;
            pendingRefresh = undefined;
            abortRequests();
            data = previous;
            queryError = error;
            reject(error);
        } else if (data.total === undefined || queryChanged) {
            abortRequests();
            queryError = error;
        } else {
            data.blocks.set(block, { error });
            trim(bounds());
        }
        publish();
        loadRange();
        options.onError(error);
    }

    function publish(): void {
        if (publishQueued) return;
        publishQueued = true;
        // Snapshot mutations are coalesced; scrolling within a cached block publishes nothing.
        queueMicrotask(() => {
            publishQueued = false;
            if (!active) return;
            const visibleData = pendingRefresh?.previous ?? data;
            const rows = new Map<number, T>();
            const errors = new Map<number, Error>();
            for (const [block, entry] of visibleData.blocks) {
                if ('error' in entry) errors.set(block, entry.error);
                else {
                    const start = block * options.blockSize;
                    entry.rows.forEach((row, offset) => rows.set(start + offset, row));
                }
            }
            snapshot = {
                total: visibleData.total, summary: visibleData.summary, rows, errors,
                error: queryError, refreshing: pendingRefresh !== undefined,
            };
            listeners.forEach(listener => listener());
        });
    }

    return { getSnapshot, subscribe, start, stop, setRange, retry, refresh };
}
