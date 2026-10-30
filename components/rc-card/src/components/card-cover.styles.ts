import { css } from '@crab-dev/css';
import token from '../token.js';

export const coverStyle = css`
    position: relative;
    overflow: hidden;
    background-color: ${token.cover['background-color']};

    & > img,
    & > video {
        display: block;
        width: 100%;
        object-fit: cover;
        transform: scale(var(--rc-card-cover-scale, 1));
        transition: ${token.cover.transition};
    }

    @media (prefers-reduced-motion: reduce) {
        & > img,
        & > video {
            transform: none;
            transition: none;
        }
    }
`;
