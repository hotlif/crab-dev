import { css, cx } from "@crab-dev/css";
import type { HTMLAttributes, Ref } from "react";

import { sizeStyleOf } from "./indicator.js";
import token from "./token.js";
import type { SpinSize } from "./types.js";

const expressiveStyle = css`
    display: block;
    position: relative;
    inline-size: var(--rc-spin-size, ${token.size.middle.width});
    block-size: var(--rc-spin-size, ${token.size.middle.width});
    color: ${token.expressive.color};
    animation: rc-spin-expressive-orbit ${token.expressive.orbit['animation-duration']} linear infinite;

    &::before {
        content: "";
        position: absolute;
        top: ${token.expressive.shape.top};
        left: ${token.expressive.shape.left};
        width: ${token.expressive.shape.width};
        height: ${token.expressive.shape.height};
        background: currentColor;
        border-radius: 50%;
        animation: rc-spin-expressive-morph ${token.expressive.shape['animation-duration']} ${token.expressive.shape['animation-timing-function']} infinite;
    }

    @keyframes rc-spin-expressive-orbit {
        to { transform: rotate(360deg); }
    }

    @keyframes rc-spin-expressive-morph {
        0%, 100% { border-radius: 50%; transform: rotate(0deg) scale(0.72); }
        25% { border-radius: 28% 72% 42% 58% / 58% 35% 65% 42%; transform: rotate(35deg) scale(1); }
        50% { border-radius: 62% 38% 68% 32% / 35% 64% 36% 65%; transform: rotate(78deg) scale(0.82); }
        75% { border-radius: 40% 60% 30% 70% / 70% 45% 55% 30%; transform: rotate(126deg) scale(0.94); }
    }

    @keyframes rc-spin-expressive-breathe {
        0%, 100% { opacity: 1; transform: scale(0.8); }
        50% { opacity: ${token.indicator['reduced-motion'].opacity}; transform: scale(1); }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        &::before {
            animation-name: rc-spin-expressive-breathe;
            animation-duration: ${token.indicator['reduced-motion']['animation-duration']};
            animation-timing-function: ease-in-out;
        }
    }

    @media (forced-colors: active) { color: Highlight; }
`;

export interface ExpressiveSpinIndicatorProps extends Omit<HTMLAttributes<HTMLSpanElement>, "children"> {
    size?: SpinSize;
    ref?: Ref<HTMLSpanElement>;
}

/** 纯视觉的 M3 Expressive 形变加载指示器；加载语义由 Spin 或宿主提供。 */
const ExpressiveSpinIndicator = ({ size, className, ref, ...restProps }: ExpressiveSpinIndicatorProps) => (
    <span
        {...restProps}
        ref={ref}
        data-indicator="expressive"
        className={cx(expressiveStyle, size !== undefined && sizeStyleOf(size), className)}
        aria-hidden="true"
    />
);

export default ExpressiveSpinIndicator;
