# @crab-dev/rc-table

按行列展示结构化数据，支持排序、筛选、选择和编辑。

## 主要功能

- 提供表格展示能力，适用于结构化数据阅读与操作
- 支持与筛选、排序、分页等能力协同使用
- 可用于后台列表、报表页与管理数据面板
- 设置 `onRowClick` 或 `onRowDoubleClick` 后，行会显示可交互反馈。行内控件交互和单元格拖选不会误触发行事件。
- 键盘定位到行后，按 Enter 可触发 `onRowClick`。
- `editType="cell"` 或 `editType="row"` 的双击编辑会消费该事件，不再触发 `onRowDoubleClick`。

## 文档

- [使用说明与 API](./docs/index.mdx)
- [示例源码](./docs/demos/)

在当前包目录运行 `yarn start` 可打开组件工作台，查看交互示例。
