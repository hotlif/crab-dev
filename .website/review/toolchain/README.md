# Wake 0.1.43 与原生 Lint 迁移

日期：2026-09-16。用户明确要求升级 Wake 并用 Wake Lint 替换 ESLint；这一要求更新了此前的 Wake 0.1.38 锁定约定。原视觉质量提升仍在进行，本文件只记录工具链迁移。

## 版本与作用域

- npm 官方注册表的 `latest` 为 **0.1.43**；55 个清单的直接 Wake 依赖统一精确锁定，见 `before-migration.json` 的迁移前记录。
- 发布包 `CHANGELOG.md` 说明：0.1.39 增加匹配的 React / React DOM 19.3.0 支持；0.1.43 增加实验性原生 lint。0.1.40–0.1.42 未发布。
- React / React DOM 保持 19.3.0；公共 `@crab-dev/css` 依赖保持 0.1.38。Wake 自带的内部 CSS 依赖为 0.1.43，不改变本仓库公共令牌契约。
- 根目录与 53 个组件/站点工作区的代码检查使用 Wake；移除其 ESLint、React lint 插件和共享 ESLint 预设依赖，以及 53 份旧执行配置。生产绑定检查器也改用 Wake `lint()`。
- `standards-eslint-preset` 已发布的导出及所需依赖保留，供原有外部消费方兼容；本仓库没有通过它运行代码检查。`globals` 在站点仅提供生产 JS 的宿主名称数据，不执行 ESLint。
- `.yarnrc.yml` 的既有 elkjs 补充依赖声明从旧的 0.11.1 更新到实际安装的 0.12.0，保持 `web-worker` 1.4.1；解决流程图测试的 PnP 未声明依赖错误。没有降级 React 或更换测试执行器。

官方来源：[npm 发布包](https://www.npmjs.com/package/@crab-dev/wake/v/0.1.43)。版本、规则目录和兼容范围同时通过已安装发布包核对。

## 入口与配置

| 入口 | 实际工作 |
| --- | --- |
| 根目录 `yarn lint` | 检查 Node 工具和配置契约，再由 Turbo 调度 53 个工作区的 `lint` |
| 包内 `yarn lint` | `wake lint --root ../..`，显式指定本包 `src`、`docs` 和浏览器环境 |
| 站点 `yarn lint` | 分别检查阅读界面与脚本，脚本显式包含浏览器和 Node 全局环境 |
| 根目录 `yarn test:lint` | 7 项原生规则、源路径和局部抑制契约检查 |
| 站点 `yarn test:build` / `check:build` | 已知未定义绑定回归 / 全部生产 JS 绑定检查，使用 Wake Node API |

共享规则位于根 `wake.config.toml`。Wake 不穿过子包的 `wake.config.toml` 自动继承根 lint 规则，因此包内命令必须保留显式 `--root` 和相对根目录的源路径。Turbo 的 lint 缓存包含根配置。

生成令牌、生成 API 声明、构建产物和审查证据不作为手写源执行 lint；令牌契约、生成器检查、TypeScript 与生产绑定检查分别验证对应产物。不能通过忽略整个组件或关闭全部错误规则来取得通过结果。

## 规则映射与已知差异

0.1.43 的原生目录包含 77 条规则，官方未宣称完全兼容 ESLint。此迁移采用明确规则集，没有把原生默认推荐集当作原有预设的完整替代。

| 范围 | 本次处理 | 实际限制 |
| --- | --- | --- |
| JavaScript 错误 | 保留未定义引用、重复定义、不可达代码、空块、错误 finally、常量条件等原生对应规则 | 原 ESLint 推荐集并非每条都有原生对应实现 |
| JSX | 保留 key、重复属性、未定义组件及 children prop 等检查 | React 插件的完整推荐集、prop-types 等不能宣称等价 |
| TypeScript | 保留显式 any、TS 注释及 namespace 检查；独立 TypeScript 检查保持 | 生成 API 中合法 ambient namespace 不用原生 namespace 风格规则检查 |
| 未使用绑定 | 检查局部变量和导入，警告同样使命令失败 | 原生把类型签名的参数名称误当作运行时未使用参数；设置 `args = "none"`，因此本轮不声称覆盖未使用参数 |
| 四空格缩进 | 项目写作约定保持 | 原生 `style/indent` 的 TS/JSX 续行层级与现有格式不兼容，未启用；没有全仓格式重写 |
| 相对导入扩展名 | 保留项目 `.js` 约定、类型检查与构建验证 | 原生目录没有 `import/extensions` 等价规则，不能声称 lint 已检查这一约定 |
| 浏览器名称 | 对源码路径补充实际使用且缺失于 `browser@1` 的 DOM 全局名 | 声明全局可用不等于目标浏览器运行时必然支持该能力 |
| 抑制 | 将已有 any 测试替身例外迁移为 `wake-lint-disable[-next-line] ts/no-explicit-any`，保留理由与作用域 | 不新增覆盖全仓的抑制或诊断基线 |

### 已复现的原生差异

1. 类型 `type Handler = (value: number) => void` 的参数 `value` 会被 `js/no-unused-vars` 报为未使用；开启参数检查的全组件扫描记录于 `native-components-first.json`。
2. 按原 ESLint 四空格格式通过的 Button 包，在原生缩进规则下产生 315 项层级差异，记录于 `native-button-first.json`；没有运行原生全仓自动修复。
3. `lint.overrides.environments` 可在 `print-config` 的 globals 中显示 Node `process`，实际诊断仍报告未定义；显式 CLI/API 环境工作正常。局部 `overrides.globals` 已另行验证能作用于诊断。
4. 子包根目录不自动继承父级 lint 配置；入口通过显式根目录解决，不能仅在包内写一个裸 `wake lint`。

这些差异是本轮实测，不代表未来 Wake 版本的行为。升级后应先重跑最小复现和 `test:lint`，再决定是否恢复相关检查。

## 验证记录

| 检查 | 结果 |
| --- | --- |
| `yarn install --immutable` | 通过；旧 React 19.3.0 范围与 elkjs 过期扩展警告消失，仍有既存的依赖 peer 和 PnP loader 提示 |
| `yarn lint` | 53/53 工作区通过，0 条 lint 错误和警告；根工具与 7 项契约检查通过 |
| `yarn build:library` | 52/52 通过，使用 Wake 0.1.43 |
| `yarn check:tokens` | 48 个令牌包通过 |
| 站点 `yarn test:build` | 5 项绑定回归通过 |
| `yarn typecheck` | 106/106 任务通过，包含依赖构建 |
| 文档生成 / `check:docs` | 52 个组件页、55 份教程、117 个教学示例、246 个 Demo；检查模式 0 个变化 |
| `yarn test:generator` | 26 项通过 |
| 站点 `yarn build` | 重试通过；80 条路由，1,891 个生产 JS 文件无未定义引用。首次 Windows 生成文件写入 `UNKNOWN` 错误保留在日志 |
| 全仓 `yarn test --continue` | 103/105 任务成功（包含依赖构建），失败任务为 Drawer 和站点；旧 React 版本范围阻塞已解除，失败详情见下表 |
| 生产页面复测 | 264/266 项通过、0 个运行异常；覆盖已有画布、流程图、树、图表和基础组件的明暗主题、320 / 768 / 1440 px 布局及局部键盘滚动。两项失败为同一个横向菜单在浅色 / 深色 320 px 下溢出，不能标为整轮通过 |

### 测试修复与剩余失败

| 范围 | 本轮结果与处理 |
| --- | --- |
| ColorPicker | 两处旧 motion 替身补齐 `useReducedMotion`，真实嵌套浮层继续执行；50 项通过 |
| ComponentPreview | 将真实懒加载模块的解析纳入 `act`，增加已呈现源码断言，保持异步告警门禁；3 项通过 |
| FlowDiagram | 修正 PnP 补充声明后，2 个测试文件、8 项通过 |
| Drawer | 11 项通过，1 项名称查询失败：`drawer.test.tsx:68` 的 `getByRole('dialog', { name: '项目详情' })` 未找到目标。未删改断言或加入跳过，需进一步复核测试宿主的名称算法和实际 DOM |
| 站点 | 生成器与一致性通过；React 部分 2 个文件通过、5 个失败，已执行断言为 20 通过 / 1 失败 / 4 pending。三个文件在导入 CSS 时被测试转换器按 JS 解析；资料表单加载 motion 报 `Cannot redefine property: VisualElement`；令牌动效测试的角色名称查询失败。pending 是依赖加载失败后的实际结果，没有添加跳过标记 |

首次全仓运行未能完整执行站点 React 测试，因为生成内容尚未刷新。刷新后才暴露上述模块加载问题；不能据此声称这些失败全部由升级引入，或全部已在旧版本复现。生产构建及浏览器复测与测试宿主结果分别记录。

### 当前生产候选与视觉待办

候选 SHA-256：`37682c5ac871456626c36cbe1c5a56382b80bbd5805bbce3626529b857f47ac8`。完整实测数据见 [gallery-layout.json](../quality/production/gallery-layout.json)，对应日志为 `production-gallery.log`。

横向 Menu 的 `horizontal.demo.tsx` 在 320 px 下测得整页宽 337 px，浅色和深色一致，列为持续视觉审查的 P2 待修问题。它不是 lint 迁移的通过条件，也没有被删除或隐藏；应复核菜单收纳及文本宽度后修复。当前生产复测仅覆盖布局、内容存在及所列局部滚动，不替代完整图表编辑、屏幕阅读器和全站两轮审查。

日志见本目录。保留首次失败记录与最终结果，不能把“升级安装成功”写成全部检查通过。既存的循环包拓扑警告仍单独列出，不属于原生 lint 诊断。
