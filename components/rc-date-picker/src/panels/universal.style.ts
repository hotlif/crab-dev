import { css } from '@linaria/core';
import token from "../token";

export const selectStyle = css`
    background-color: ${token.color['selected-background']};
    color: ${token.color['selected-text']};
`