# 恢复原有 Chrome 式工作区标签

日期：2026-09-23。用户明确指出上一版改变了原有设计，要求恢复类似 Chrome 的工作区标签。此指令优先于此前将该区域套用 M3 Primary Tabs 的建议；此处不再以 Primary Tabs 下划线作为选中指示。

## 恢复依据与范围

已读取 `f24857b8` 的 `components/rc-app-main-layout/token.toml` 及 HEAD 中保留的 Chrome 标签样式。原实现为 40px 标签条、34px 标签、240px 最大宽度、13px 字号、10px 顶部圆角与底部外弧角、16px 内容图标、18px 关闭按钮及 10px 关闭图标。

- 标签条恢复到工具栏上方。
- 选中标签使用实色容器，与下方工具栏共用表面颜色（后续配色调整为 `color.workspace.toolbar`）；恢复两侧底部外弧角，移除 Primary Tabs 指示线及栏底分隔线。
- 恢复长条形、可随空间收缩的标签和中性文字颜色；未选中项保留细竖分隔线，选中项相邻分隔线隐藏。
- 恢复紧凑关闭按钮；视觉尺寸为 18px / 图标 10px，透明命中区保持 32px，避免 48px 大按钮改变原有观感。
- 保留原有鼠标拖拽及前轮修好的减少动态效果、键盘切换、Delete 关闭、上下文菜单、tab/tabpanel 关联和关闭后的焦点恢复。
- 窄屏继续允许横向滚动；标签最小宽度为 96px，以保留标题和关闭入口，而不是历史上的 28px。粗指针环境将标签高度扩大至 48px、关闭区域扩大至 32px，桌面保持原有紧凑密度。
- 删除上一轮专为下划线动画添加的 rc-tabs 依赖及 useTabIndicator 对外导出；独立 rc-tabs 组件原有功能和动效不变。

## 验证

- Yarn 更新锁文件与 PnP，`install --immutable` 通过。
- AppMainLayout、Tabs 的构建、lint、类型检查、测试通过；21 个 Turbo 任务成功，31 + 18 = 49 项测试通过。
- 两个工作区 lint 均为 0 errors / 0 warnings；Turbo 保留既有开发依赖循环提示。
- token.ts 由 `generate:token` 生成，未手工编辑。
- 相关 diff 空白检查通过。日志：[chrome-restore-checks.log](./chrome-restore-checks.log)。
- 浏览器检查浅色与深色主题：标签在工具栏上方，标题左对齐，桌面标签为 240 × 34px，底部外弧角为 10px，选中背景与工具栏颜色一致，无下划线指示器。
- 390px 窄屏下，两枚标签收缩为各 134.5px，标签条仍可见；方向键切换正常，Delete 关闭当前标签后焦点返回剩余标签；浏览器无错误日志。

该工作区标签是用户指定的 Chrome 风格设计，不宣称它是 M3 标准标签组件。

## 后续配色调整

用户指出颜色不合适后，将工作区大面积底色改为中性灰，保留 Chrome 式造型及原有品牌强调色。背景不再直接使用带紫色调的通用 Material 表面；通过 L2 `color.workspace.*` 定义工作区用途，由 rc-theme 切换明暗值，组件层不增加主题分支。原有通用主题颜色不变。

| 区域 | 浅色 | 深色 |
| --- | --- | --- |
| 标签栏 | Zinc 200，`oklch(0.900 0.004 286)` | Zinc 900，`oklch(0.220 0.005 286)` |
| 选中标签与工具栏 | White，`oklch(1 0 0)` | Zinc 800，`oklch(0.320 0.008 286)` |
| 侧栏 | Zinc 100，`oklch(0.950 0.003 286)` | Zinc 900 |
| 内容区 | White | Zinc 900 |

未选中标签悬停色取标签栏与工具栏的中间色，避免悬停等同选中。工具按钮和关闭按钮使用前景色透明状态层，分隔线使用较轻的 outline-variant 对应角色。强制颜色模式映射为 Canvas，继续使用现有选中轮廓。

实际参考（访问日期 2026-09-23）：[M3 Color roles](https://m3.material.io/styles/color/roles)（已在浏览器读取中性表面、亮暗表面与分隔线说明）、[Material Web Color](https://material-web.dev/theming/color/)、[Material Web v0.192 颜色令牌源码](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-sys-color.scss)。采用其中的表面分层、前景配对和主题映射原则；Chrome 工作区与 Zinc 灰阶是本项目按用户要求的定制，不是 M3 Primary Tabs。

验证：

- 按依赖顺序生成 L2 / L3 令牌；三个受影响包的构建、lint、类型检查通过，23 个 Turbo 任务成功，7 + 9 + 31 = 47 项测试通过。lint 0 errors / 0 warnings，保留既有 Turbo 依赖循环提示。日志：[color-checks.log](./color-checks.log)。
- 扩展已有主题测试，确认工作区表面的主/次文字对比度不低于 4.5:1，焦点颜色不低于 3:1；独立令牌默认值与浅色主题保持一致。
- 浏览器核对浅色、深色的默认 / 选中 / 未选中悬停 / 键盘焦点；选中标签与工具栏背景完全一致，标签仍为 240 × 34px，无浏览器错误日志。
