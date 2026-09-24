# rc-virtual 拖动空白排查（2026-09-24）

## 结论

用户视频中的基础示例在拖动纵向滚动条时整屏空白，松开后恢复。原因是 Wake 0.1.45 文档宿主注入的全局减少动效样式，而非虚拟范围计算或百万行局部坐标算法。

当前浏览器启用 `prefers-reduced-motion: reduce`。宿主为所有元素设置 `transition-duration: 0.01ms !important`，而没有限制 `transition-property`。该属性默认是 `all`，所以本来没有过渡的占位高度、占位宽度和滑块位置也产生了过渡。连续拖动不断重启它们，DOM 滚动位置已更新，占位尺寸却滞留在旧值。

## 实测证据

- 视频：`C:/Users/zhang/Desktop/1.mp4`，40 fps、236 帧。约 2.05–2.55 秒和 3.08–3.58 秒可见连续整屏空白。
- 在真实 Chrome 基础示例中，从第 6,666 行附近向下拖动，逐次读取 DOM、计算样式和元素边界，复现相同问题。

| 拖动采样 | scrollTop | 占位 CSS 变量 | 实际占位高度 | 首行相对视口顶部 | 占位过渡 |
| --- | ---: | ---: | ---: | ---: | --- |
| 修复前 | 192,175 | 192,168px | 159,984px | -32,183.5px | running |
| 修复前 | 385,277 | 385,272px | 159,984px | -225,285.5px | running |
| 修复后 | 192,175 | 192,168px | 192,168px | 0.5px | 无 |
| 修复后 | 385,277 | 385,272px | 385,272px | 2.5px | 无 |

基础示例现有 inline-block 占位包含少量基线间距；本次未改变示例布局。以上是滚动布局采样，不是 FPS 基准测试。

## 修改

- 新增共享文档适配 `components/rc-theme/docs/reduced-motion.css`，在减少动效时将过渡时长及延迟设为真正的 `0s`，覆盖宿主强制的微小非零时长。
- 文档站和组件工作台共同导入；普通动效偏好、组件 keyframes、JavaScript 动效策略保持原有行为。
- `rc-virtual` 运行时代码没有修改；临时诊断日志已移除。
- 浏览器回归直接读取该 CSS 源文件生成本地 JSON fixture，逐帧检查拖动中视口覆盖和过渡数量；不依赖机器的动效偏好或额外文档服务器。

## 验证

- 关闭修复规则时，新增回归稳定失败：末个渲染行底部为 `-158417px`，视口底部为 `408px`，内容已全部离开视口。
- 启用修复：`rc-virtual` 浏览器测试 11/11，单元测试 102/102；Lint 0 errors / 0 warnings，类型检查通过。
- `rc-theme` 单元测试 9/9，Lint 0 errors / 0 warnings；浏览器测试准备脚本 Lint 通过。
- 新启动的独立 Wake 预览加载了修复，并确认真实拖动各次采样的占位高度即时更新、没有 CSS 过渡。
- 已运行的文档服务可能缓存主题导入；重新启动后再刷新。生产预览需重新构建文档。

## 参考与边界

延续现有 M3 基线，本次只修复文档宿主的减少动效适配，不重新设计列表或网格。Material Web 没有对应的虚拟滚动算法实现；其列表文档、样式和令牌用于核对参照范围，不将其视为本项目虚拟化实现。

- [M3 Accessibility: Designing](https://m3.material.io/foundations/designing/overview)：通过真实浏览器阅读现行入口；原 accessible-design/patterns 地址已失效。
- [Material Web Lists 文档与示例](https://material-web.dev/components/list/)、[列表样式](https://github.com/material-components/material-web/blob/main/list/internal/_list.scss)、[列表令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-list.scss)。
- [Material Web Focus Ring 减少动效处理](https://github.com/material-components/material-web/blob/main/focus/internal/_focus-ring.scss)。
- [CSS Transitions Level 1](https://www.w3.org/TR/css-transitions-1/#transition-duration-property)：默认属性集合、时长与过渡的定义。

参考访问日期为 2026-09-24。本次没有完整审查组件视觉、所有平台动效或完整性能基准，不作全组件 M3 合规或帧率提升比例声明。
