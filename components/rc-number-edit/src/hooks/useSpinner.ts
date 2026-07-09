import { useEffect, useRef } from "react";

export type StepDirection = 1 | -1;

export interface UseSpinnerOptions {
    /** 单步触发回调（方向 +1 / -1，是否走大步长） */
    onStep: (direction: StepDirection, large: boolean) => void;
    /** 是否禁用（disabled / readOnly，或已到达对应边界） */
    disabled?: boolean;
    /** 长按后进入连续步进前的初始延迟（ms），默认 400（多尔蒂阈值内） */
    initialDelay?: number;
    /** 连续步进的最小间隔（ms），默认 60 */
    minInterval?: number;
}

export interface SpinnerHandlers {
    /** 按下步进按钮：立即走一步，随后长按进入加速连续步进 */
    start: (direction: StepDirection, large?: boolean) => void;
    /** 松开 / 移出：停止连续步进 */
    stop: () => void;
}

/**
 * 步进按钮的长按连续加速逻辑。
 *
 * 鼠标 / 触摸按住 +/- 时：先立即走一步 → 停顿 `initialDelay` → 进入连续步进，
 * 间隔从 200ms 逐次收窄至 `minInterval`（加速手感）。键盘单次步进不经此 Hook。
 */
export function useSpinner(options: UseSpinnerOptions): SpinnerHandlers {
    const { onStep, disabled, initialDelay = 400, minInterval = 60 } = options;

    // 例外①（可变实例状态 ref，MUST 手动）：定时器句柄与当前加速间隔跨事件持有、
    // 不应触发渲染，是 useRef 的本职，与记忆化无关。
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const intervalRef = useRef<number>(200);

    // 例外②（latest-ref 模式，有意取舍）：定时器回调需读取最新的 onStep / disabled
    // （onStep 闭包捕获着最新 min/max/当前值），却不希望它们进入依赖而重建定时器。
    // 渲染期写 ref 会使本 Hook 对编译器降级——这是"精确控制触发时机"换"自动记忆化"。
    const onStepRef = useRef(onStep);
    onStepRef.current = onStep;
    const disabledRef = useRef(disabled);
    disabledRef.current = disabled;

    const clear = (): void => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const start = (direction: StepDirection, large = false): void => {
        if (disabledRef.current) {
            return;
        }
        clear();
        onStepRef.current(direction, large); // 立即走一步
        intervalRef.current = 200;
        const schedule = (delay: number): void => {
            timerRef.current = setTimeout(() => {
                if (disabledRef.current) {
                    clear();
                    return;
                }
                onStepRef.current(direction, large);
                intervalRef.current = Math.max(minInterval, Math.round(intervalRef.current * 0.8));
                schedule(intervalRef.current);
            }, delay);
        };
        schedule(initialDelay);
    };

    const stop = (): void => {
        clear();
    };

    // 卸载时清理未决定时器，避免泄漏与卸载后触发
    useEffect(() => () => {
        if (timerRef.current !== null) {
            clearTimeout(timerRef.current);
        }
    }, []);

    return { start, stop };
}
