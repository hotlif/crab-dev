# 文档示例容器层级修正

日期：2026-09-20。

## 官方依据与落地

依据：[Start building with Material 3 Expressive](https://m3.material.io/blog/building-with-m3-expressive)，重点是 “Contain content for emphasis”、表面色与排版层级。容器应对应有意义的分组；本文不把“一律禁止嵌套”当作官方规则，也不据此宣称全库完全符合规范。

| 官方设计原则 | 本次落地 | 实现位置 | 验证证据 |
| --- | --- | --- | --- |
| 容器表达内容分组和重点 | 文档标题不再独立套卡；预览说明、舞台、操作栏采用同一表面色 | `docs/site/documentStyles.ts`、`siteStyles.ts` | 生产页面标题背景为透明，示例表面保留 |
| 排版、间距建立层级 | LineEdit 的紫色说明块、粉色结果块改为透明布局与文本；Radio 结果移除装饰性 Card | `docs/examples/rc-line-edit/step-1.tsx`、`rc-radio/step-1.tsx` | 浏览器计算样式确认说明／结果背景透明；暗色主题复核 |
| 清晰呈现关键操作 | 移除 LineEdit / Radio 的第二行示例标题；重置与复制、源码集中到一排 | `docs/site/liveExample.tsx`、`lineEditPage.tsx`、`radioPage.tsx` | 每个预览没有额外标题 header，操作顺序为重置、复制、源码 |
| 保留真实组件语义 | 输入字段填充、选项选中表面、主题试验边界继续表达实际状态；不使用全局选择器抹掉演示组件的样式 | 对应示例与公共预览组件 | 输入清除后聚焦字段，Radio 选择同步结果 |

## 公共预览接口

`components/rc-component-preview/src/preview.tsx` 新增可选 `actions`，将附加操作放在复制／源码之前。旧调用方不需要修改；没有源码时也能单独提供操作。操作目标通过 L3 `meta.actions.target-size` 引用公共 `size.touch-target`，实测高度 48px。

令牌和 docgen 通过命令生成，教程源码与 API 通过文档生成器同步，未手工修改生成文件。

## 本轮检查

- ComponentPreview：lint、typecheck、4 项测试、令牌生成及库构建通过。
- 文档站：lint、typecheck、61 项测试、28 项生成器测试、生成一致性检查通过。
- 文档生产构建通过；检查 1889 个生产 JavaScript 文件，未发现未绑定引用。
- 浏览器：生产产物的 LineEdit 在 1920px / 320px 下无整页横向溢出；浅色／深色表面层级检查；Radio 选择结果更新；开发预览中的外观切换、重置、源码展开检查。
- 当前用户的 LineEdit 生产预览标签页已刷新。

此次范围是公共文档展示层级、LineEdit / Radio 示例及预览操作栏，不是全部 53 个组件的 MD3 符合性验收。
