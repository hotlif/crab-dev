/**
 * DisplayValue 对象包含了所有可能的 CSS display 属性值。
 * 
 * @property {string} block - 块级元素显示方式。
 * @property {string} inlineBlock - 行内块级元素显示方式。
 * @property {string} inline - 行内元素显示方式。
 * @property {string} flex - 弹性盒子显示方式。
 * @property {string} inlineFlex - 行内弹性盒子显示方式。
 * @property {string} table - 表格显示方式。
 * @property {string} inlineTable - 行内表格显示方式。
 * @property {string} tableCaption - 表格标题显示方式。
 * @property {string} tableCell - 表格单元格显示方式。
 * @property {string} tableColumn - 表格列显示方式。
 * @property {string} tableColumnGroup - 表格列组显示方式。
 * @property {string} tableFooterGroup - 表格脚注组显示方式。
 * @property {string} tableHeaderGroup - 表格标题组显示方式。
 * @property {string} tableRowGroup - 表格行组显示方式。
 * @property {string} tableRow - 表格行显示方式。
 * @property {string} flowRoot - 流根显示方式。
 * @property {string} grid - 网格显示方式。
 * @property {string} inlineGrid - 行内网格显示方式。
 * @property {string} contents - 内容显示方式。
 * @property {string} listItem - 列表项显示方式。
 * @property {string} hidden - 隐藏元素显示方式。
 */
const DisplayValue = {
  block: "block",
  "inline-block": "inline-block",
  inline: "inline",
  flex: "flex",
  "inline-flex": "inline-flex",
  table: "table",
  "inline-table": "inline-table",
  "table-caption": "table-caption",
  "table-cell": "table-cell",
  "table-column": "table-column",
  "table-column-group": "table-column-group",
  "table-footer-group": "table-footer-group",
  "table-header-group": "table-header-group",
  "table-row-group": "table-row-group",
  "table-row": "table-row",
  "flow-root": "flow-root",
  grid: "grid",
  "inline-grid": "inline-grid",
  contents: "contents",
  "list-item": "list-item",
  hidden: "none",
};

export const display = (key: keyof typeof DisplayValue) => {
    return `display: ${DisplayValue[key]};`;
}

