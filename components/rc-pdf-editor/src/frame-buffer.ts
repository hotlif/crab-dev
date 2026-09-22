import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react';

export interface FrameData { images: ImageBitmap[] }
export interface PreparedFrame<T extends FrameData> {
    id: number; slot: number; key: string; owner: object; data: T; attached: boolean; dispose: () => void;
}
interface FrameBuffer<T extends FrameData> {
    front: PreparedFrame<T> | undefined; back: PreparedFrame<T> | undefined; slots: (PreparedFrame<T> | undefined)[];
    ready: boolean; failed: boolean;
    present: (frame: PreparedFrame<T>) => void; reject: (frame: PreparedFrame<T>, error: unknown) => void; retry: () => void;
}

/** CPU 解码与可见画面分离；只有 Canvas 报告绘制完成才能提升待显示帧。 */
export function useFrameBuffer<T extends FrameData>(owner: object, inputKey: string, load: (signal: AbortSignal) => Promise<T>, onError: (error: unknown) => void): FrameBuffer<T> {
    const [frames, setFrames] = useState<{ front?: PreparedFrame<T>; slots: (PreparedFrame<T> | undefined)[] }>({ slots: [undefined, undefined] });
    const [attempt, setAttempt] = useState(0);
    const [failed, setFailed] = useState(false);
    // 可变实例状态：请求编号仅在 effect 中分配，用于保持两张 Canvas 的挂载身份。
    const sequence = useRef(0);
    const frontSlot = useRef<number | undefined>(undefined);
    const prepare = useEffectEvent(load), report = useEffectEvent(onError);
    const key = `${inputKey}/${attempt}`;
    useEffect(() => {
        const abort = new AbortController();
        let resource: PreparedFrame<T> | undefined;
        setFailed(false);
        void prepare(abort.signal).then(data => {
            let closed = false;
            resource = { id: ++sequence.current, slot: frontSlot.current === 0 ? 1 : 0, owner, key, data, attached: false, dispose: () => {
                if (!closed) { closed = true; data.images.forEach(image => image.close()); }
            } };
            if (abort.signal.aborted) resource.dispose();
            else setFrames(previous => ({ front: previous.front, slots: previous.slots.map((value, slot) => slot === resource!.slot ? resource : value) }));
        }).catch(error => { if (!abort.signal.aborted) { setFailed(true); report(error); } });
        return () => { abort.abort(); if (resource && !resource.attached) resource.dispose(); };
    }, [owner, key]);
    const back = frames.slots.find(frame => frame && frame !== frames.front && frame.owner === owner && frame.key === key);
    const ready = frames.front?.owner === owner && frames.front.key === key;
    function present(frame: PreparedFrame<T>) {
        if (frame !== back || frame.owner !== owner || frame.key !== key) return;
        frontSlot.current = frame.slot;
        setFrames({ front: frame, slots: [0, 1].map(slot => slot === frame.slot ? frame : undefined) });
    }
    function reject(frame: PreparedFrame<T>, error: unknown) {
        if (frame !== back) return;
        setFrames(previous => ({ front: previous.front, slots: previous.slots.map(value => value === frame ? undefined : value) })); setFailed(true); onError(error);
    }
    return { front: frames.front, back, slots: frames.slots, ready, failed, present, reject, retry: () => setAttempt(value => value + 1) };
}

/** 旧场景从缓冲画布移除后才关闭位图；Canvas 持续复用并释放旧 GPU 纹理。 */
export function useFrameLease<T extends FrameData>(frame: PreparedFrame<T> | undefined): void {
    useLayoutEffect(() => {
        if (!frame) return;
        frame.attached = true;
        return () => {
            frame.attached = false;
            // StrictMode 的挂载检查会在同一提交中重新挂载；确认离开 DOM 后再释放。
            queueMicrotask(() => { if (!frame.attached) frame.dispose(); });
        };
    }, [frame]);
}
