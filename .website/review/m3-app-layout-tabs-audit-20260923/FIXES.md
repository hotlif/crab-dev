# AppMainLayout 标签栏修复记录

**此版本的 Primary Tabs 视觉方案已撤回。** 用户要求恢复原来的 Chrome 式标签，最新实现以 [Chrome 式标签恢复记录](./CHROME-RESTORE.md) 为准。下方是上一版过程记录，不能据此再次把工作区标签改为下划线页内导航。

日期：2026-09-23。已修复审查中的四项问题。采用 M3 Primary Tabs 的视觉结构，延续项目现有 expressive motion 令牌；关闭与排序属于工作区扩展。

## 实现

- 标签栏移到顶部工具栏下方，直接邻接内容区；增加底部分隔线和 3px 主色选中指示器，指示器随标题宽度变化，清理无效的 Chrome 曲线与竖分隔结构。
- 取消短标签固定占用 240px 的布局，按内容排布并保留最大宽度与长文本省略。文字使用 title-small 语义令牌；图标与关闭图标使用 24px，关闭按钮命中区域为 48×48px。
- 标签和关闭操作复用 rc-button，以兄弟按钮呈现，避免将关闭按钮嵌套在 tab 按钮内。关闭按钮持续可见，带可访问名称与标签说明。
- 使用 roving tabindex，支持方向键、Home、End、Enter/Space 原生激活、Delete 关闭，以及 Shift+F10 / ContextMenu 打开菜单。RTL 下按物理方向导航和重排。
- 通过 Layout 的 useId 前缀关联 tab 与具名 tabpanel；多个布局实例的 ID 独立。关闭后恢复到仍存在的标签，最后一项或菜单“关闭所有”完成后，焦点回到侧栏菜单按钮。
- 窄屏保留标签栏，溢出时横向滚动，激活与尺寸变化时将选中项移入视野。触摸手势用于原生滚动；桌面指针保留拖拽排序。
- 从 rc-tabs 公开并复用 useTabIndicator，兼容 React Key 与空标签状态。共享可中断指示线动效和减少动态效果处理，保留布局原有重排动效。新增工作区依赖使用 workspace:^，未引入第三方组件或动画库。
- 修改的 token.toml 已通过生成命令刷新 src/token.ts；依赖锁文件和 PnP 由 Yarn 生成。

## 自动化验证

- `yarn install --immutable` 通过。
- 两个受影响工作区的 `build:library`、`lint`、`typecheck`、`test` 通过：21 个 Turbo 任务成功。
- AppMainLayout 31 项、Tabs 18 项测试通过，共 49 项；两个工作区 lint 均为 0 errors / 0 warnings。
- 新增回归覆盖键盘选择、可关闭限制、关闭及批量关闭后的焦点、唯一面板关联、键盘菜单、RTL 导航 / 重排、触摸手势不误触重排。原有指示线中断、减少动态效果、释放动画完成与取消测试继续通过。
- Turbo 仍报告原有 menu / masonry / spin / button / component-preview 开发依赖循环；与前轮日志相同，本轮未增加该循环。
- 最终日志：[final-checks.log](./final-checks.log)。本轮未运行整站生产构建。

## 浏览器验证

使用独立 Wake Docs 开发服务验证最新产物，覆盖浅色、系统深色、1081px 桌面及 390px / 320px 窄屏。

| 检查 | 实测结果 |
| --- | --- |
| 单个“概览”标签 | 主标签 64×48px，选中线 28×3px、opacity=1；关闭按钮 48×48px、内部图标 24×24px。 |
| 浅色 / 深色 | 主色指示线、分隔线、文字均可见，键盘焦点环可见。 |
| 键盘关闭 | Tab 从标签进入关闭按钮；Enter 关闭最后一项后，焦点回到 Toggle sidebar。 |
| 多标签切换 | 菜单打开“成员管理”，ArrowLeft 返回“概览”；选中语义、指示线与内容同步。 |
| 390px 窄屏 | 标签栏保持 48px 高，可以切换“概览 / 成员管理”，显示对应内容。 |
| 320px 溢出 | 可视宽度 219px、内容宽度 248px；Home 返回 scrollLeft=0，End 激活末项后 scrollLeft=29，末项及关闭按钮完全进入视野。 |
| 浏览器错误 | 验收页面未记录 error 级别日志。 |

本轮没有逐一覆盖任意业务标题、系统强制颜色或所有浏览器，不声称整个站点已经全面符合 M3。关闭、排序和焦点环采用项目组件能力；这些扩展不冒充官方标准 Tabs 变体。

## 官方对照

沿用审查阶段读取的 M3 使用指南、规格、无障碍及 Material Web 文档和示例；本轮再次只读核对以下固定提交的样式及令牌（`9200eb8a0eef99c6bd439ce3968952d76e9ec1b4`）。

- [M3 Tabs 使用指南](https://m3.material.io/components/tabs/guidelines)、[规格](https://m3.material.io/components/tabs/specs)、[无障碍](https://m3.material.io/components/tabs/accessibility)
- [Material Web Tabs](https://material-web.dev/components/tabs/)、[交互示例](https://material-web.dev/components/tabs/stories/)
- [Tab 样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/_tab.scss)、[Primary Tab 样式](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/_primary-tab.scss)
- [Primary Tab 令牌](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tokens/_md-comp-primary-tab.scss)、[行为源码](https://github.com/material-components/material-web/blob/9200eb8a0eef99c6bd439ce3968952d76e9ec1b4/tabs/internal/tab.ts)
