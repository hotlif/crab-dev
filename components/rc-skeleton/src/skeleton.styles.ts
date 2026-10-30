import { css } from "@crab-dev/css";
import token from "./token.js";

export const baseStyle = css`
    display: block;
    background-color: ${token.root['background-color']};
    background-image: linear-gradient(
        90deg,
        ${token.root['background-color']} 0%,
        ${token.wave['background-color']} 50%,
        ${token.root['background-color']} 100%
    );
    background-size: 200% 100%;
    background-position: 0% 0%;
    border-radius: ${token.item['border-radius']};
    width: var(--rc-skeleton-w, 100%);
    height: var(--rc-skeleton-h, auto);
    flex-shrink: 0;
`;

export const groupStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.text.rows.gap};
    width: 100%;
`;

export const variantTextStyle = css`
    border-radius: ${token.text['border-radius']};
`;

export const variantRectStyle = css`
    width: var(--rc-skeleton-w, ${token.rect.default.width});
    height: var(--rc-skeleton-h, ${token.rect.default.height});
    border-radius: ${token.item['border-radius']};
`;

export const variantCircleStyle = css`
    width: var(--rc-skeleton-w, ${token.circle.default.width});
    height: var(--rc-skeleton-h, ${token.circle.default.width});
    aspect-ratio: 1 / 1;
    border-radius: ${token.pill['border-radius']};
`;

export const variantButtonStyle = css`
    width: var(--rc-skeleton-w, ${token.button.default.width});
    height: var(--rc-skeleton-h, ${token.button.default.height});
    border-radius: ${token.item['border-radius']};
`;

export const variantAvatarStyle = css`
    width: var(--rc-skeleton-w, ${token.avatar.default.width});
    height: var(--rc-skeleton-h, ${token.avatar.default.width});
    aspect-ratio: 1 / 1;
    border-radius: ${token.pill['border-radius']};
`;

export const variantImageStyle = css`
    width: var(--rc-skeleton-w, 100%);
    height: var(--rc-skeleton-h, 200px);
    border-radius: ${token.item['border-radius']};
`;

export const sizeSmallTextStyle = css`
    height: var(--rc-skeleton-h, ${token.text.size.small.height});
`;

export const sizeMediumTextStyle = css`
    height: var(--rc-skeleton-h, ${token.text.size.medium.height});
`;

export const sizeLargeTextStyle = css`
    height: var(--rc-skeleton-h, ${token.text.size.large.height});
`;

export const lastTextRowStyle = css`
    width: var(--rc-skeleton-w, ${token.text["last-row"].width});
`;

export const roundStyle = css`
    border-radius: ${token.pill['border-radius']};
`;

export const pulseStyle = css`
    background-image: none;
    animation: rc-skeleton-pulse ${token.animation.pulse['animation-duration']} ${token.animation.pulse['animation-timing-function']} infinite;

    @keyframes rc-skeleton-pulse {
        0%,
        100% {
            opacity: ${token.animation.pulse.maximum.opacity};
        }
        50% {
            opacity: ${token.animation.pulse.minimum.opacity};
        }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
    }
`;

export const waveStyle = css`
    animation: rc-skeleton-wave ${token.animation.wave['animation-duration']} ${token.animation.wave['animation-timing-function']} infinite;

    @keyframes rc-skeleton-wave {
        0% {
            background-position: 200% 0%;
        }
        100% {
            background-position: -200% 0%;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        animation: none;
        background-image: none;
    }
`;

export const staticStyle = css`
    background-image: none;
`;

export const forcedColorStyle = css`
    @media (forced-colors: active) {
        forced-color-adjust: auto;
        background-color: Canvas !important;
        background-image: none !important;
        outline: 1px solid CanvasText;
        outline-offset: -1px;
        animation: none !important;
        opacity: 1 !important;
    }
`;
