import token from "./token.js";

/**
 * 行底色 —— 由行级 CSS 变量统一驱动。
 *
 * 一行的底色不是单个元素画出来的：
 * - 普通列透明，露出 BodyRow 自身的背景；
 * - 左右固定列是 sticky，各自带一层不透明底（否则横向滚动时内容会透出来）；
 * - 合并单元格的内容容器是绝对定位的，也带一层不透明底。
 *
 * 它们全部读同一个 ROW_BG_VAR，行 hover / 选中时只改这一个变量，整行（含固定列与合并单元格）
 * 便一起换色。
 */
export const ROW_BG_VAR = "--rc-table-row-bg";

/**
 * 行底色过渡 —— 凡是以 ROW_BG_VAR 作为底色的元素，都**必须**用这一条。
 *
 * 少给任何一处，它就会在变量变化的瞬间直接换色，而其余部分仍在渐变；两者步调不一致，
 * 交界处便撕裂、拖尾，读起来就是"hover 有延迟"。已知的使用处：
 * table.tsx 的 selectedRowStyle / clickableRowStyle / fixedCellBgWithRowVar，
 * 以及 bodyCell.tsx 中合并单元格的内容容器。
 */
export const ROW_BG_TRANSITION = `background-color ${token["row-click"]["row-bg-transition"]}`;
