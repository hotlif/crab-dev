# 全组件动效审查修复记录

日期：2026-09-23。对应 `FULL-LIBRARY-AUDIT.md`。本轮处理报告中已确认的动效缺口，保留现有配色、尺寸、布局与 Chrome 风格工作区标签。

## 已完成

| 报告项 | 修复结果 |
| --- | --- |
| 站点统一降级覆盖组件反馈 | 移除文档区和首页针对所有后代的 `animation/transition: none !important`；站点导航和首页形状过渡单独降级，组件负责各自策略。Spin 原有的低频透明度呼吸不再被站点覆盖。组件文档在检测到减少动态效果时显示状态说明。 |
| Alert 直接卸载 | 复用 `usePresence`，关闭回调即时执行，内容立即 inert / aria-hidden；透明度和占位高度收尾后再卸载。空间收缩使用有界布局令牌。 |
| 标签右键菜单直接卸载 | 父级保留关闭中的菜单；150ms 透明度淡出后清理。菜单操作即时生效，关闭期间停用交互；重新打开会使旧退出失效。 |
| Tree / Table 展开硬切 | 新增 `useAnimatedRows`，将每帧高度同时交给虚拟布局与渲染行；退出行保留并立即停用交互。只对最多 100 行、单次增删最多 40 行的展开操作补间；大列表、排序、普通数据刷新、拖拽/筛选及减少动态效果走直接更新。Table 只动画详情行。 |
| Drawer 贴边弹回、旧变量失效 | 新增 sheet 语义角色，默认进入 300ms、退出 200ms，使用 `cubic-bezier(0.2, 0, 0, 1)`，不越过终点。恢复 `--drawer-transition-duration/easing` 和 `--drawer-panel-animation-duration/timing-function` 的兼容；独立 enter/exit 覆盖仍保留。修正 RTL 下逻辑锚点对应的平移方向。 |
| 独立组件减少动态效果遗漏 | Masonry 布局位移、Menu 箭头伪元素补齐自身降级。BarChart 监听偏好变化，先处理停止策略再去重；动画中关闭 animate 或开启减少动态效果会取消 rAF 并落到终态。 |
| 零散硬编码 | Drawer 关闭按钮、Select 箭头、TablePro 列管理、Menu 箭头改用语义动效令牌；Tree 箭头改用空间运动角色。 |

新增运行示例入口：Drawer“四个方向”包含 RTL 与旧时长变量兼容演示；Table“行展开”增加“20 行小批次”切换，用同一份订单数据对照小列表动画和 3,000 行直接更新。

## 自动验证

- 已运行令牌生成；生成文件均由 Wake 更新。
- 已执行 `corepack yarn install --immutable`，工作区依赖和锁文件一致。
- 12 个受影响包通过 lint、test、typecheck：rc-hooks、rc-token-semantic、rc-alert、rc-app-main-layout、rc-drawer、rc-menu、rc-masonry、rc-bar-chart、rc-select、rc-tree、rc-table、rc-table-pro。共 471 项组件测试通过。
- 文档站 lint、test、typecheck 通过，63 项站点测试通过；文档生成检查通过。
- 新增回归覆盖：退出 DOM 保留与即时回调、退出期间 inert、重新打开打断旧退出、展开高度反向、减少动态效果中途切换、大列表直接更新、卸载取消 rAF、关闭 animate 且目标数据不变、等值新数组不触发更新循环。
- Library 构建通过。文档站生产构建及 1,918 份 JavaScript 的绑定检查通过，未发现未绑定引用。
- 工具仍报告仓库原有的 Turbo 开发依赖循环、Yarn peer 提示和 PnP ESM 提示；组件与站点 lint 均为 0 errors / 0 warnings，未忽略 act warning 或泄漏。

## 浏览器核对

独立浏览器为正常动效模式，视口 1280 × 720。以下是实际 DOM、计算样式和连续采样结果，不是完整帧率测量。

- Alert：关闭开始即 inert；采样高度从 98px 缩至 24.95 / 18.84 / 8.41px，透明度同步下降，结束后卸载。
- Tree：展开子行高度采样 32.78 → 52.44 → 56px；收起采样 43.34 → 24.84 → 13.61 → 1.02px，退出节点保持 inert，终态移除。
- Table：20 行小批次详情高度采样 224.73 → 279.66 → 280px；收起 280 → 99.58 → 6.28 → 移除，相邻行位置同步变化，没有保留空洞。3,000 行示例直接移除详情，不播放布局补间。检查了最终表格截图。
- Drawer：左、右、上、下入场方向正确；RTL 的 left 从右边滑入、right 从左边滑入。RTL 演示通过旧变量将进入时长改为 200ms，计算样式确认生效。右侧关闭过程中面板 0 → 41.08 → 87.76 → 100%，遮罩同步淡出，两者立即 inert，结束后卸载。
- 工作区菜单：执行“重新加载页面”后立即进入 closed / inert，透明度采样 1 → 0.086 → 0 → 卸载。页面没有浏览器错误日志。标签形状和颜色保持原样。

本轮后段 Chrome 连接不可用，未完成修复后 Chrome reduced-motion=true 的 Spin 实测；动态偏好变化由回归测试覆盖，站点强制覆盖的移除已在源码核对。没有修改系统、浏览器或用户标签页的偏好。

## 边界与后续能力

- Tag 由父级删除的退出协调，报告已列为后续 API 能力；本轮未改变它的删除协议。月份、Form 状态图标、Tabs 面板和教程内容切换是报告中的可选增强，没有给所有内容统一添加入场动画。
- Alert 的自动高度补间依赖浏览器支持 `interpolate-size: allow-keywords`；不支持时仍可淡出并正确关闭，但不会获得相同的自动高度连续过渡。
- 100 行 / 40 行阈值是为虚拟布局成本设置的保守边界。此轮没有针对所有设备、主题、方向和最大数据量进行逐帧性能测量，不作全库完整 M3 合规声明。

## 设计参考

沿用报告已核对的规范与源码：

- [M3 Motion Specs](https://m3.material.io/styles/motion/overview/specs)：区分空间运动与效果变化。本轮 sheet/layout 有界曲线为贴边面板与虚拟尺寸选择；300/200ms 为项目令牌选择，不表述成官方强制时长。
- [Side sheets Guidelines](https://m3.material.io/components/side-sheets/guidelines)、[Specs](https://m3.material.io/components/side-sheets/specs)、[Accessibility](https://m3.material.io/components/side-sheets/accessibility)：左右 Drawer 参考 modal side sheet；上下方向为项目扩展。Material Web 没有直接对应的 Side Sheet 实现。
- [Material Web Dialog 文档](https://material-web.dev/components/dialog/)、[行为源码](https://github.com/material-components/material-web/blob/main/dialog/internal/dialog.ts)、[样式源码](https://github.com/material-components/material-web/blob/main/dialog/internal/_dialog.scss)、[令牌](https://github.com/material-components/material-web/blob/main/tokens/_md-comp-dialog.scss)：对照进出场生命周期、退出后释放与动效适配；其 v0_192 实现不等同于 Expressive 全组件规范。
- [Material Web Tabs 文档](https://material-web.dev/components/tabs/)、[Tab 源码](https://github.com/material-components/material-web/blob/main/tabs/internal/tab.ts)：保持用户指定的 Chrome 风格工作区扩展，本轮仅补菜单退出。
- [MDN prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion)：尊重减少非必要位移的偏好，由组件选择适当替代反馈。
