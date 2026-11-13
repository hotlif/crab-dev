import { css } from '@crab-dev/css';
import token from './token.js';

// The visual bezel is separate from the hit area, even when a table/tree
// expands that area. A Mac control never grows an M3 circular ink halo.
export const macosRadioStyle = css`
    && {
        > input + span::before { display: none; }
        [data-radio-part='box'] {
            background-image: ${token.macos.control['background-image']};
            box-shadow: ${token.macos.control['box-shadow']};
        }
        &:not([data-disabled]):active [data-radio-part='box'] {
            box-shadow: ${token.macos.control['box-shadow-active']};
        }
        &[data-disabled] [data-radio-part='box'] { background-image: none; box-shadow: none; }
        @media (forced-colors: active) {
            [data-radio-part='box'] { background-image: none; box-shadow: none; }
        }
    }
`;

