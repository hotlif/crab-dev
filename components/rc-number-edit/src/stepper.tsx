import { css, cx } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import { Minus, Plus } from "lucide-react";
import type { MouseEvent, PointerEvent } from "react";

import token, { vars } from "./token.js";
import type { StepDirection } from "./hooks/useSpinner.js";

export interface StepperProps {
    size: "small" | "middle" | "large";
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
    /** 与步进操作关联的 spinbutton ID */
    inputId: string;
}

// M3 没有独立数字字段；复用文本图标按钮，桌面跟随尺寸档，粗指针保留 48px 目标。
const rootStyle = css`
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    gap: ${token.stepper.gap};
`;

const actionStyle = css`
    && {
        flex-shrink: 0;
        min-width: ${token.stepper.action['min-width']};
        width: ${token.stepper.action.width};
        height: ${token.stepper.action.height};
        padding: 0;
        color: ${token.stepper.color};
    }
    && svg {
        width: ${token.stepper.icon.width};
        height: ${token.stepper.icon.width};
    }
    @media (pointer: coarse) {
        && {
            min-width: ${token.stepper.action.touch['min-width']};
            width: ${token.stepper.action.touch.width};
            height: ${token.stepper.action.touch.height};
        }
    }
`;

const sizeStyles = {
    small: css`
        ${vars['stepper.action.min-width']}: ${token.size.small.action.width};
        ${vars['stepper.action.width']}: ${token.size.small.action.width};
        ${vars['stepper.action.height']}: ${token.size.small.action.width};
    `,
    middle: css`
        ${vars['stepper.action.min-width']}: ${token.size.middle.action.width};
        ${vars['stepper.action.width']}: ${token.size.middle.action.width};
        ${vars['stepper.action.height']}: ${token.size.middle.action.width};
    `,
    large: css`
        ${vars['stepper.action.min-width']}: ${token.size.large.action.width};
        ${vars['stepper.action.width']}: ${token.size.large.action.width};
        ${vars['stepper.action.height']}: ${token.size.large.action.width};
    `,
};

function Stepper({ size, onStart, onStop, upDisabled, downDisabled, disabled, inputId }: StepperProps) {
    // 指针按下立即步进并启动长按；后续 click 只处理键盘与辅助技术的合成激活，
    // 避免真实指针在 pointerdown 和 click 各步进一次。
    const bind = (direction: StepDirection) => ({
        onPointerDown: (_event: PointerEvent<HTMLButtonElement>) => {
            onStart(direction);
        },
        onPointerUp: onStop,
        onPointerLeave: onStop,
        onPointerCancel: onStop,
        onClick: (event: MouseEvent<HTMLButtonElement>) => {
            if (event.detail === 0) {
                onStart(direction);
                onStop();
            }
        },
    });

    return (
        <span className={cx(rootStyle, sizeStyles[size])}>
            <Button
                type="button"
                aria-label="增加"
                aria-controls={inputId}
                disabled={disabled || upDisabled}
                appearance="text"
                size="small"
                shape="circle"
                icon={<Plus aria-hidden="true" />}
                className={actionStyle}
                {...bind(1)}
            />
            <Button
                type="button"
                aria-label="减少"
                aria-controls={inputId}
                disabled={disabled || downDisabled}
                appearance="text"
                size="small"
                shape="circle"
                icon={<Minus aria-hidden="true" />}
                className={actionStyle}
                {...bind(-1)}
            />
        </span>
    );
}

export default Stepper;
