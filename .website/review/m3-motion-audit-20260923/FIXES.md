# 动效审查修复记录

日期：2026-09-23。已实现审查报告中的 5 项修复，延续现有 expressive motion scheme 和三层令牌体系，未添加第三方动画或 UI 依赖。

## 实现

| 审查项 | 修复行为 |
| --- | --- |
| 页内目录 | 保留目录 DOM，通过 grid 行高展开、收起；内容使用 default spatial，箭头使用 fast spatial。收起时立即设置 inert / aria-hidden，视觉过渡不会留下可访问的隐藏链接。 |
| 移动导航一级分类 | 与二级分组共用展开容器；内容不再条件卸载，关闭、打开与快速反向切换均由 CSS 接续当前高度。 |
| Tabs 指示线 | 从前一标签的实际指示器位置平移并缩放到新标签。中断时先读取当前可见位置，再取消旧动画；保持标签宽度、选中语义和键盘焦点。 |
| 动效角色 | 圆角、旋转、展开高度使用 spatial；颜色、背景、透明度使用 effects。AppMainLayout 的标题栏与标签栏使用组件令牌。 |
| 标签拖拽与减少动态效果 | 拖动标签直接跟随指针，其他标签让位及释放回位使用可定制的空间动效；按动画完成或取消提交重排，移除固定 220ms 等待。减少动态效果时直接提交；取消手势不提交重排，卸载后不再回调。 |

Tabs 的运动路径参考 Material Web，但保留当前 M3 Expressive Web 的 350ms fast spatial 曲线，没有复制旧实现的 250ms 时长。几何测量通过 Web Animations 使用，不增加内联 style；AppMainLayout 原有拖拽内联 transform 也已移除。这里使用官方 Web 曲线近似，不宣称实现了真实弹簧物理引擎。

## 验证

- Tabs、AppMainLayout 的令牌均通过 `generate:token` 生成。
- 三个受影响工作区的 lint、测试和 typecheck 全部通过；Turbo 共 63 个任务成功。Tabs 18 项、AppMainLayout 23 项、站点 63 项测试通过，另有 28 项文档生成器测试通过。
- 新回归测试覆盖：指示器中断与重新定向、不同标签宽度、反向物理位置、受控选择、变体切换、零时长、动态开启 reduced motion、拖拽等待实际完成、取消手势、拖拽后的点击抑制与卸载清理。
- 生产构建通过：63 个路由，1918 个生产 JavaScript 文件的绑定检查为 0 个未绑定引用。完整日志保存在 [docs-build.log](C:/Users/zhang/Desktop/crab-dev/.website/review/m3-motion-audit-20260923/docs-build.log)。
- 所有相关 lint 均为 0 errors / 0 warnings。Turbo 输出的循环依赖提示与上轮验收日志一致，本轮未修改依赖声明或新增该循环。
- 相关源码 `git diff --check` 通过；保留工作区原有改动。

## 浏览器记录

在本地开发站及生产预览中核验，覆盖 1081 × 912、390 × 844，浅色与深色。浏览器控制台未发现本轮操作引发的错误。

| 场景 | 实测结果 |
| --- | --- |
| 页内目录 | 展开终态高度 336px，收起终态 0px；行高过渡 500ms，箭头 350ms；折叠后 inert 与 aria-hidden 生效。 |
| 移动导航分类 | 从 702px 收起时，inert 已立即生效且内容仍处于退出过程，随后高度到 0；不再同步硬切。 |
| 快速反向展开 | 连续切换后采样到 118.5625px 的中间高度，展开状态与 inert 保持一致。 |
| Tabs 连续切换 | 指示线从 x=403 移向 x=467；快速反向切换采样到 x≈454.8683，最终 x=467、transform=none，没有跳回起点或残留变换。 |
| 深色键盘操作 | ArrowRight 激活“活动”，焦点跟随到新标签，焦点轮廓保持可见；选中线仍使用主题主色。 |
| 布局标签拖拽 | “概览 / 成员管理”重排为“成员管理 / 概览”，激活项保持“成员管理”；完成后两个标签的偏移均为 0，transform 均为 none。 |

减少动态效果的初始状态、运行时切换以及取消/卸载通过自动化组件测试验证；本轮未修改操作系统偏好。未声称完成所有组件、主题与浏览器的全面动效合规检查。

## 实际参考

- [M3 Motion 角色与方案](https://m3.material.io/styles/motion/overview/how-it-works)
- [M3 Motion Web 转换表](https://m3.material.io/styles/motion/overview/specs)
- [M3 Tabs Guidelines](https://m3.material.io/components/tabs/guidelines)、[Specs](https://m3.material.io/components/tabs/specs)、[Accessibility](https://m3.material.io/components/tabs/accessibility)
- [Material Web Tabs 文档](https://material-web.dev/components/tabs/)与[示例](https://material-web.dev/components/tabs/stories/)
- Material Web 固定提交 `9200eb8a0eef99c6bd439ce3968952d76e9ec1b4`：[行为](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/tab.ts)、[样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/_tab.scss)、[primary 样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/_primary-tab.scss)、[令牌](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tokens/_md-comp-primary-tab.scss)

文档目录与导航分组是依照 M3 motion 规则的站点扩展，不称为 M3 独立定义的折叠组件。报告中的教程淡变和扩散波纹属于可选打磨，本轮未扩大到这些内容。
