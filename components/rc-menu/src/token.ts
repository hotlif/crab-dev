import { css } from "@linaria/core";

export const prefix = "crab";

// 菜单 Hover 的背景色
const MenuItemBackgroundHoverColorVarName = `--${prefix}-menu-item-bg-hover-color`;
export const MenuItemBackgroundHoverColor = `var(${MenuItemBackgroundHoverColorVarName})`;

const MenuItemSelectdColorVarName = `--${prefix}-menu-item-bg-selectd-color`;
export const MenuItemSelectdColor = `var(${MenuItemSelectdColorVarName})`;

const MenuItemActiveColorVarName = `--${prefix}-menu-item-bg-active-color`;
export const MenuItemActiveColor = `var(${MenuItemActiveColorVarName})`;

const MenuItemBorderRadiusVarName = `--${prefix}-menu-item-border-radius`;
export const MenuItemBorderRadius = `var(${MenuItemBorderRadiusVarName})`;

const MenuItemInLineIndentVarName = `--${prefix}-menu-item-in-line-indent`;
export const MenuItemInLineIndent = `var(${MenuItemInLineIndentVarName})`;

const MenuItemChildrenBgColorVarName = `--${prefix}-menu-item-children-bg-color`;
export const MenuItemChildrenBgColor = `var(${MenuItemChildrenBgColorVarName})`;

const MenuItemGroupTitleColorVarName = `--${prefix}-menu-item-group-title-color`;
export const MenuItemGroupTitleColor = `var(${MenuItemGroupTitleColorVarName})`;


// 全局样式
export const globals = css`
    :global() {
        html {
            ${MenuItemBackgroundHoverColorVarName}: rgba(0,0,0,0.06);
            ${MenuItemBorderRadiusVarName}: 8px;
            ${MenuItemSelectdColorVarName}: rgba(0,0,0,0.06);
            ${MenuItemActiveColorVarName}: rgba(0,0,0,0.10);
            ${MenuItemInLineIndentVarName}: 24px;
            ${MenuItemChildrenBgColorVarName}: rgba(0,0,0,0.02);
            ${MenuItemGroupTitleColorVarName}: rgba(0, 0, 0, 0.45);
        }
    }
`;
