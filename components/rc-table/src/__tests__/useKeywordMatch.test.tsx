import { afterEach, beforeEach, clock, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, renderHook } from "@crab-dev/wake/test/react";
import { useLayoutEffect } from "react";
import type { VirtualHandle } from "@crab-dev/rc-virtual";
import { useKeywordMatch } from "../hooks/useKeywordMatch.js";
import type { Row } from "../types.js";

type MatchParams = Parameters<typeof useKeywordMatch<Row>>[0];

const makeParams = (rowCount: number): MatchParams => ({
    highlightKeyword: "alpha",
    activeMatchIndex: 0,
    displayRows: Array.from({ length: rowCount }, (_, index) => ({
        id: index,
        dataRef: { value: index === 1 ? "alpha alpha beta" : "other" },
    })),
    bottomColumns: [{ name: "value", title: "Value", width: 120 }],
    skipCellSet: new Set(),
    getCellKey: (rowIndex, columnIndex) => `${rowIndex}:${columnIndex}`,
    reservedTopPx: 32,
    fixedLeftWidth: 0,
});

const finishScan = () => act(async () => { await clock.advanceBy(10_000); });

async function mountMatch(params: MatchParams) {
    const scrollToCell = mock.fn<VirtualHandle["scrollToCell"]>();
    const handle: VirtualHandle = {
        scrollToCell,
        scrollTo: () => {},
        getScrollCellPosition: () => ({ rowIndex: 0, columnIndex: 0 }),
    };
    const view = await renderHook((props: MatchParams) => {
        const match = useKeywordMatch(props);
        useLayoutEffect(() => {
            match.virtualRef.current = handle;
            return () => { match.virtualRef.current = null; };
        }, [match.virtualRef]);
        return match;
    }, { initialProps: params });
    await finishScan();
    return { ...view, scrollToCell };
}

beforeEach(async () => { await clock.fake(); });
afterEach(async () => { await clock.restore(); });

it("locates a reselected keyword when the intervening chunked scan was cancelled", async () => {
    const params = makeParams(5_001);
    const view = await mountMatch(params);
    await view.rerender({ ...params, highlightKeyword: "beta" });
    expect(view.result.current.activeMatchMeta).toBeNull();
    await view.rerender(params);
    await finishScan();
    expect(view.scrollToCell).toHaveBeenCalledTimes(2);
    await view.unmount();
});

for (const rowCount of [3, 5_001]) {
    describe(`keyword navigation with ${rowCount} rows`, () => {
        it("does not scroll again when refreshed data and columns retain the active match", async () => {
            const params = makeParams(rowCount);
            const view = await mountMatch(params);
            expect(view.scrollToCell).toHaveBeenCalledTimes(1);
            await view.rerender({
                ...params,
                displayRows: params.displayRows.map((row, index) => ({
                    ...row, dataRef: { value: index === 1 ? "alpha alpha beta" : "refreshed" },
                })),
                bottomColumns: params.bottomColumns.map(column => ({ ...column })),
                skipCellSet: new Set(),
                getCellKey: (rowIndex, columnIndex) => `${rowIndex}:${columnIndex}`,
            });
            await finishScan();
            expect(view.result.current.activeMatchMeta).toEqual({ rowIndex: 1, columnIndex: 0, occurrenceInCell: 0 });
            expect(view.scrollToCell).toHaveBeenCalledTimes(1);
            await view.unmount();
        });

        it("locates a changed occurrence or keyword even in the same cell", async () => {
            const params = makeParams(rowCount);
            const view = await mountMatch(params);
            await view.rerender({ ...params, activeMatchIndex: 1 });
            await finishScan();
            expect(view.scrollToCell).toHaveBeenCalledTimes(2);
            await view.rerender(params);
            await finishScan();
            expect(view.scrollToCell).toHaveBeenCalledTimes(3);
            await view.rerender({ ...params, highlightKeyword: "beta" });
            await finishScan();
            expect(view.scrollToCell).toHaveBeenCalledTimes(4);
            expect(view.scrollToCell).toHaveBeenLastCalledWith({ rowIndex: 1, columnIndex: 0, topOffset: 32, leftOffset: 0 });
            await view.unmount();
        });

        it("locates the match again after clearing, deselecting or losing it", async () => {
            const params = makeParams(rowCount);
            const view = await mountMatch(params);
            const inactiveStates: MatchParams[] = [
                { ...params, highlightKeyword: "" },
                { ...params, activeMatchIndex: undefined },
                { ...params, displayRows: params.displayRows.map(row => ({ ...row, dataRef: { value: "other" } })) },
            ];
            let calls = 1;
            for (const inactive of inactiveStates) {
                await view.rerender(inactive);
                await finishScan();
                expect(view.scrollToCell).toHaveBeenCalledTimes(calls);
                await view.rerender(params);
                await finishScan();
                expect(view.scrollToCell).toHaveBeenCalledTimes(++calls);
            }
            await view.unmount();
        });

        it("locates a match whose row position or identity changed during refresh", async () => {
            const params = makeParams(rowCount);
            const view = await mountMatch(params);
            const displayRows = [...params.displayRows];
            [displayRows[1], displayRows[2]] = [displayRows[2], displayRows[1]];
            await view.rerender({ ...params, displayRows });
            await finishScan();
            expect(view.scrollToCell).toHaveBeenCalledTimes(2);
            expect(view.scrollToCell).toHaveBeenLastCalledWith({ rowIndex: 2, columnIndex: 0, topOffset: 32, leftOffset: 0 });
            await view.rerender({ ...params, displayRows: displayRows.map(row => ({ ...row, id: `new-${row.id}` })) });
            await finishScan();
            expect(view.scrollToCell).toHaveBeenCalledTimes(3);
            await view.unmount();
        });
    });
}
