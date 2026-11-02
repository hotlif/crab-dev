import { css } from '@crab-dev/css';
import token from './token.js';

// Material floating labels share the input row. Their available space follows
// the actual input, including arbitrary consumer prefixes and trailing actions.
export const md3FieldStyle = css`
    &&[data-labeled="true"][data-appearance="filled"] > label,
    &&[data-labeled="true"]:not(:focus-within):not(:has(input:not(:placeholder-shown))):not(:has(input:autofill)) > label {
        max-width: var(--crab-line-edit-label-width, calc(100% - ${token.field.control['padding-inline']} - ${token.field.control['padding-inline']}));
    }
`;
