# DatePicker 维护入口

继承[组件规则](../AGENTS.md)。清除和定位契约见[公共 API 的值与 DOM 事件](../../.website/docs/guides/public-api.mdx#值与-dom-事件)，表单接入见同文的 Form 适配。

- 日期、日期时间和时间选择器依据真实值判断清除能力；显示格式和 placeholder 不参与有值判断。
- 修改字段弹层时按[共享弹层规则](../rc-dropdown-container/AGENTS.md)核对上下翻转及标签、说明边界；使用共享内部定位入口。
- 日期/Intl 回归使用包内声明的 browser 环境，不用 DOM 测试替代已登记检查。
