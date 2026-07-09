import { css } from "@linaria/core";
import { ChevronDown, ChevronUp } from "lucide-react";
import type { PointerEvent } from "react";

import token from "./token.js";
import type { StepDirection } from "./hooks/useSpinner.js";

export interface StepperProps {
    /** 按下某方向按钮（立即走一步并进入长按连续步进） */
    onStart: (direction: StepDirection) => void;
    /** 松开 / 移出，停止连续步进 */
    onStop: () => void;
    /** 已到达上界：禁用「增加」 */
    upDisabled: boolean;
    /** 已到达下界：禁用「减少」 */
    downDisabled: boolean;
    /** 整体禁用（disabled / readOnly） */
    disabled: boolean;
}

// 朴素竖排步进器：待在输入框内右侧（rc-line-edit 的 suffix 槽），紧凑居中、随字体缩放。
// 不脱离输入框自行定位——随输入框宽度走，永不跑出框外。
const rootStyle = css`
    display: inline-flex;
    flex-direction: column;
    flex-shrink: 0;
    height: 1.6em;
    border-radius: ${token.stepper.radius};
    overflow: hidden;
`;

// 上 / 下小按钮：hover 背景反馈，箭头随字体缩放，到边界禁用移除示能。
const halfStyle = css`
    flex: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 0;
    padding: 0 0.25em;
    border: none;
    background: transparent;
    color: ${token.stepper.color};
    cursor: pointer;
    transition: ${token.transition};
    & > svg {
        width: 0.7em;
        height: 0.7em;
    }
    &:hover:not(:disabled) {
        color: ${token.stepper['color-hover']};
        background-color: ${token.stepper['background-hover']};
    }
    &:active:not(:disabled) {
        background-color: ${token.stepper['background-active']};
    }
    &:disabled {
        cursor: not-allowed;
        color: ${token.stepper['color-disabled']};
    }
`;

function Stepper({ onStart, onStop, upDisabled, downDisabled, disabled }: StepperProps) {
    // onPointerDown 阻止默认以保持 input 焦点不被步进按钮夺走
    const bind = (direction: StepDirection) => ({
        onPointerDown: (e: PointerEvent) => {
            e.preventDefault();
            onStart(direction);
        },
        onPointerUp: onStop,
        onPointerLeave: onStop,
        onPointerCancel: onStop,
    });

    return (
        <span className={rootStyle} aria-hidden>
            <button
                type="button"
                tabIndex={-1}
                aria-label="增加"
                disabled={disabled || upDisabled}
                className={halfStyle}
                {...bind(1)}
            >
                <ChevronUp />
            </button>
            <button
                type="button"
                tabIndex={-1}
                aria-label="减少"
                disabled={disabled || downDisabled}
                className={halfStyle}
                {...bind(-1)}
            >
                <ChevronDown />
            </button>
        </span>
    );
}

export default Stepper;
