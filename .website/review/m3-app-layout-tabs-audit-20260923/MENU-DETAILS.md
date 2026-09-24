# 头像菜单细节优化

日期：2026-09-23。依据用户截图，只调整 AppMainLayout 右上角头像、用户操作菜单及相邻工具按钮；保留 Chrome 式标签、灰色配色和整体布局。

## 调整

- 复用 rc-avatar：默认显示用户图标，有名字且无头像时使用首字；32px 头像配 48px 对称按钮，替换空白紫色圆点和不对称留白。自定义头像仍可传入。
- 复用 rc-button 承载头像触发器与菜单动作，保持统一的 hover、pressed、focus-visible 反馈；移除铃铛与头像之间多余的竖线。
- 用户菜单与标签右键菜单分离设计令牌。菜单宽 192px、内边距 8px、圆角 12px，移除常态描边，将阴影从 level 3 降为 level 2。
- 菜单沿按钮右侧对齐，下方留 8px 间距；透明悬停区域连接间隙，避免鼠标移入菜单时因间隙中断悬停路径。
- 菜单文字 14px / 20px，图标 20px，桌面行高 40px，粗指针行高 48px；工具栏图标统一为 20px。保留切换角色、退出登录回调。
- 菜单在强制颜色模式使用 CanvasText 轮廓；继续适配减少动态效果。

## 参考与差异

实际查阅了 [M3 菜单规格](https://m3.material.io/components/menus/specs)、[使用指南](https://m3.material.io/components/menus/guidelines)、[无障碍说明](https://m3.material.io/components/menus/accessibility)、[Material Web 菜单文档与示例](https://material-web.dev/components/menu/)，以及 [容器样式](https://github.com/material-components/material-web/blob/main/menu/internal/_menu.scss)、[行为源码](https://github.com/material-components/material-web/blob/main/menu/internal/menu.ts)、[v0.192 菜单令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-menu.scss)。访问日期为 2026-09-23。

采用临时菜单的表面/前景配对、level 2 阴影、锚点定位和 Web 密度原则。12px 圆角、14px 字号与中性工作区背景是延续用户 Chrome 风格要求的局部定制，并非宣称严格等同于 M3 baseline 菜单或迁移为完整 Expressive 菜单。

## 验证

- `install --immutable` 通过，令牌由生成命令刷新。
- AppMainLayout 的构建、lint、类型检查及 31 项测试通过，19 个 Turbo 任务成功；lint 0 errors / 0 warnings。保留既有 Yarn peer 和 Turbo 开发依赖循环提示。
- 无布局 DOM 测试对浮层定位使用最小替身，菜单事件与回调保持真实；定位尺寸在浏览器另行核对，未忽略 act warning。
- 浏览器实测头像 32 × 32px、触发按钮 48 × 48px、菜单 192px 宽 / 12px 圆角 / 0px 边框，按钮与菜单右边缘差为 0px，垂直间距 8px。浅色、深色与 390px 窄屏检查完成，无浏览器错误日志。

验证日志：[menu-details-checks.log](./menu-details-checks.log)。
