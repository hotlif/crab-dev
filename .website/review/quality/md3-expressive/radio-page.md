# Radio 页面：检查与 M3 Expressive 重设计

## 检查结论

原页面以通用教程模板组织：首屏仅两个无组名的选项、重复的基础示例、过深的状态与主题入口。页面只呈现 RadioProps，缺少 RadioGroupProps。控件具有 20px 默认圆环、40px 状态层与空间/效果动效，但普通指针下点击目标仍为 40px。

[M3 Expressive 官方文章](https://m3.material.io/blog/building-with-m3-expressive) 强调用途色、强调排版、内容分组和少量关键交互。Radio 不在文章列出的 14 个新增或更新组件中；本次保留 Material Radio 的圆环与圆点，以应用场景的布局、结果反馈和表面层次表达 Expressive，不创造新 Radio 外观类型。

## 实现

- 将首屏重设计为通知偏好：三项互斥选择、整行点击、辅助说明和即时结果预览；主要选择使用 secondary container，预览使用 tertiary container 与配对前景。
- “受控单选组”只展示最小组合及组值；“交互试验区”提供局部主题、品牌、可用/禁用/校验切换，错误关联到原生输入且可通过选择恢复。
- 移除重复教程，保留源码、重置、进阶示例、搜索索引、移动目录和工作台入口。补齐 RadioGroup API。
- Radio 默认点击目标调整为 48px，40px 状态层与 20px 默认圆环独立；保留原 CSS 变量覆盖。small / large 的 16 / 24px 明确为 Crab 兼容扩展。
- 页面样式限定于 Radio 页，未改变其他组件页模板。生成器更新生成产物，无手工改写生成文件。

主要源码：`.website/docs/site/radioPage.tsx`、`.website/docs/examples/rc-radio/step-{1,2,3}.tsx`、`.website/content/rc-radio.json`、`.website/scripts/generate-component-docs.mjs`、`components/rc-radio/token.toml`。

## 自动验证

- 受影响工作区及构建依赖共 59 / 59 项任务通过，涵盖 lint、typecheck、test、build:library。
- Radio 24 项测试、文档站 54 项测试、文档生成器 28 项测试通过。新增通知互斥与预览同步、禁用与校验恢复、页面结构与双 API 的回归覆盖。
- 48 个令牌包契约通过；文档一致性检查为 0 个生成差异。
- 文档生产构建通过，生成 62 个路由；1887 个生产 JavaScript 文件检查通过，未发现未绑定引用。已在同一生产产物上复核 Radio 页面。
- 保留现有 Turbo 循环工作区提示，无新增 lint 告警。Wake / Crab CSS 仍为 0.1.45，无依赖与版本变更。

## 浏览器验收

在 Chrome 的真实 320×800 CSS px 视口中检查，而非仅调用视口设置后假定生效：

- 浅色与深色整页横向溢出均为 0；首屏选择与预览纵向排列；试验区操作自然换行。
- 通知选项默认每周；点击与 ArrowDown 可以互斥选择，并更新结果。键盘焦点可见。
- 控件目标实测 48px；选中前后三个选项的宽度、高度与相对位置不变。浏览器滚动造成的视口坐标变化不作为布局偏移。
- 切换禁用后原生输入 disabled；校验状态关联说明，选择后清除错误；局部深色与蓝色品牌正常。
- 窄屏展开源码后整页仍无横向溢出。RadioProps 与 RadioGroupProps 两个 API 区域存在。
- CronPicker 组合回归：四项 Radio 的目标均为 48px，相邻目标间隔 8px，不重叠；方向键能选择步进模式。

生产产物复核与构建结果记录于 `radio-page-validation.json`。本次不将未实测的 forced-colors、系统 reduced-motion、200% 文字缩放、真实触控与读屏标记为通过；保留已有对应样式分支。
