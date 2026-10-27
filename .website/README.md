# 组件库文档与工作台

本工作区服务 Crab UI 的组件查阅、设计规范、可运行示例、迁移与维护。工程版本以 package.json 为准；工具职责和约束见根 AGENTS 与本目录 AGENTS。

## 唯一来源

| 内容 | 来源 |
| --- | --- |
| 产品名称、能力族、用途、生命周期、设计覆盖 | 根 library.manifest.json，统一读取 scripts/library-manifest.mjs |
| 组件正文与 API 入口 | components/rc-*/docs/index.mdx |
| 组件交互示例 | components/rc-*/docs/demos/*.demo.tsx |
| 教学文字与 FAQ | content/ |
| 独立运行教学文件 | docs/examples/ |
| 架构、公共 API、设计、迁移与维护规范 | docs/guides/ |
| 站点布局、组件适配与工作台桥 | docs/site/ |

文档生成器派生六族导航、组件目录、覆盖矩阵、库存、聚合组件页、API 搜索数据和教程源码；示例数量按源文件统计，不固定阈值。根 README 的产品清单区域同样生成。禁止手改生成文件。

API 聚合以真实类型源码为优先来源，递归接口/别名、联合/交叉、相对/workspace 导入和泛型状态参数，保留受控互斥信息；逐个 API 标签生成副入口适配接口，补足当前 Wake docgen 的有限展开能力。原始 public/docgen.json 只能由对应命令刷新，合成适配文件也由生成器产生。

## 设计与运行边界

站点、嵌入示例与独立工作台统一默认 MD3 Expressive，并使用公共设计 registry、ConfigProvider 与 L2 语义角色。设计体系为 md3/apple/shadcn；明暗、尺寸和密度独立。外观菜单读出当前体系和明暗；只在读取旧浏览器偏好时迁移 material/macos，并写回新 ID。

Wake 继续管理路由、搜索和 light/dark/system 偏好。system 在网站边界解析为 light/dark 后传给公共 colorMode；组件库不接受 system/auto。受控 iframe 从最近 ConfigProvider 发送 designSystem、colorMode、brandColor、size、density、locale、direction、nonce，显式内层配置优先于站点明暗。消息只接受同源父窗口，完整校验后更新预览 Provider；省略可选字段保留已接收值，brandColor 的 null 恢复设计默认，显式 undefined 移除品牌或 nonce 的预览局部覆盖并继承最近边界。独立 iframe 根无父 React 上下文时按公共默认值解析。DOM 保留 data-crab-design/data-theme，并同步尺寸、密度、语言与方向；切换不重建运行示例。代码高亮继续独立跟随站点明暗。

站点通过项目内 docs/theme.css 加载公共 CSS-only 主题，组件样式随模块构建加载。样式使用公开令牌和自有结构，不覆盖 Wake 私有类，也不覆盖真实示例的控件样式。主题和代码预览没有第二份色板。

## 开发与检查

仓库根 yarn docs:dev 先构建库，再启动增量文档；产品清单、正文、Demo、真实类型源码、教学文字和运行文件变化时重新生成。修改 UI 或加载配置后重启开发服务。

在本工作区运行 generate:docs、check:docs、test:generator、lint、typecheck、test、build。构建成功后 preview 在本机 4173 提供生产预览。子路径使用 DOCS_PREVIEW_DIR、DOCS_PREVIEW_BASE、DOCS_PREVIEW_PORT 配置，并遵循当前 shell 语法。

浏览器验收覆盖适用的三体系、明暗、尺寸/密度、320/768/桌面、长内容、键盘与焦点、触控、强制颜色和减少动画。verify-workbench-themes 检查公共主题边界，配置/Portal/消息测试检查行为，二者不能替代组件逐状态视觉核对。

## 证据

review 保留历史，不作为现行规则或自动通过证明。新记录标明提交、产物、日期、范围、命令、结果和未验证项；正式规范维护于 guides。不得删除既有审查历史，也不得提交浏览器 profile、缓存和临时构建作为证据。
