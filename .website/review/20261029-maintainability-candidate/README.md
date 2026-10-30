# 维护性重构候选验收 · 2026-10-29

状态：**partial**。本记录核对最终生产文档的指定页面与状态，不代表全部组件、尺寸和密度已完成视觉重建。

## 候选与复现

- 页面：`/guides/design-styles`；Windows，Chrome 155.0.8059.86。
- 源码：`sha256:7e8e6aa31cab97b6d4783841989fdffe16802702e42654237c52b47c7d9f50cc`。
- 构建产物：`sha256:0ec330683875697468483c931aa85dbd573fa46e04ebc0f3d484f905ba303765`。
- [原始采集记录](evidence/candidate.json)列出实际输入文件、产物、截图指纹、浏览器版本与媒体条件。采集前后输入一致，无运行时异常。
- 在仓库根完成 `yarn docs:build` 后，可用 `node .website/review/20261029-maintainability-candidate/capture.mjs` 建立新的独立候选。输出到新的 `.tmp/docs-final-*`；不覆盖本记录。

## 实际核对

下列十张 PNG 均已逐张查看。范围限于画面可见部分；使用页面默认控件配置。未直接修改产品样式或动画播放状态。

| 条件 | 证据 | 观察 |
| --- | --- | --- |
| MD3 浅色 | [PNG](evidence/md3-light.png) | 关键操作、浮动标签、错误与说明、选中与禁用状态、输入焦点可辨识 |
| MD3 深色 | [PNG](evidence/md3-dark.png) | 表面层级、文字与控件边界可辨识，所见字段布局未裁切 |
| Apple 浅色 | [PNG](evidence/apple-light.png) | 稳定上置标签、紧凑输入与选择控件、外部焦点环可见 |
| Apple 深色 | [PNG](evidence/apple-dark.png) | 选中、未选、禁用与错误说明有明确区分 |
| shadcn 浅色 | [PNG](evidence/shadcn-light.png) | 中性表面、描边层级与焦点可见 |
| shadcn 深色 | [PNG](evidence/shadcn-dark.png) | 可见操作与字段在深色背景上保持层次与边界 |
| 320px | [PNG](evidence/viewport-320.png) | 导航折叠、正文换行正常，未出现整页横向溢出 |
| 768px | [PNG](evidence/viewport-768.png) | 标题、正文与规格表可读，未出现整页横向溢出 |
| 强制颜色，shadcn 深色 | [PNG](evidence/forced-colors.png) | 系统色下文字、控件边界、焦点、选择与禁用状态可辨识 |
| 减少动画，shadcn 深色 | [PNG](evidence/reduced-motion.png) | 原生媒体偏好已生效，页面与草稿保持；持续动效行为另由组件专项测试验证 |

机器交互检查在三体系浅深色切换后均确认同一输入节点仍连接、草稿仍为“保留草稿内容”。该结果也延续到窄屏和媒体偏好切换。

## 工程检查与失败记录

- [最终全局检查](validation/global-final.log)：默认测试 2,147 项通过；生产文档构建完成；1,889 个 JavaScript 文件没有未绑定名称。
- [全局阶段](validation/global-stages.log)：架构、令牌、生成物复现、lint、库构建、导出、独立打包消费及类型检查通过。该次末尾的 Tree 文档漂移随后已生成并由最终记录复验。
- [附加检查索引](validation/required-results.json)：49 项均有最后通过的记录，来自同一份登记计划；索引链接对应日志。
- [生成器](validation/generator.log)：53 项契约通过；[原始 docgen](validation/docgen.log)：50 项生成通过。

原始失败没有改写为成功：首次统一运行中的旧紧凑几何断言、TablePro 等待真实异步加载时的 act 警告、Tree 示例的无回退变量引用，以及 DatePicker 首次 Windows CDP 通信失败均保留在验证日志里。相应修正后的检查分别见 `required-table.log`、`required-table-pro.log` 和 `required-tree.log`。

[首次连接失败原图](failed-premises/connection-timeout.png)属于采集前提错误：浏览器没有访问到独立预览服务，显示 `ERR_CONNECTION_TIMED_OUT`；不是组件视觉缺陷。最终采集把预览与隔离浏览器放在同一验证环境。浏览器 profile、缓存目录和临时构建没有复制到本记录。

## 未覆盖

全组件三体系规格和视觉实现仍需继续逐项确认，并完成尺寸、密度、全部适用状态、触控、RTL、中英文与缩放矩阵。本记录不提升产品清单的设计覆盖或生命周期。用户已选择仅保留本地，不推送、不创建草稿 PR；Linux 及同一提交的远端 CI 未执行，不再作为待确认事项。
