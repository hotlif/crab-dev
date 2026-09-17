# Wake 0.1.43 CSS 加载验证

验证日期：2026-09-17。环境：Windows、Node 22、Yarn 4 PnP。

## 调整范围

- 从文档外壳、教学示例与使用说明中移除 291 处 JavaScript CSS 副作用导入，涉及 134 个手写文件。
- 通过文档生成命令刷新展示源码；教学示例生成检查拒绝新增 `import "…css"`。
- 保留 Crab CSS 的源模块入口，例如 `import "./siteStyles.js"`：它们供构建期提取 `globalStyle`，不是加载生成 CSS 的运行时入口。

## 自动加载的边界

普通组件随模块引用自动加载样式。移除显式 CSS 导入后，生产页面的 ColorPicker 触发器仍为 34 × 34 px、1 px 边框和 6 px 圆角；Button 高度仍为 32 px，主要按钮填充与常规按钮阴影生效。ColorPicker 弹层的 Slider、Select 和 Button 样式也正常。

CSS-only 的 `rc-theme` 没有组件引用入口，仅在网站依赖中声明该包（包括其 `style` 字段）不会加载主题 CSS。初次移除后实测：

| 检查项 | 结果 |
| --- | --- |
| 切换深色后的根属性 | `data-theme="dark"` |
| `--token-semantic-color-brand-primary` | 空值 |
| 文档背景 | 仍为浅色 `oklch(0.98 0.002 286)` |

浅色页面仍能显示，是因为组件令牌带有默认值，不能据此认定主题已加载。

最终接入使用 Wake 已有的 `docs.theme_css = "docs/theme.css"`。项目内的 CSS 入口通过 `@import "../../components/rc-theme/css/index.css"` 引用公共主题，由 Wake 处理；没有恢复 JavaScript CSS 导入，也没有复制主题令牌。`theme_css` 不能直接指向项目外路径，否则 Wake 报 `must be inside project root`。

## 自动验证

- 文档 Lint：0 errors、0 warnings。
- 文档 TypeScript 类型检查：通过。
- 文档生成器：26 项通过；生成检查无差异。
- 仅移除 CSS 导入的首轮生产构建：81 个路由构建成功，1899 个生产 JavaScript 文件检查无未绑定引用。
- 最终主题入口：81 个路由构建成功，1899 个生产 JavaScript 文件检查无未绑定引用，完整构建命令退出码为 0。

## 最终浏览器验证

在 `http://127.0.0.1:4175` 重新加载最新生产产物后验证：

- Button 与 ColorPicker 的浅色、深色切换正常；深色背景为 `oklch(0 0 0)`，文字为 `oklch(0.98 0.002 286)`，公共品牌变量恢复为 `oklch(0.83492620 0.09457492 298.017957)`。
- Button 第 5 步动态加载成功，明暗面板、禁用、加载与选中样式正常，8 个常规状态按钮均为 32 px 高。
- 切换蓝色品牌后，浅色与深色选中按钮分别使用 `oklch(0.563657 0.18 259.039)`、`oklch(0.798657 0.101899 259.039)`，确认 ConfigProvider 的品牌变量继续生效。
- ColorPicker 弹层在明暗模式下使用对应前景与表面色，依赖的 Slider、Select 和 Button 保持样式。
- 浏览器错误日志为空；验收后恢复 ColorPicker 页面与浅色主题。

## Wake Test 尚未通过

执行 `corepack yarn workspace @crab-dev/website test`，CSS 被误当作 JavaScript 解析的问题不再出现，但整套测试仍未通过：2 个套件通过、5 个套件失败；29 项通过、5 项失败、25 项未执行。

| 套件 | 观测到的错误 |
| --- | --- |
| `ui.test.tsx` | 初始化动画依赖时 `Cannot redefine property: VisualElement`，21 项未执行 |
| `profile.test.tsx` | 同样的 `VisualElement` 初始化错误，4 项未执行 |
| `tutorial.test.tsx` | 3 项失败：React 收到 object 类型的组件，涉及模块/替身互操作，仍需定位 |
| `componentDemos.test.tsx` | 超时重试用例查询到多个相同 role 的元素 |
| `tokenReference.test.tsx` | 主动播放用例未找到预期 role 的元素 |

以上错误尚未修复；本次没有通过增加 CSS 或动画替身来隐藏失败。它们不等同于浏览器中组件 CSS 未加载。
