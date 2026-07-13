import { css, cx } from '@linaria/core';
import type { Ref, SVGAttributes } from 'react';

import token from './token.js';
import type { SpinSize } from './types.js';

/* ────────────────────────────────── 尺寸 ──────────────────────────────────
 *
 * 尺寸经 --rc-spin-size / --rc-spin-font-size 两个自定义属性下发, 而非硬编码在元素上：
 * 宿主（Spin 根节点、或 rc-button 这类自带语义的消费方）设变量, 指示环与提示文案一并跟随。
 * 因此 SpinIndicator 的 size 是**可选**的——不传即完全交由外部变量决定尺寸。
 */

const sizeSmallStyle = css`
    --rc-spin-size: ${token.size.small.size};
    --rc-spin-font-size: ${token.size.small['font-size']};
`;

const sizeMiddleStyle = css`
    --rc-spin-size: ${token.size.middle.size};
    --rc-spin-font-size: ${token.size.middle['font-size']};
`;

const sizeLargeStyle = css`
    --rc-spin-size: ${token.size.large.size};
    --rc-spin-font-size: ${token.size.large['font-size']};
`;

export const sizeStyleOf = (size: SpinSize): string => {
    if (size === 'small') return sizeSmallStyle;
    if (size === 'large') return sizeLargeStyle;
    return sizeMiddleStyle;
};

/* ────────────────────────────────── 指示环 ────────────────────────────────── */

const ringStyle = css`
    display: block;
    inline-size: var(--rc-spin-size, ${token.size.middle.size});
    block-size: var(--rc-spin-size, ${token.size.middle.size});
    animation: rc-spin-rotate ${token.motion.duration} ${token.motion.easing} infinite;

    @keyframes rc-spin-rotate {
        to {
            transform: rotate(360deg);
        }
    }

    @keyframes rc-spin-breathe {
        0%,
        100% {
            opacity: 1;
        }
        50% {
            opacity: ${token.motion['reduced-opacity']};
        }
    }

    /* 加载指示器是耗时操作的唯一反馈：reduce 下若一并停掉动画, 界面就"死"了。
       故此处不做 animation: none, 而是降级为低频呼吸——去掉旋转的前庭刺激,
       保留"仍在进行"的意符。 */
    @media (prefers-reduced-motion: reduce) {
        animation-name: rc-spin-breathe;
        animation-duration: ${token.motion['reduced-duration']};
        animation-timing-function: ease-in-out;
    }
`;

const ringTrackStyle = css`
    fill: none;
    stroke: ${token.ring['track-color']};
    stroke-width: ${token.ring['stroke-width']};
`;

const ringIndicatorStyle = css`
    fill: none;
    stroke: ${token.ring['indicator-color']};
    stroke-width: ${token.ring['stroke-width']};
    stroke-linecap: round;
    stroke-dasharray: ${token.ring.dash};

    /* 强制配色下自定义描边被抹除, 用系统高亮色保住"高亮弧"与底环的区分 */
    @media (forced-colors: active) {
        stroke: Highlight;
    }
`;

export interface SpinIndicatorProps extends Omit<SVGAttributes<SVGSVGElement>, 'children'> {
    /**
     * 尺寸。缺省时不写入尺寸变量, 由外层的 --rc-spin-size 决定（可为 1em 等相对值）
     */
    size?: SpinSize;

    /**
     * 根节点 ref
     */
    ref?: Ref<SVGSVGElement>;
}

/**
 * 纯视觉的旋转指示环——**不带任何无障碍语义**。
 *
 * 供本身已声明加载语义的宿主复用（如 rc-button 的 loading 态已有 `aria-busy`）：
 * 若在其中再嵌一个 role="status" + aria-live 的 {@link Spin}, 读屏会把"加载中"播报两次。
 * 需要状态语义时请直接用 `Spin`, 而非本组件。
 *
 * 颜色与尺寸均可由消费方经 CSS 变量覆写：
 * `--rc-spin-size`、`--spin-ring-indicator-color`、`--spin-ring-track-color`。
 */
const SpinIndicator = ({ size, className, ref, ...restProps }: SpinIndicatorProps) => (
    <svg
        {...restProps}
        ref={ref}
        className={cx(ringStyle, size !== undefined && sizeStyleOf(size), className)}
        viewBox="0 0 50 50"
        aria-hidden="true"
        focusable="false"
    >
        <circle className={ringTrackStyle} cx="25" cy="25" r="20" />
        <circle className={ringIndicatorStyle} cx="25" cy="25" r="20" />
    </svg>
);

export default SpinIndicator;
