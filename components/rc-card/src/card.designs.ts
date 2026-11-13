import { css } from '@crab-dev/css';
import token from './token.js';

// Content grouping is a stable opaque box, including interactive cards.
// Do not lift/scale the document or paint a Material state layer over its text.
export const macosCardStyle = css`
    && {
        &::after { display: none; }
        &, &:hover, &:active { transform: none; }
        &, &:hover { box-shadow: none; }
        &:is([data-card-variant='default'], [data-card-variant='elevated']) {
            &, &:hover { box-shadow: ${token.default['box-shadow']}; }
        }
        &[data-interactive]:hover { border-color: ${token.macos.root['border-color-hover']}; }
        &[data-interactive]:active { box-shadow: ${token.macos.root['box-shadow-active']}; }
        @media (forced-colors: active) { &[data-interactive]:hover { border-color: CanvasText; } }
    }
`;

