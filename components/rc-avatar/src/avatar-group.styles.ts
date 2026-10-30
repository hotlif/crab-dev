import { css } from '@crab-dev/css';
import { TokenVars as badgeVars } from '@crab-dev/rc-badge';
import token from './token.js';

export const groupStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    isolation: isolate;
`;

export const overflowIndicatorStyle = css`
    && {
        position: relative;
        top: auto;
        inset-inline-end: auto;
        align-self: flex-start;
        flex-shrink: 0;
        ${badgeVars['indicator.transform']}: translateY(-50%);
    }
`;

export const itemBaseStyle = css`
    position: relative;
    display: inline-flex;
    margin-inline-start: ${token.group.margin};
    transition: ${token.group.transition};
    box-shadow: 0 0 0 ${token.group.item.ring.width} ${token.group.item['border-color']};

    &:first-child {
        margin-inline-start: 0;
    }

    &:hover {
        z-index: 10;
        transform: ${token.group['transform-hover']};
    }

    &:focus-within {
        z-index: 10;
    }

    @media (prefers-reduced-motion: reduce) {
        transition: box-shadow 120ms linear;

        &:hover {
            transform: none;
        }
    }
`;

export const itemWithCounterStyle = css`
    && { box-shadow: none; }
`;

export const counterAvatarRingStyle = css`
    &&& {
        box-shadow: 0 0 0 ${token.group.item.ring.width} ${token.group.item['border-color']};
    }
`;

export const itemCircleStyle = css`
    border-radius: 50%;
`;

export const itemSquareStyle = css`
    border-radius: ${token.shape.square['border-radius']};
`;

export const extraActionStyle = css`
    && {
        min-width: ${token.interaction.touch['min-width']};
        min-height: ${token.interaction.touch['min-height']};
        margin-inline-start: ${token.group.action.gap};
    }
`;
