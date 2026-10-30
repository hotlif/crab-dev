import { css } from "@crab-dev/css";
import token from "./token.js";

export const expressiveStyle = css`
    display: block;
    position: relative;
    inline-size: var(--rc-spin-size, ${token.size.medium.width});
    block-size: var(--rc-spin-size, ${token.size.medium.width});
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
            /* 与圆环一致，仅保护必要呼吸反馈，抵抗 Wake 0.1.45 的全局 important reset。
               宿主移除该 reset 并通过集成回归后可去掉此优先级；旋转和形变仍保持关闭。 */
            animation-duration: ${token.indicator['reduced-motion']['animation-duration']} !important;
            animation-iteration-count: infinite !important;
            animation-timing-function: ease-in-out;
        }
    }

    @media (forced-colors: active) { color: Highlight; }
`;
