import { css } from "@linaria/core";

export const prefix = "crab";

const LineEditBorderRadiusVarName = `--${prefix}-line-edit-border-radius`;
export const LineEditBorderRadius = `var(${LineEditBorderRadiusVarName})`;



// 全局样式
export const globals = css`
    :global() {
        html {
            ${LineEditBorderRadiusVarName}: 4px;
        }
    }
`;
