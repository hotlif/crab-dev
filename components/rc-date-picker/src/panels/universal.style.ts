import { css } from '@crab-dev/css';

import token from "../token.js";

export const selectStyle = css`
    background-color: ${token.selected.background.color};
    color: ${token.selected.text.color};
`