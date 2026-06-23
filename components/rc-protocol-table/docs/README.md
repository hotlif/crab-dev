+++
title = "高阶 Protocol 表格"
index = true
+++

# ProtocolTable（协议驱动的高阶表格）

轻量的协议驱动表格封装，适用于消费端通过协议（列定义 + 数据）动态渲染复杂表格场景。组件将列定义（ProtocolColumnType）映射为内部 `rc-table` 可识别的 `ColumnType`，并支持按 `dataType` 注入自定义渲染器 / 过滤器。

## 特性

- 通过 `fetchColumns` / `fetchData` 异步加载列定义与数据，便于与后端协议对接；
- 支持 `typeLoaders` 插件化地为不同 `dataType` 注入 `render` / `filterEditor` / `editRender`；
- 与 `rc-auto-sizer`/`rc-table` 无缝配合，支持虚拟滚动与自适应容器；
- 设计上将渲染与过滤逻辑下沉到消费方，表格负责渲染与编辑交互。

## 何时使用

- 后端以列协议（metadata）下发列定义，需要前端根据协议渲染表格；
- 需要为多种数据类型（金额、日期、富文本、状态）提供可插拔渲染器；
- 需要将筛选/排序逻辑放到服务端，前端只负责展示与收集条件。

## 快速开始

示例（简化）：

```tsx
import ProtocolTable from "../src/table.js";
import type { ProtocolColumnType } from "../src/types.js";

// fetchColumns / fetchData 为异步接口示例
const fetchColumns = async (): Promise<ProtocolColumnType[]> => { /* ... */ };
const fetchData = async () => { /* ... */ };

export default function Demo() {
	return (
		<ProtocolTable
			fetchColumns={fetchColumns}
			fetchData={fetchData}
		/>
	);
}
```

## 演示

<Demos path="/docs/demos" />


