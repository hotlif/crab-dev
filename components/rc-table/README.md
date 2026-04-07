import SimpleTableDemo from "./docs/src/demos/simple.demo";

<div align="center">
	<h1>@crab-dev/rc-table</h1>
	展示行列数据。
</div>

## 何时使用 ?

- 当有大量结构化的数据需要展现时；
- 当需要对数据进行排序、搜索、分页、自定义操作等复杂行为时。

## 代码演示

<SimpleTableDemo />


## API

| 参数 | 说明 | 类型 | 默认值 |
| --- | --- | --- | --- |
| width | 表格宽度 | `number` | - |
| height | 表格高度 | `number` | - |
| rows | 表格数据行，支持通过 `row.height` 单独指定行高 | `T[]` | - |
| columns | 表格列定义 | `ColumnType<T>[]` | - |
| mergeCells | 合并单元格信息 | `MergeCell[]` | `[]` |
| getRowHeight | 按行动态计算高度（优先级高于 `row.height`） | `(row, rowIndex) => number \| undefined` | - |
| headerRowHeight | 表头行高 | `number` | `35` |
| filterBar | 是否显示过滤栏（位于表头下方） | `boolean` | `false` |
| filterRowHeight | 过滤栏行高 | `number` | `35` |
| filterCellClassName | 过滤栏单元格 className（支持传入 `css\`\`` 结果） | `string` | - |
| filters | 外部受控过滤条件（key 为列 `name`） | `Record<string, string>` | - |
| renderDefaultFilterEditor | 自定义默认过滤编辑器；未提供时过滤单元格默认留空 | `(param) => ReactNode` | - |
| onFilterChange | 过滤条件变化回调（key 为列 `name`） | `(filters: Record<string, string>) => void` | - |

### 列过滤扩展

- `column.filterable?: boolean`：禁用当前列过滤输入。
- `column.filterCellClassName?: string`：设置当前列过滤单元格 className。
- `column.filterEditor?: (param) => ReactNode`：自定义过滤编辑器，优先级高于 `renderDefaultFilterEditor`。

> 筛选编辑器优先级：`column.filterEditor` > `renderDefaultFilterEditor`；若两者都未提供，则过滤单元格为空。

> `rc-table` 仅负责过滤条件收集与展示，不直接过滤数据；请在外部根据 `onFilterChange` 返回的条件更新 `rows`。
