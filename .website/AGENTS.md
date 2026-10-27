# 组件库文档约定

继承[根规则](../AGENTS.md)。本工作区提供组件库查阅、设计规范、可运行示例和贡献维护文档，不承担应用开发平台职责。

- [规范目录](docs/guides/)是库架构、公共 API、设计、尺寸密度、迁移和维护规范的唯一正文；规则变化同步类型、实现、示例、测试和 AGENTS 索引。
- 产品元数据只维护根[产品清单](../library.manifest.json)，通过[共享读取器](../scripts/library-manifest.mjs)读取。导航、覆盖矩阵、目录和数量由生成器派生。
- 组件正文来自 `components/rc-*/docs/index.mdx`，示例来自各包 `docs/demos/`；教学文字来自 `content/`，运行文件来自 `docs/examples/`。展示源码直接提取运行文件。
- 不手改 `docs/components/`、`docs/_generated*/`、生成的学习/实战页、`docs/navigation.toml` 和覆盖矩阵。修改来源后运行 `generate:docs`，生成器变化补契约测试。
- 示例使用公开包入口，独立可复制，不依赖组件 src、相邻示例或隐藏辅助文件；复用已有控件。
- 使用公共 registry 和 Provider，默认 MD3 Expressive；设计体系、明暗、尺寸、密度独立。Wake 外部 theme 协议仅在适配边界保留，应用 API 用新字段。
- 旧 material/macos 只在浏览器历史偏好迁移函数接受；新接口、CSS 值、iframe 消息和示例不兼容旧 ID。保留存储 key 并写回新值。
- Portal、受控 iframe 与预览 Provider 传递完整八项公共配置，以最近边界的已解析值为准；站点边界解析 system，代码高亮独立跟随站点明暗。独立工作台在父配置接管前恢复浏览器设计/明暗偏好。切换不重建输入实例或清空草稿。
- 样式只作用于站点自有结构并使用公共令牌，不覆盖 Wake 私有类或污染真实组件演示。
- 验证 generate:docs/check:docs/test:generator；运行代码另跑 lint/typecheck/test/build。按范围核对三体系、浅深色、窄屏、键盘、焦点、强制颜色和减少动画。
- review 仅保存注明日期、提交/产物、范围和实际结果的证据；历史不等于当前规范，不擅自删除。profile、临时构建和缓存不作为正式证据提交。
