import { afterEach, describe, expect, it, mock, act, renderHook } from "@crab-dev/wake/test/react";
import { useRef } from "react";
import { useMediaQuery } from "../useMediaQuery.js";
import { useSize } from "../useResizeObserver.js";
(globalThis as typeof globalThis & {
    IS_REACT_ACT_ENVIRONMENT?: boolean;
}).IS_REACT_ACT_ENVIRONMENT = true;
// ── useMediaQuery：mock window.matchMedia ──────────────────────────────────
type MediaChangeListener = (e: MediaQueryListEvent) => void;
const createMatchMedia = (initial: boolean) => {
    let listener: MediaChangeListener | null = null;
    const mql = {
        matches: initial,
        media: "",
        addEventListener: (_type: string, l: MediaChangeListener) => {
            listener = l;
        },
        removeEventListener: () => {
            listener = null;
        },
    };
    const emit = (matches: boolean) => {
        mql.matches = matches;
        listener?.({ matches } as MediaQueryListEvent);
    };
    return { mql, emit };
};
describe("useMediaQuery", () => {
    afterEach(() => {
        Reflect.deleteProperty(window, "matchMedia");
    });
    it("反映 matchMedia 的初始匹配结果并订阅变化", async () => {
        const { mql, emit } = createMatchMedia(true);
        window.matchMedia = mock.fn(() => mql) as unknown as typeof window.matchMedia;
        const { result } = await renderHook(() => useMediaQuery("(max-width: 768px)"));
        expect(result.current).toBe(true);
        await act(() => emit(false));
        expect(result.current).toBe(false);
    });
    it("环境无 matchMedia 时降级为 false", async () => {
        Reflect.deleteProperty(window, "matchMedia");
        const { result } = await renderHook(() => useMediaQuery("(max-width: 768px)"));
        expect(result.current).toBe(false);
    });
});
// ── useSize：mock ResizeObserver ───────────────────────────────────────────
type ResizeCallback = (entries: ResizeObserverEntry[], observer: ResizeObserver) => void;
class MockResizeObserver {
    static instances: MockResizeObserver[] = [];
    private cb: ResizeCallback;
    constructor(cb: ResizeCallback) {
        this.cb = cb;
        MockResizeObserver.instances.push(this);
    }
    observe() { }
    unobserve() { }
    disconnect() { }
    trigger(size: {
        width: number;
        height: number;
    }) {
        this.cb([{ contentRect: size } as ResizeObserverEntry], this as unknown as ResizeObserver);
    }
}
describe("useSize", () => {
    afterEach(() => {
        MockResizeObserver.instances = [];
        Reflect.deleteProperty(globalThis, "ResizeObserver");
    });
    it("测量前为 undefined，随 ResizeObserver 回调更新尺寸", async () => {
        globalThis.ResizeObserver =
            MockResizeObserver as unknown as typeof ResizeObserver;
        const el = document.createElement("div");
        const { result } = await renderHook(() => {
            const ref = useRef<HTMLDivElement | null>(el);
            return useSize(ref);
        });
        expect(result.current).toBeUndefined();
        await act(() => {
            MockResizeObserver.instances[0]?.trigger({ width: 100, height: 50 });
        });
        expect(result.current).toEqual({ width: 100, height: 50 });
    });
});
