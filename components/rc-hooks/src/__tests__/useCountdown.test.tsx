import { afterEach, beforeEach, clock, describe, expect, it, mock } from "@crab-dev/wake/test";
import { act, renderHook } from "@crab-dev/wake/test/react";
import { useCountdown } from "../useCountdown.js";

beforeEach(async () => { await clock.fake(); });
afterEach(async () => { await clock.restore(); });
const advance = (time: number) => act(async () => { await clock.advanceBy(time); });

describe("useCountdown", () => {
    it("pauses, resumes the remaining time and reads the latest callback", async () => {
        const first = mock.fn();
        const latest = mock.fn();
        const view = await renderHook(({ paused, callback }) => useCountdown(1000, paused, callback), {
            initialProps: { paused: false, callback: first },
        });
        await advance(400);
        await view.rerender({ paused: true, callback: latest });
        expect(view.result.current).toBe(600);
        await advance(2000);
        expect(first).not.toHaveBeenCalled();
        expect(latest).not.toHaveBeenCalled();
        await view.rerender({ paused: false, callback: latest });
        await advance(599);
        expect(latest).not.toHaveBeenCalled();
        await advance(1);
        expect(latest).toHaveBeenCalledTimes(1);
        await view.unmount();
    });

    it("resets a changed duration, supports persistent notices and clears on unmount", async () => {
        const finish = mock.fn();
        const view = await renderHook(({ duration }) => useCountdown(duration, false, finish), { initialProps: { duration: 1000 } });
        await advance(400);
        await view.rerender({ duration: 2000 });
        await advance(1999);
        expect(finish).not.toHaveBeenCalled();
        await view.rerender({ duration: 0 });
        await advance(5000);
        expect(finish).not.toHaveBeenCalled();
        await view.rerender({ duration: 100 });
        await view.unmount();
        await advance(1000);
        expect(finish).not.toHaveBeenCalled();
    });
});
