import { css } from "@linaria/core";

export const prefix = "crab";

// 树缩进大小变量名
const TreeIndentSizeVarName = `--${prefix}-tree-indent-size`;
export const TreeIndentSize = `var(${TreeIndentSizeVarName})`;

// 树节点可拖动边框宽度变量名
const TreeNodeDraggableBorderWidthVarName = `--${prefix}-tree-node-draggable-border-width`
export const TreeNodeDraggableBorderWidth = `var(${TreeNodeDraggableBorderWidthVarName})`;

// 树节点可拖动边框样式变量名
const TreeNodeDraggableBorderStyleVarName = `--${prefix}-tree-node-draggable-border-style`
export const TreeNodeDraggableBorderStyle = `var(${TreeNodeDraggableBorderStyleVarName})`;

// 树节点可拖动边框颜色变量名
const TreeNodeDraggableBorderColorVarName = `--${prefix}-tree-node-draggable-border-color`
export const TreeNodeDraggableBorderColor = `var(${TreeNodeDraggableBorderColorVarName})`;

// 树节点边框半径变量名
const TreeNodeBorderRadiusVarName = `--${prefix}-tree-border-radius`
export const TreeNodeBorderRadius = `var(${TreeNodeBorderRadiusVarName})`;

// 树节点图标悬停背景颜色变量名
const TreeNodeIconHoverBgColorVarName = `--${prefix}-tree-node-icon-hover-bg-color`
export const TreeNodeIconHoverBgColor = `var(${TreeNodeIconHoverBgColorVarName})`;

// 树节点图标加载颜色变量名
const TreeNodeIconLoadingColorVarName = `--${prefix}-tree-node-icon-loading-color`
export const TreeNodeIconLoadingColor = `var(${TreeNodeIconLoadingColorVarName})`;

// 树节点标题悬停背景颜色变量名
const TreeNodeHoverBgColorVarName = `--${prefix}-tree-node-hover-bg-color`
export const TreeNodeHoverBgColor = `var(${TreeNodeHoverBgColorVarName})`;

// 树节点标题选中背景颜色变量名
const TreeNodeSelectBgColorVarName = `--${prefix}-tree-node-select-bg-color`
export const TreeNodeSelectBgColor = `var(${TreeNodeSelectBgColorVarName})`;

// 全局样式
export const globals = css`
    :global() {
        html {
            ${TreeIndentSizeVarName}: 24px; // 树缩进大小
            ${TreeNodeBorderRadiusVarName}: 4px; // 树节点边框半径
            ${TreeNodeDraggableBorderWidthVarName}: 1px; // 树节点可拖动边框宽度
            ${TreeNodeDraggableBorderStyleVarName}: solid; // 树节点可拖动边框样式
            ${TreeNodeDraggableBorderColorVarName}: #1677ff; // 树节点可拖动边框颜色
            ${TreeNodeIconHoverBgColorVarName}: rgba(0, 0, 0, 0.06); // 树节点图标悬停背景颜色
            ${TreeNodeIconLoadingColorVarName}: #0088f0; // 树节点图标加载颜色
            ${TreeNodeHoverBgColorVarName}: rgba(0,0,0,0.04); // 树节点标题悬停背景颜色
            ${TreeNodeSelectBgColorVarName}: #e6f4ff; // 树节点标题选中背景颜色

        }
    }
`;
