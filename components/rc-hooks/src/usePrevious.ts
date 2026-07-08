import { useEffect, useRef } from "react";

/**
 * 返回上一次渲染提交时的值；首次渲染返回 `undefined`。ref 在提交阶段（effect）更新，
 * 不在渲染期写 ref，故不违反 Rules of React。
 */
export function usePrevious<T>(value: T): T | undefined {
    const ref = useRef<T | undefined>(undefined);

    useEffect(() => {
        ref.current = value;
    }, [value]);

    return ref.current;
}
