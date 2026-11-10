import { useEffect, useEffectEvent, useLayoutEffect, useRef, useState } from 'react';
import type { InteractionCancelReason, InteractionEvent } from '../types.js';

export interface DiagramInteractionOptions<T> {
    /** 文档身份或修订号；变化时丢弃未提交预览。不要传每次 render 都新建的对象。 */
    revision: string | number | object;
    disabled?: boolean;
    active?: boolean;
    onCommit?: (value: T) => void;
    onCancel?: (value: T, reason: InteractionCancelReason) => void;
    onInteractionChange?: (event: InteractionEvent<T>) => void;
}

export interface DiagramInteraction<T> {
    value: T | null;
    getCurrent: () => T | null;
    begin: (value: T) => boolean;
    update: (value: T) => boolean;
    commit: (value?: T) => boolean;
    cancel: (reason?: InteractionCancelReason) => void;
}

/** 一次手势一次提交。状态只用于预览，持久化与撤销由 onCommit 的调用方负责。 */
export function useDiagramInteraction<T>({ revision, disabled = false, active = true, onCommit, onCancel, onInteractionChange }: DiagramInteractionOptions<T>): DiagramInteraction<T> {
    const [preview, setPreview] = useState<{ value: T; revision: string | number | object } | null>(null);
    // 可变实例：同步处理同一帧内 move/up，避免 React 批处理读到旧预览。
    const session = useRef<{ value: T; revision: unknown } | null>(null);

    function cancel(reason: InteractionCancelReason = 'cancel') {
        const previous = session.current;
        if (!previous) return;
        session.current = null;
        setPreview(null);
        onCancel?.(previous.value, reason);
        onInteractionChange?.({ phase: 'cancel', value: previous.value, reason });
    }

    function valid() {
        if (disabled) { cancel('disabled'); return false; }
        if (!active) { cancel('inactive'); return false; }
        if (session.current && !Object.is(session.current.revision, revision)) { cancel('revision'); return false; }
        return true;
    }

    const cancelFromEffect = useEffectEvent(cancel);
    useLayoutEffect(() => {
        if (disabled) cancelFromEffect('disabled');
        else if (!active) cancelFromEffect('inactive');
        else if (session.current && !Object.is(session.current.revision, revision)) cancelFromEffect('revision');
    }, [revision, disabled, active]);

    useEffect(() => {
        const blur = () => cancelFromEffect('blur');
        const visibility = () => { if (document.hidden) cancelFromEffect('hidden'); };
        const key = (event: KeyboardEvent) => {
            if (event.key === 'Escape' && session.current) { event.preventDefault(); cancelFromEffect('escape'); }
        };
        window.addEventListener('blur', blur);
        window.addEventListener('keydown', key);
        document.addEventListener('visibilitychange', visibility);
        return () => {
            window.removeEventListener('blur', blur);
            window.removeEventListener('keydown', key);
            document.removeEventListener('visibilitychange', visibility);
            cancelFromEffect('unmount');
        };
    }, []);

    return {
        // 修订切换的首次 render 就隐藏旧预览，避免消费方用旧端口读取新文档。
        value: active && !disabled && preview && Object.is(preview.revision, revision) ? preview.value : null,
        /** 仅供事件处理读取，同步于 begin / update。 */
        getCurrent: () => session.current?.value ?? null,
        begin(next: T) {
            if (!valid()) return false;
            cancel('replaced');
            session.current = { value: next, revision };
            setPreview({ value: next, revision });
            onInteractionChange?.({ phase: 'start', value: next });
            return true;
        },
        update(next: T) {
            if (!valid() || !session.current) return false;
            session.current.value = next;
            setPreview({ value: next, revision });
            onInteractionChange?.({ phase: 'preview', value: next });
            return true;
        },
        commit(next?: T) {
            if (!valid() || !session.current) return false;
            const result = next ?? session.current.value;
            session.current = null;
            setPreview(null);
            onCommit?.(result);
            onInteractionChange?.({ phase: 'commit', value: result });
            return true;
        },
        cancel,
    };
}
