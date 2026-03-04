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
