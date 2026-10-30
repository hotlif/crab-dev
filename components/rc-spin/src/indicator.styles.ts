import { css } from '@crab-dev/css';
import token from './token.js';

export const sizeSmallStyle = css`
    --rc-spin-size: ${token.size.small.width};
    --rc-spin-font-size: ${token.size.small['font-size']};
`;

export const sizeMiddleStyle = css`
    --rc-spin-size: ${token.size.medium.width};
    --rc-spin-font-size: ${token.size.medium['font-size']};
`;

export const sizeLargeStyle = css`
    --rc-spin-size: ${token.size.large.width};
    --rc-spin-font-size: ${token.size.large['font-size']};
`;

export const ringStyle = css`
    display: block;
    inline-size: var(--rc-spin-size, ${token.size.medium.width});
    block-size: var(--rc-spin-size, ${token.size.medium.width});
    animation: rc-spin-rotate ${token.indicator['animation-duration']} ${token.indicator['animation-timing-function']} infinite;

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
            opacity: ${token.indicator['reduced-motion'].opacity};
        }
    }

    /* 加载指示器是耗时操作的唯一反馈：reduce 下若一并停掉动画, 界面就"死"了。
       故此处不做 animation: none, 而是降级为低频呼吸——去掉旋转的前庭刺激,
       保留"仍在进行"的意符。 */
    @media (prefers-reduced-motion: reduce) {
        animation-name: rc-spin-breathe;
        /* Wake 0.1.45 的全局 reduce reset 用 !important 将动画缩为单次 .01ms。
           仅保护必要加载反馈的呼吸周期与次数；宿主移除该 reset 并通过集成回归后可去掉此优先级。 */
        animation-duration: ${token.indicator['reduced-motion']['animation-duration']} !important;
        animation-iteration-count: infinite !important;
        animation-timing-function: ease-in-out;
    }
`;

export const ringTrackStyle = css`
    display: ${token.ring.display};
    fill: none;
    stroke: ${token.ring.track.stroke};
    stroke-width: ${token.ring['stroke-width']};
`;

export const ringIndicatorStyle = css`
    display: ${token.ring.display};
    fill: none;
    stroke: ${token.ring.indicator.stroke};
    stroke-width: ${token.ring['stroke-width']};
    stroke-linecap: round;
    stroke-dasharray: ${token.ring['stroke-dasharray']};

    /* 强制配色下自定义描边被抹除, 用系统高亮色保住"高亮弧"与底环的区分 */
    @media (forced-colors: active) {
        stroke: Highlight;
    }
`;
