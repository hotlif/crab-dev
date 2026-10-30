---
"@crab-dev/rc-bar-chart": patch
"@crab-dev/rc-flow-diagram": patch
"@crab-dev/rc-pdf-editor": patch
"@crab-dev/rc-realm": patch
---

补充专业组件三体系的桌面扩展规格、公开入口 Demo 与 Playwright 状态矩阵。图表图例补齐真实按下反馈，提示使用三体系浮层边界；图例和提示间距通过 L3 令牌继承密度，Realm 的反馈样式与远程加载状态机分离。PDF 和流程图的领域坐标保持原有协议，并提供加载、失败、编辑、键盘及配置切换的实际引擎场景。

Realm 新增同源 script / ESM 网络入口与真正 Web Component 示例，使用现有生产加载协议，核对远程属性更新、Shadow DOM 草稿、网络失败重试和卸载。预注册容器、网络入口和实际自定义元素分别记录覆盖；场景发现和默认测试不代替候选截图复审。

修复 BarChart 图例与提示引用静态 space 导致三档密度相同的问题，改为消费 L2 density 节奏角色，保留 standard 间距及绘图坐标、柱宽和数据；增加真实浏览器几何不变量回归。

补齐 Flow 真实画布呈现及公开 fit/pan/domain zoom/PNG 导出场景。PDF 增加带原许可的真实字体与固定文档/图片资源，覆盖实际文本、图像、变换历史、绘图、保存导出、工具栏和区域插件；独立 Web Component 继续使用同一生产产物与内嵌运行时，WASM loading 补齐三尺寸三密度自然动画矩阵。旧示例改用公开入口与公开资源，移除隐式 Demo helper 依赖。
