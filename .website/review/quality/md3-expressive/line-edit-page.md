# LineEdit：文本字段与文档专项优化

## 检查结论

原页虽然已使用 56px 字段高度，但仍只有传统描边结构，缺少 Filled、浮动标签以及字段下方的说明。基础示例与分步教程重复，颜色和排版没有形成明确的视觉重点。

对照 [M3 Expressive](https://m3.material.io/blog/building-with-m3-expressive) 的内容分组、强调排版和用途色，以及 [Material 文本字段](https://material-web.dev/components/text-field/) 的 Filled / Outlined、标签、辅助信息结构进行本次调整。Expressive 文章未将文本字段列入其 14 项新增或更新组件，因此本次不虚构另一套“Expressive 专属输入框”规范。

## 实现

- `components/rc-line-edit/src/lineEdit.tsx`：新增 `appearance`、`label`、`supportingText`、`errorText`。默认仍为 outlined；无新增属性的旧调用保留原布局。`bordered=false` 仍交由宿主提供边界，标签放在字段外。
- Filled 使用表面容器与底线；Outlined 保留描边。浮动标签由真实焦点和原生 placeholder 状态驱动，支持非受控值与自动填充，无额外值同步状态。
- 新标签、说明和计数通过稳定 ID 关联输入；错误文字替换辅助说明，保留调用方的 `aria-describedby` 和显式 `aria-invalid`。清除后先返回输入焦点。
- 带标签的计数移到辅助信息行；操作目标为 48px。盒模型避免粗指针下将内部 padding 再叠加到最小触控高度上。
- 新视觉值位于 L3 token.toml，经生成命令输出；消费已有 L2 主题、表面色、状态和动效。保留 reduced-motion 与 forced-colors 分支。
- 文档模板由生成器维护：一个实时命名示例、两种外观对比、错误／密码／只读／禁用示例、API。详细说明与进阶示例折叠保留，源码来自实际运行文件。

## 验证

- 48 个令牌包契约通过；输入框 lint、typecheck、27 项测试通过。
- 文档 lint、typecheck、61 项测试、28 项生成器测试通过。生成一致性覆盖 53 个组件页、56 份教程、126 个教学示例和 250 个唯一 Demo。
- 浏览器实际输入与事件回调作为输入恢复的验证依据。Wake DOM 环境不能在该组件中完整复现原生 React change 事件；文档自动测试验证外观切换保留初值、清除与焦点、错误关联、密码切换和禁用，而不以模拟输入替代浏览器结果。
- 开发预览：Filled / Outlined 默认字段均为 56px；输入后切换外观保留内容；清除后焦点回到输入框；空字段聚焦后标签上移，有值后保持浮起。
- 真实 320×800 暗色视口：字段宽度 235px、默认高度 56px，整页无横向溢出；补全邮箱并失焦后，aria-invalid 清除且辅助说明恢复。桌面浅色、暗色的标签、边界和辅助信息已目视检查。
- reduced-motion、forced-colors 本轮为源码检查，未把普通浏览器截图作为这些系统模式的实测证据。

- 生产编译完成：53 个库工作区构建成功，62 条文档路由、2550 个输出文件。同一生产产物中再次实测外观切换、输入保留、清除与焦点、320px 暗色邮箱错误恢复；字段高度 56px、无横向溢出，控制台无错误或警告。已刷新用户的 4177 页面并恢复浅色偏好。
- 生产绑定检查通过：1889 个 JavaScript 文件，0 个未绑定引用；完整 docs:build 退出码为 0。

本次不修改版本或依赖，也不将此单页验收扩大为全库完整 M3 兼容认证。
