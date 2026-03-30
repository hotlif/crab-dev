import { css } from '@linaria/core';

import token from "../token.js";

export const selectStyle = css`
    background-color: ${token.selected.background.color};
    color: ${token.selected.text.color};
`