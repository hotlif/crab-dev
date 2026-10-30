# Form 维护入口

继承[组件规则](../AGENTS.md)。适配器、字段初始化、标签布局与组命名的完整契约见[公共 API 的 Form 适配](../../.website/docs/guides/public-api.mdx#form-适配)。

- 修改字段连接时，核对 `src/field-adapters.ts`、`src/item.tsx` 和 `src/hooks/`；覆盖缺值、首次读取、重置及布尔/原生适配，不能恢复旧 binding/trigger 隐式兼容。
- 修改标签时，分别验证 control 完整字段宽度与 external 对齐；不得要求子控件是直系 DOM，或跨包装器修改其内部轨道。
- 修改组标题时，核对显式 external/group、组根关联、渲染函数转发和编辑器显式名称优先级，保留组内选项各自名称。
- 布局证据入口为 `src/__tests__/browser/`；通过包内 `check` 执行已登记附加检查。
