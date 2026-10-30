import { css, cx } from '@crab-dev/css';
import type { Ref, SVGAttributes } from 'react';
import token from './token.js';
import type { SpinSize } from './types.js';
import { sizeSmallStyle, sizeMiddleStyle, sizeLargeStyle, ringStyle, ringTrackStyle, ringIndicatorStyle } from "./indicator.styles.js";
export const sizeStyleOf = (size: SpinSize): string => {
    if (size === 'small') return sizeSmallStyle;
    if (size === 'large') return sizeLargeStyle;
    return sizeMiddleStyle;
};

// The alternate activity glyph shares the same accessible host and motion
// preferences; CSS semantic roles select it without reading design in render.
const spokesStyle = css`
    display: ${token.spokes.display};
    stroke: ${token.ring.indicator.stroke};
    stroke-width: ${token.ring['stroke-width']};
    stroke-linecap: round;
    @media (forced-colors: active) { stroke: Highlight; }
`;

const spokes = Array.from({ length: 12 }, (_, index) => ({
    rotation: index * 30,
    opacity: (index + 1) / 12,
}));

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
 * `--rc-spin-size`、`--spin-ring-indicator-stroke`、`--spin-ring-track-stroke`。
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
        <g className={spokesStyle}>
            {spokes.map(({ rotation, opacity }) => (
                <line key={rotation} x1="25" y1="6" x2="25" y2="14" transform={`rotate(${rotation} 25 25)`} opacity={opacity} />
            ))}
        </g>
    </svg>
);

export default SpinIndicator;
