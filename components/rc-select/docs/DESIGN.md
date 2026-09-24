# Select 设计与维护记录

本文件记录组件实现取舍。面向使用者的属性和交互说明见 `index.mdx`。

## 图标与字段布局

2026-09-24 核对 M3 Text fields 的 outlined / filled 变体及 Material Web Select。

- 图标槽为 24px，清除操作区按 small / middle / large 使用 32 / 40 / 48px；粗指针下至少 48px。
- 按用户要求，清除和展开箭头共用一个按钮节点与固定操作位；悬停整个字段时显示清除，进入按钮或 SVG 不算离开，离开整个字段恢复箭头。加载指示仍独立占位。悬停切换与三档尺寸是本库扩展，不是 M3 强制规则。
- filled 的内容区为浮动标签保留顶部空间，尾部图标仍垂直居中。窄字段中的标签为尾部操作区预留宽度。
- 尾部按钮复用 Button 的原生激活和焦点行为。聚焦该按钮时显示清除，Enter / Space 清除后焦点返回 Select，并关闭列表。无 hover 能力的设备在有可清除值时直接显示清除；空值、禁用或未启用 allowClear 时保持箭头。

参考：[M3 使用指南](https://m3.material.io/components/text-fields/guidelines)、[规格](https://m3.material.io/components/text-fields/specs)、[无障碍](https://m3.material.io/components/text-fields/accessibility)、[Material Web 示例](https://material-web.dev/components/select/)、[行为源码](https://github.com/material-components/material-web/blob/main/select/internal/select.ts)、[图标布局](https://github.com/material-components/material-web/blob/main/select/internal/_outlined-select.scss)、[v0_192 图标令牌](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-comp-outlined-select.scss)。其中 `main` 链接随上游更新，不代表固定发行版本。

验证：lint、typecheck、36 项测试及 library 构建通过。浏览器核对了三档尺寸、两种外观与浅深色主题，鼠标从内容区移到清除中心、移出恢复，以及鼠标 / Enter / Space 清除和焦点恢复。切换前后尾部只有一个按钮，字段宽度保持不变。

## 边框与焦点

2026-09-23 的实现对照使用 Material Web 提交 `849b4dce877863752bbfd62f74f52829b2430868`。

outlined 聚焦或展开时，将 1px 描边向内加粗为 3px；filled 加粗底线。error / warning 沿用该边界，搜索输入由 Select 外层表示焦点；清除按钮保留独立焦点指示。强制颜色模式保留系统色轮廓。

参考：[outlined 样式](https://github.com/material-components/material-web/blob/849b4dce877863752bbfd62f74f52829b2430868/select/internal/_outlined-select.scss)、[filled 样式](https://github.com/material-components/material-web/blob/849b4dce877863752bbfd62f74f52829b2430868/select/internal/_filled-select.scss)、[描边令牌](https://github.com/material-components/material-web/blob/849b4dce877863752bbfd62f74f52829b2430868/tokens/_md-comp-outlined-select.scss)、[底线令牌](https://github.com/material-components/material-web/blob/849b4dce877863752bbfd62f74f52829b2430868/tokens/_md-comp-filled-select.scss)。
