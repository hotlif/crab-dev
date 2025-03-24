import { css } from "@linaria/core";

export const prefix = "crab";

const LineEditBorderRadiusVarName = `--${prefix}-line-edit-border-radius`;
export const LineEditBorderRadius = `var(${LineEditBorderRadiusVarName})`;

const LineEditBorderColorVarName = `--${prefix}-line-edit-border-color`;
export const LineEditBorderColor = `var(${LineEditBorderColorVarName})`;

const LineEditBorderColorFocusWithinVarName = `--${prefix}-line-edit-border-color-focus-within`;
export const LineEditBorderColorFocusWithin = `var(${LineEditBorderColorFocusWithinVarName})`;

const LineEditBoxShadowFocusWithinVarName = `--${prefix}-line-edit-box-shadow-focus-within`;
export const LineEditBoxShadowFocusWithin = `var(${LineEditBoxShadowFocusWithinVarName})`;

const LineEditTransitionVarName = `--${prefix}-line-edit-transition`;
export const LineEditTransition = `var(${LineEditTransitionVarName})`;



// 全局样式
export const globals = css`
    :global() {
        html {
            ${LineEditBorderRadiusVarName}: 4px;
            ${LineEditBorderColorVarName}: rgb(217, 217, 217);
            ${LineEditBorderColorFocusWithinVarName}: rgb(22, 119, 255);
            ${LineEditBoxShadowFocusWithinVarName}: rgba(5, 145, 255, 0.1) 0px 0px 0px 2px;
            ${LineEditTransitionVarName}: all 200ms;
        }
    }
`;
