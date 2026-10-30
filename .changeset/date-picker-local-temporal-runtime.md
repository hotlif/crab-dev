---
"@crab-dev/rc-date-picker": minor
---

修复缺少原生 Temporal 的浏览器无法打开日期与时间选择器的问题。组件通过包内唯一入口选择原生实现或已经声明的官方 polyfill，不再要求消费方安装 Temporal 全局，也不修改宿主全局对象。常规示例使用公开 ISO 适配入口构造日期。

新增具名 `toPickerDateTime`，将原生或官方 polyfill 的 ZonedDateTime 转换为现有公共日期值。适配只经过 ISO 字符串，不丢失日历、时区或纳秒；无需更改现有 Props、受控回调和 `setState` 类型。

适配器声明接受 ISO 字符串或 `toString()` 的窄结构协议，不将 polyfill 的 Intl 类型扩展带入独立消费方；无原生 Temporal 的运行时仍使用包内已有的官方实现。常规示例直接使用 ISO 入口，显式官方实现仅作为可选互操作；文档记录其 0.5.1 Intl 声明与 TypeScript 6 严格消费的已知限制。

将“现在”和今天标记统一为读取 Date.now 的毫秒精度 UI 时钟，并按业务时区转换；传入 ZonedDateTime 的微秒、纳秒、日历与时区信息保持不变。公共 Props 和受控值协议不变。
