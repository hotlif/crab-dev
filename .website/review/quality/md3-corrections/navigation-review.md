# 导航复查（2026-09-21）

用户指出旧截图不符合 M3 后重新检查。这份记录替代上一轮对导航轨和侧栏的验收结论；旧浏览器报告不代表当前导航。

## 确认的问题与修正

- 旧站点同时展示导航轨和常驻分类侧栏。改为一套桌面常驻导航抽屉；小于 1024px 时使用现有 rc-drawer 模态导航。
- 旧标签把英文名称和中文说明强制分成两行。改为 14/20px 单行标签，保留完整中英文名称与可访问名称；空间不足时省略，不缩小字号。
- 去除树形连线、选中竖条和子项额外缩进。当前页面只用 secondary-container 胶囊、on-secondary-container 文字及强调字重；展开分类只用箭头表达展开状态。
- 导航项高 56px，相邻项间距为 0；抽屉外侧 12px、标签内侧 16px。桌面最大宽 360px，较窄桌面自适应到 280px；手机保留遮罩可点击区域。
- 覆盖导航内按钮的按压圆角令牌，防止复用 Button 的 Expressive 按压形状时变成 8px 圆角。hover/pressed 只叠加状态颜色，导航胶囊和尺寸保持稳定。
- 分类展开/收起保持正文状态；文档链接保留部署前缀和修饰键行为。手机选择页面后关闭抽屉，退出完成后恢复正文焦点。

## 实际参考

- [M3 Navigation drawer guidelines](https://m3.material.io/components/navigation-drawer/guidelines)：在浏览器中读取完整页面，核对单一主导航、单行标签、分组分隔和响应式行为。
- [M3 Navigation drawer specs](https://m3.material.io/components/navigation-drawer/specs)：在浏览器中核对颜色角色、360px 宽、56px 项高、28px 标签起点、12px 指示器留白、零项间距。参考截图为 `navigation-reference.png`。
- [Material Web drawer tokens](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-navigation-drawer.scss)：核对 indicator shape、尺寸、标签排版、颜色和交互状态角色。
- [Material Web Lists 文档与示例](https://material-web.dev/components/list/)及[实际样式](https://github.com/material-components/material-web/blob/main/list/internal/listitem/_list-item.scss)：作为可交互列表的状态、焦点和文字布局参考。Material Web 官网没有独立的稳定 Navigation drawer 组件文档；未把普通 List 的外形冒充导航抽屉规范。

这里采用 M3 baseline 抽屉。官方 Expressive 更新推荐 expanded navigation rail，本轮没有声称实现该新变体。文档的可折叠多级分类是产品扩展；280–360px 自适应宽度用于保留正文空间。焦点采用项目可访问焦点环与强制颜色轮廓，未引入 Material Web 运行时。

## 验证

`navigation-review.mjs` 检查亮暗主题下 320、768、1024、1440px：单一可见导航、无导航轨、单行 14px 标签、56px 项高、无树线与额外选中标记、无横向溢出、键盘焦点可见，以及模态导航关闭、页面跳转和强制颜色轮廓。另外通过真实鼠标事件核对选中项与分类按钮的 default/hover/pressed 颜色、尺寸和圆角。结果保存在 `navigation-checks.json`，截图为 `navigation-{宽度}-{主题}.png`。

站点 lint 与 typecheck 通过；测试使用包内 `yarn test`，包含分类切换保留正文、路由选中、目录页初始分类与移动抽屉行为。生产构建包含生成文档检查与 JS 未绑定引用检查。
