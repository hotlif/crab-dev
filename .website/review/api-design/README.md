# API 设计调整与迁移

本次调整覆盖表单、受控值、表格查询、通知生命周期和组件公开类型。保留原有视觉样式及设计令牌。以下几项会改变既有契约，升级时需检查调用方。

| 组件 | 调整 | 调用方迁移 |
| --- | --- | --- |
| Form | `defaultValue` 仅初始化一次；`useForm()` 返回的实例跨渲染稳定 | 服务端载入新记录后调用 `form.reinitialize(record)`；普通重渲染不覆盖用户编辑 |
| Form | `reinitialize()` 同时替换当前值和重置基准 | `resetFields()` 回到最近一次显式初始化值 |
| Form.Item | 新增 `binding`、`valuePropName`、`trigger`、`getValueFromEvent` 与 render prop；保留子组件原事件 | 原生输入和 LineEdit 用 `binding="event"`，Switch/Checkbox 用 `binding="checked"`，日期选择器用 `binding="valueChange"` |
| Form | 嵌套字段路径与值类型关联；变更事件保留完整路径 | 嵌套字段使用只读元组，如 `['profile', 'age']`；`'name'` 与 `['name']` 指向同一字段 |
| Form | 校验错误为 `FormValidationError`，含 `values` 和逐字段的 `errors` / `warnings` | 不再将捕获对象当作原始表单记录；WARNING 展示提示但不阻止提交 |
| Form | `submit()` 返回 Promise，等待校验和业务回调；重复提交复用同一次进行中的提交 | 根据返回值 `status: 'success' | 'invalid'` 处理结果；业务回调异常仍向调用者拒绝 |
| TablePro | 新增 `request(query)`，查询包括分页、过滤、排序和 AbortSignal | 原 `fetchData` 的两种签名继续可用；需要取消网络请求或服务端排序时迁移到 `request` |
| Table / TablePro | 新增 `sortMode="client" | "server"`，默认 client | server 模式保留服务端返回顺序；TablePro 的 server 模式必须使用 `request`，排序变化回到第一页 |
| TablePro | 新请求和卸载取消旧请求；忽略过期的成功与失败 | 将 `query.signal` 传给 fetch；旧 `fetchData` 仍会忽略过期结果，但不能主动取消底层网络 |
| TablePro | `DataTypeLoader<T>` 保留渲染、编辑、汇总、搜索及导出的行类型 | 已声明行类型的表格使用 `DataTypeLoader<MyRow>[]` |
| Select | 单选用 `null` 表示受控空值；清除回调返回 null | `useState<string \| null>(null)`；undefined 继续表示非受控，不用它清空受控 Select |
| LineEdit / TextEdit | 清除触发标准 `onChange`；非受控模式自动清空并更新计数 | `onClear` 仅用于额外通知，无需重复维护值；受控父组件可拒绝变更，焦点回到输入框 |
| Button | `href` 区分链接与原生按钮，属性、事件、ref 对应实际元素 | 原生按钮包装器用 `ButtonNativeProps`，链接包装器用 `ButtonLinkProps`；链接支持 download、hrefLang、焦点等原生属性 |
| DatePicker / DateTimePicker / TimePicker | 输入框属性独立于面板属性；新增 `panelProps` | 顶层 id/name/ref/事件属于输入框，面板属性放在 panelProps；不再接受内部 selectValues/onSelect/instance |
| Notification / Message | `open()` 返回 `{ id, close, update }`；实例也提供 close/update | loading 消息可用 duration=0 持续展示，然后原地 update 或 close；关闭只通知一次，失效句柄更新无效 |
| Message | `MessageProps` 与默认组件实际契约一致 | 独立组件用 open/onExitComplete 管理生命周期；自动关闭与 onClose 使用 useMessage |
| useControllableValue | 未提供初值时返回 `T \| undefined` | 处理 undefined，或提供 defaultValue 获得确定的返回类型 |
| NumberEdit | `stringMode` 仅接受 false，不再声明尚未实现的高精度能力 | 删除 stringMode=true；当前组件仍使用有限精度 number |
| 导出边界 | 补全 TableProps、TableProProps、ProtocolTableState、请求类型、通知句柄和表单错误类型 | 从各组件包入口具名导入，无需访问内部源码 |

## 表单

```tsx
const [form] = useForm<{ name: string; enabled: boolean }>();

<Form form={form} defaultValue={{ name: '', enabled: false }} onSubmitSuccess={save}>
    <Item name="name" label="姓名" binding="event" required>
        <LineEdit />
    </Item>
    <Item name="enabled" label="启用" binding="checked">
        <Switch aria-label="启用" />
    </Item>
</Form>

// 加载另一条记录时显式更新。defaultValue 重新创建不会触发重置。
form.reinitialize(record);
const result = await form.submit();
if (result.status === 'invalid') {
    console.log(result.error.fields);
}
```

校验使用调用时的数据快照；异步校验期间的编辑不会被旧校验结果覆盖。`onSubmitFailed(values, error)` 保留原第一参数，并增加结构化错误作为第二参数。`onFieldValueChange` 的 `name` 是完整路径，`value` 对应该路径的值。

快照复制普通对象、数组和 Date。Temporal 等不透明的业务值保留原型与身份，调用方应把这些值当作不可变值使用。

## 表格

```tsx
<TablePro<OrderRow>
    fetchColumns={fetchColumns}
    pagination={{ defaultPageSize: 20 }}
    sortMode="server"
    request={async ({ page, pageSize, filters, sort, signal }) => {
        const response = await fetch('/orders/query', {
            method: 'POST', signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ page, pageSize, filters, sort }),
        });
        if (!response.ok) throw new Error('加载失败');
        return response.json(); // { rows: OrderRow[], total: number }
    }}
/>
```

`request` 和 `fetchData` 互斥。query 的 page 从 1 开始；不启用分页时，request 应返回全部结果。client 模式仅对已加载的数据排序，query.sort 为空。自动刷新、分页和过滤均取消上一次请求。内联 request 引用变化本身不触发重新加载。

## 通知与消息

```tsx
const [message, holder] = useMessage();
// 将 holder 渲染在组件树内。
const handle = message.loading('正在保存', 0);
try {
    await save();
    handle.update({ type: 'success', content: '已保存', duration: 2000 });
} catch {
    handle.update({ type: 'error', content: '保存失败', duration: 5000 });
}
// 也可调用 handle.close() 或 message.close(handle.id)。
```

update 保留 ID，重启当前 duration 的计时和进度动画；若更新发生在暂停状态，恢复后使用完整的新时长。duration=0 表示持续展示。

## 验证与参考

行为回归覆盖受控空值与父组件拒绝变更、清除后的焦点和计数、过期请求与卸载、服务端排序、表单初始化和同一事件内的校验、通知更新与重复关闭。类型用例覆盖嵌套字段、未初始化的 Hook、日期内部属性隔离和 stringMode 的拒绝。

本次验收结果（2026-09-22）：

- 13 个相关包共 448 项测试通过；各包 lint 无错误、无告警，导出构建通过。
- 全仓类型检查通过，包含文档站及 Button / Select 的下游调用。
- 文档站 28 项生成器测试、62 项组件测试通过；lint 和生成产物一致性检查通过。docgen 与文档页面均通过生成命令刷新。
- `git diff --check` 通过。未调整依赖、包版本或视觉令牌。

尚未通过的独立检查：PDF Editor 全包测试为 85 项通过、1 项失败。`web-component.test.tsx` 的“接管定义前的 property，移除正在初始化的元素会拒绝等待并释放运行时”用例在整组执行时收到 `PdfEditorError: 等待期间文档已变化，请重新打开或关闭`，单独执行该用例则通过。本次对该包仅将工具栏包装器的类型改为 `ButtonNativeProps`，未修改其运行时实现或已有测试；未将此结果计入上述 448 项通过用例，也未断言已经验证其基线归因。

Turbo 仍报告仓库已有的 rc-menu / rc-masonry / rc-spin / rc-button / rc-component-preview 循环依赖告警；本次没有修改依赖关系。

交互参考：[M3 文本字段指南](https://m3.material.io/components/text-fields/guidelines)、[Material Web 文本字段](https://material-web.dev/components/text-field/)、[按钮](https://material-web.dev/components/button/)、[选择器](https://material-web.dev/components/select/)。对照实现：[text-field.ts](https://github.com/material-components/material-web/blob/main/textfield/internal/text-field.ts)、[button.ts](https://github.com/material-components/material-web/blob/main/button/internal/button.ts)、[select.ts](https://github.com/material-components/material-web/blob/main/select/internal/select.ts)。本次没有调整视觉令牌，也未进行完整的 M3 视觉符合性验收。
