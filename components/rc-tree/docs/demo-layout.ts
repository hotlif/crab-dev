import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

export const treeMeasureStyle = css`
    min-width: 0;
    max-width: 100%;
    height: auto;
    flex: 1 1 20rem;
`;

export const checkableLayoutStyle = css`
    display: flex;
    flex-wrap: wrap;
    gap: ${token.space["group-gap"]};
    align-items: flex-start;
`;

export const checkedSummaryStyle = css`
    min-width: 0;
    overflow-wrap: anywhere;
    font-size: ${token.font.size.caption};
    color: ${token.color.text.secondary};
    line-height: ${token.font["line-height"].body};
`;

export const demoStackStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space["stack-gap"]};
`;

export const demoNoteStyle = css`
    margin: 0;
    font-size: ${token.font.size.body};
    color: ${token.color.text.secondary};
    line-height: ${token.font["line-height"].body};
`;

export const keyboardHelpStyle = css`
    padding: ${token.space["control-padding-y"]} ${token.space["control-padding-x"]};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.container};
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.caption};
    line-height: ${token.font["line-height"].body};
`;
