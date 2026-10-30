import { css } from "@crab-dev/css";
import semanticToken from "@crab-dev/rc-token-semantic";
import { TokenVars as spinVars } from '@crab-dev/rc-spin';
import token from "./token.js";

export const rowStyle = css`
    display: grid;
    grid-template-columns: subgrid;
    grid-column: 1 / -1;
    align-items: center;
`;

export const labelStyle = css`
    grid-column: 1;
    grid-row: 1;
    justify-self: start;
    display: inline-flex;
    align-items: center;
    gap: ${token.required.gap};
    box-sizing: border-box;
    font-size: ${token.label['font-size']};
    font-weight: ${token.label['font-weight']};
    color: ${token.label.color};
`;

export const requiredStyle = css`
    color: ${token.required.color};
    order: ${semanticToken.field.required.order};
    line-height: 1;
`;

export const editorWrapStyle = css`
    grid-column: 2;
    grid-row: 1;
    min-width: 0;
`;

export const controlEditorWrapStyle = css`
    grid-column: 1 / -1;
    min-width: 0;
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    & > * {
        min-width: 0;
        max-width: 100%;
    }
`;

export const statusSlotStyle = css`
    grid-column: 3;
    grid-row: 1;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: ${token.status.width};
    height: ${token.status.width};

    & svg {
        display: block;
        width: 100%;
        height: 100%;
    }
`;

export const errorColorStyle = css`
    color: ${token.status['color-error']};
`;

export const warningColorStyle = css`
    color: ${token.status.warning.color};
`;

export const successColorStyle = css`
    color: ${token.status.success.color};
`;

export const validatingStyle = css`
    color: ${token.status.validating.color};
    ${spinVars['ring.indicator.stroke']}: currentColor;
    ${spinVars['ring.track.stroke']}: transparent;
`;

export const validationMessageStyle = css`
    grid-column: 2 / -1;
    grid-row: 2;
    min-width: 0;
    padding-inline: ${token.message['padding-inline']};
    margin-block-start: ${token.message.gap};
    font-size: ${token.message['font-size']};
    line-height: ${token.message['line-height']};
    white-space: pre-line;
    overflow-wrap: anywhere;
`;
