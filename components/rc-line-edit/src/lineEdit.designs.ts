import { css } from '@crab-dev/css';
import semanticToken from '@crab-dev/rc-token-semantic';
import token from './token.js';

// Material floating labels share the input row. Their available space follows
// the actual input, including arbitrary consumer prefixes and trailing actions.
export const md3FieldStyle = css`
    /* Keep one alignment throughout the float: switching align-self moves the
       label before CSS can interpolate its offset. Percentages follow the real
       grid row, including custom field heights and coarse pointer targets. */
    &&[data-labeled="true"] > label {
        position: absolute;
        grid-row: ${semanticToken.field.layout['label-row']} / span 1;
        align-self: start;
        top: 50%;
        transform: ${token.field.label.floating.transform};
    }
    &&[data-labeled="true"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
        top: 0%;
    }
    &&[data-labeled="true"][data-appearance="filled"]:is(:focus-within, :has(input:not(:placeholder-shown)), :has(input:autofill)) > label {
        transform: none;
    }
    &&[data-labeled="true"][data-appearance="filled"] > label,
    &&[data-labeled="true"]:not(:focus-within):not(:has(input:not(:placeholder-shown))):not(:has(input:autofill)) > label {
        max-width: var(--crab-line-edit-label-width, calc(100% - ${token.field.control['padding-inline']} - ${token.field.control['padding-inline']}));
    }
`;
