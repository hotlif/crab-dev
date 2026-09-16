# TypeScript 7 / Yarn PnP 修复记录

验证日期：2026-09-13。环境：Windows、PowerShell 7.6.5、Node.js 22.15.0、Yarn 4.18.0。

## 已完成的结果

主仓库的 Typecheck 和 ESLint 已通过。保留 Yarn PnP 和工作区 TypeScript 7 依赖，没有改变 AGENTS.md 的 node_modules 禁令，没有降低严格模式或过滤诊断。组件测试在主仓库仍有 Wake 版本冲突，不能将本次结果表述为“所有测试已经通过”。

最终检查发现根目录残留一个创建于 2026-09-11 的空 `node_modules/.cache` 目录树。确认其中没有文件和链接后已清理；根目录及各工作区没有 `node_modules` 依赖目录。

| 验证 | 结果 |
| --- | --- |
| 根目录 `yarn typecheck` | 54 个工作区；连同 52 个依赖构建，106/106 任务成功，最终完整运行没有使用 Turbo 缓存 |
| 根目录 `yarn lint` | 新增工具脚本检查通过，52/52 工作区 ESLint 成功 |
| TypeScript 预设包 `yarn test` | Wake Test：6/6 回归用例通过 |
| 原生 PnP 补丁自带 Go 测试 | `internal/pnp`、`internal/vfs/pnpvfs` 均通过 |
| 无预装 Go 的首次准备流程 | SDK 下载、SHA256 校验、原生编译与补丁测试通过 |
| Table 生成声明，显式 `skipLibCheck: false` | 原生 TypeScript 7 检查通过；原来的 12 个 TS2371 和 1 个 TS2304 已消失 |
| 文档生成器及生成一致性 | 23 项测试通过；`check:docs` 显示 0 个文件变化；文档站 Typecheck 通过 |
| 主仓库 `yarn install --immutable` | 成功；仍报告现有 Wake/React peer 冲突等警告，不代表依赖已零告警 |
| 主仓库 Table `yarn test` | 被 `WAKE_TEST_REACT_VERSION` 阻塞，未进入测试正文 |
| Wake 0.1.39 独立 PnP 副本，当前 Table 源码 | 102/102 组件测试、10/10 浏览器选区测试通过 |

Turbo 仍报告既有的组件开发依赖环：menu、masonry、spin、button、component-preview。本次没有扩展到重构这些依赖关系。CI 配置已接入回归用例；本次实际执行环境为 Windows，尚未在 GitHub Actions 的 Linux 环境运行。

## Typecheck 根因与处理

官方 TypeScript 7.0.2 原生编译器未解析 Yarn PnP。它找不到实际存在的共享 tsconfig 与依赖，继而丢失 JSX 等配置，使 Table 出现 893 个连锁诊断。

本仓库现在使用带原生 PnP 支持的 **TypeScript 7.1.0-dev**：

- 上游 PR：[microsoft/TypeScript#63919](https://github.com/microsoft/TypeScript/pull/63919)。
- 源码仓库：`https://github.com/GGomez99/TypeScript-7-pnp.git`。
- 固定提交：`568cafc40c371bede18a2c96ffb377abc9eb5234`。
- 编译入口：根目录 `scripts/typecheck.mjs`。
- 工具链锁定文件：根目录 `scripts/typescript-pnp.lock.json`，固定 Go 1.27.1 及 SDK 校验值。

这是尚未合并的开发版编译器，不能称为官方 7.0.2 已经支持 PnP。脚本检查源码提交、执行补丁测试，并校验缓存二进制的 SHA256。首次准备需要 Git 与网络，缺少指定 Go 版本时自动下载官方 SDK。源码、SDK、二进制与构建缓存保存在 `.cache/typescript-pnp/`，不提交。

所有现有 Typecheck 脚本均已接入原生编译器。另补齐 badge、breadcrumbs、masonry、select、tabs、tag 六个原来缺少检查脚本的组件，并为 TypeScript 预设的新增测试增加类型检查。Turbo 输入现在包含工具链锁定文件和脚本；CI 不再跳过只有 Demo 改动的类型检查。

日常仍使用根目录或组件包内的 `yarn typecheck`；`yarn typecheck:prepare` 可提前准备编译器。直接运行 `yarn tsc` 仍调用安装的官方编译器，并不等价于项目 Typecheck。待官方 TypeScript 7 发布 PnP 支持后，应审查并移除本地构建入口。

## 真实源码错误的修复

- Table 的默认参数解构移入函数体，避免 Wake 将默认值初始化器写入 `.d.ts`。
- 将分组构建上下文声明为顶层 `BuildContext<T extends Row>`，避免声明生成时丢失泛型作用域。
- 修正选区测试的只读元组与 Wake `it.each` 参数类型不匹配。

新增 6 个回归用例验证：TypeScript 7 版本、共享预设与 PnP 内 React JSX 类型解析、真实类型错误、严格空值检查、未声明依赖，以及非法声明初始化器。正向用例必须没有诊断；反向用例必须产生预期诊断和非零退出码。

Wake 的嵌入式测试运行时不提供测试所需的完整 Node 子进程能力，因此包内 `yarn test` 先用 Node 执行真实编译夹具，再由 Wake Test 断言本次生成的结果。该过程未引入 Jest 或其他测试框架。

## ESLint 根因与处理

当前 typescript-eslint 依赖 TypeScript 的 JavaScript API，不能使用官方 TS 7.0 包替代该 API。参考 [TypeScript 官方并行运行说明](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6.0)：

- `typescript@6.0.2` 仅作为 ESLint 预设的内部 API 依赖，移除由消费方注入 TypeScript 的 peer。
- 业务工作区与根目录仍依赖 TypeScript 7，Typecheck 始终运行原生 TS 7。
- ESLint 与 `@eslint/js` 对齐到插件支持的 9.39.5。
- 移除组件和文档站冗余的 typescript-eslint 直接依赖，避免再次注入不兼容的 TS 7 API。
- 修正 Table 的 14 处缩进问题。
- 修正教程生成器的数组项缩进并运行正式文档生成命令；另修正少量教学源码缩进，将两个全角间隔字符改为等价的转义表达式。生成文件没有手工修改。

## 剩余正式测试阻塞与已验证的下一步

主仓库的 AGENTS.md 第 23–24 行明确要求 Wake/CSS 的“版本必须精确锁定为 `0.1.38`”。该 Wake 版本要求 React/React DOM `>=19.2.8 <19.3.0`，当前仓库使用 19.3.0，因此组件测试在版本检查阶段退出。

已完成的独立验证表明，Wake/CSS 0.1.39 可以运行当前 Table 源码，102 个组件用例和 10 个浏览器选区用例均通过；该结果不能冒充主仓库的测试结果。

完成主仓库组件测试验收的具体变更是：将各工作区 Wake/CSS 精确版本统一到 0.1.39，同步 AGENTS.md 的这两项版本约定，通过 Yarn 刷新并 immutable 验证 lockfile/PnP，再运行构建和相关测试。node_modules 禁令保持不变。目前尚未在主仓库应用这项版本变更。

## 本地验证日志

日志位于根目录 `.tmp/ts7-pnp-proof/`，包括：

- `root-typecheck-final.log`：106 项正式检查及构建。
- `root-eslint-final.log`、`root-eslint-verified.log`：全仓 ESLint。
- `regression-tests-verified.log`：6 项 Wake 类型检查回归。
- `portable-sdk.log`：首次 SDK 准备及原生构建。
- `table-declarations.log`：严格声明检查，成功时为空。
- `docs-generator-tests.log`：23 项生成器测试。
- `immutable-install.log`：主仓库依赖一致性及剩余警告。
- `table-tests.log`：主仓库 Wake 版本阻塞。
- `wake39-table-tests.log`、`wake39-table-browser-final.log`：0.1.39 副本的组件与浏览器结果。
