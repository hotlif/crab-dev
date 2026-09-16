**ESLint 与 Typecheck 根因及修复方案**

> 历史诊断记录。2026-09-13 已按“保留 TypeScript 7 与 Yarn PnP”的约束实施新方案，请以 [TypeScript 7 PnP 修复记录](./TYPESCRIPT7-PNP-REPAIR-20260913.md) 为准；下文将 Typecheck 改用 TypeScript 6 的原型不再作为执行方案。

检查日期：2026-09-12。环境：Windows、Node.js 22.15.0、Yarn 4.18.0 PnP。

本次完成了源码与配置检查、官方兼容范围核对，以及隔离副本中的修复原型验证。正式仓库的依赖、源码、CI 和检查规则没有因此调整。验证覆盖 Table 组件，不代表全仓已经通过。

**结论**

保留 ESLint、Typecheck 和 Wake Test。三个检查承担不同职责，不能通过删除检查来解决兼容问题。Wake 0.1.39 修复的是 React 19.3.0 的测试适配，未修复 ESLint 工具链和声明生成的全部问题。

| 问题 | 已确认原因 | 处理方 |
| --- | --- | --- |
| ESLint 启动即失败 | typescript-eslint 8.70.0 不支持 TypeScript 7.0 的 API | 本仓库统一兼容依赖 |
| ESLint 的 peer 版本仍冲突 | eslint-plugin-react 7.37.5、eslint-plugin-import 2.32.0 不声明支持 ESLint 10 | 本仓库统一 ESLint 及插件版本 |
| Typecheck 无法找到 React、Wake、共享 tsconfig | 当前 TypeScript 7.0.2 与 Yarn PnP 的解析组合不工作；TypeScript 6.0.2 对照环境可以解析 | 本仓库恢复兼容检查器；跟踪上游 PnP 支持 |
| 构建产物被纳入源码检查 | Table tsconfig 没有显式 include / exclude | 本仓库明确检查范围 |
| 新增选区测试有一处 TS2345 | readonly 元组与 Wake it.each 回调参数类型不兼容 | 本仓库调整测试数据类型 |
| Wake 生成声明有 TS2371、TS2304 | 默认参数初始化器进入声明文件、泛型 T 丢失作用域 | Wake 修复生成器并补回归测试 |

**为什么升级 Wake 还会报错**

ESLint 和 Typecheck 都是独立命令：组件的 eslint 脚本执行 eslint，typecheck 脚本执行 tsc --noEmit。升级 Wake Test 不会改变这两条命令加载的 TypeScript、ESLint 插件或项目 tsconfig。

当前正式仓库仍使用 Wake 0.1.38、TypeScript 7.0.2、ESLint 10.10.0。隔离副本升级 Wake/CSS 0.1.39 后，React 19.3.0 的测试已通过，但原有 lint 和 typecheck 错误仍可复现。

ESLint 有两层兼容问题：

- typescript-eslint 的 TypeScript 支持范围为 >=4.8.4 <6.1.0。本仓库 ESLint 预设也声明 typescript ^6.0.2，组件却提供 7.0.2。
- 实际安装的 eslint-plugin-react 7.37.5 要求 ESLint ^3 || ^4 || ^5 || ^6 || ^7 || ^8 || ^9.7；eslint-plugin-import 2.32.0 要求的范围最高到 ^9。与此同时，@eslint/js 10.0.1 要求 ESLint ^10.0.0。因此仅换 TypeScript 并不能消除整套 lint 依赖的不一致。

TypeScript 7.0 不提供旧的编译器 API，官方提供 TypeScript 6 API 并行使用方案供 typescript-eslint 等工具使用。[TypeScript 官方说明](https://devblogs.microsoft.com/typescript/announcing-typescript-7-0/#running-side-by-side-with-typescript-6-0)、[typescript-eslint 兼容范围](https://typescript-eslint.io/users/dependency-versions/)。

Typecheck 的解析问题也有单独的上游背景：Yarn 为 JavaScript 版 TypeScript 维护的 PnP 补丁不能直接应用于原生编译器。当前原生 PnP 支持仍有跟踪事项；本仓库的 TS7/TS6 对照结果与此一致。[TypeScript PnP 跟踪事项](https://github.com/microsoft/TypeScript/issues/63769)、[Yarn 的 TypeScript 补丁说明](https://yarnpkg.com/getting-started/qa)。

**推荐实施顺序**

1. 统一经过验证的依赖组合。

   | 依赖 | 建议版本 |
   | --- | --- |
   | @crab-dev/wake、@crab-dev/css | 0.1.39 |
   | react、react-dom | 保持 19.3.0 |
   | typescript | 6.0.2，先用于 ESLint 和正式 Typecheck |
   | eslint、@eslint/js | 9.39.5 |
   | typescript-eslint、@typescript-eslint/parser、@typescript-eslint/eslint-plugin | 8.70.0 |
   | eslint-plugin-react | 7.37.5 |
   | eslint-plugin-import | 2.32.0 |

   同步根目录、组件包、文档站及共享预设中的相关依赖；ESLint 预设的 peer 范围也必须同步。给预设自身提供校验所需的 devDependencies，避免其工作区缺少 eslint、typescript 等 peer 提供方。同步更新仓库约定中的 Wake/CSS 固定版本。

   依赖调整后通过 Yarn 生成锁文件和 PnP 产物，再运行 yarn install --immutable 验证一致性，不手改 yarn.lock 或 .pnp.*。

   如果需要保留 TypeScript 7，可另外评估官方的双版本别名方案，但本仓库的正式 Typecheck 暂时仍应使用经过 PnP 验证的 TypeScript 6。仅让 ESLint 改用 TS6 API，不能自动解决 TS7 CLI 的模块解析问题。

2. 明确每个工作区的源码检查范围。

   Table 可在继承共享预设的基础上增补：

   ```json
   {
       "include": ["src", "docs"],
       "exclude": [
           "esm", "cjs", "declarations", "css", "coverage",
           ".tmp", ".cache", ".wake"
       ]
   }
   ```

   按各包实际目录设置范围，保留 src 下的测试文件和需要检查的 Demo。共享配置中的相对路径有自己的解析基准，因此不应把一份固定 src/docs 范围机械套用到所有工作区。

   exclude 只影响入口文件发现，被源码 import 的声明仍可能进入程序；该调整不能修复声明生成器。[TypeScript 配置规则](https://www.typescriptlang.org/tsconfig/#exclude)。

3. 修复检查恢复后暴露的实际代码问题。

   Table 在 TypeScript 6 对照环境中暴露了 14 处缩进错误，涉及 docs/demos/_shared.tsx、docs/demos/highlight.demo.tsx、src/headerCell.tsx、src/hooks/useColumnLayout.ts。

   另有一处来自此前新增的 src/__tests__/selectionVisibility.test.tsx 第 70 行：二维数据表使用 as const 后形成 readonly 元组，与 Wake it.each 回调签名不兼容。原型采用以下约束，保留字段类型检查：

   ```ts
   satisfies [theme: "light" | "dark", surface: string, foreground: string][]
   ```

   不使用 any、ts-ignore 或关闭相关规则来跳过这些错误。工具链恢复后，其他包的实际代码问题也需要单独收集并处理。

4. 让 Wake 单独修复声明生成，增加发布类型验收。

   使用 Wake 0.1.39 重新构建 Table 后，在 TypeScript 6.0.2 下单独检查生成声明并关闭 skipLibCheck，仍有 13 个错误：

   - declarations/_wake/src/table.d.ts：12 处 TS2371，声明中的参数保留了初始化器。
   - declarations/_wake/src/util.d.ts 第 68 行：1 处 TS2304，找不到泛型 T。

   该结果证明声明缺陷独立于 TypeScript 7 的 PnP 解析问题。应由 Wake 在源参数到声明签名的转换、泛型作用域保留处修复，并加入对应回归测试。

   保留源码 Typecheck，同时增加生成声明的严格检查及通过包入口导入的消费者类型测试。验收声明时显式使用 skipLibCheck: false。源码检查通过、把产物排除出源码入口，都不能作为声明缺陷已解决的证据。

5. 分阶段验收。

   先在 Table 验证依赖和预设调整，再扩展到文档站与其他工作区。最终运行不可变安装、全仓 lint、全仓 typecheck、Wake 测试、Library 构建及声明/消费者检查，检查并归因剩余告警。

   保留 CI 中独立的 Lint、Typecheck 和 Test 职责。不要因为 Wake Test 通过，就跳过 lint、静态类型检查或发布声明检查。

**已经验证的范围和结果**

验证副本：C:/Users/zhang/Desktop/crab-dev/.tmp/wake-0.1.39-verification。

使用上面的兼容依赖，修正 Table 缩进、测试元组类型和检查范围后：

| 命令 | 结果 |
| --- | --- |
| yarn install --immutable --mode=skip-build | 成功；目标 ESLint/TypeScript 范围冲突已消除，仍有其他依赖提示及 PnP ESM 提示，不能宣称全仓安装零告警 |
| Table 包 yarn eslint | 通过，退出码 0 |
| Table 包 yarn typecheck | 通过，退出码 0 |
| Table 包 yarn test | 5 个套件，102/102 通过 |
| Table 包 yarn test:selection | 10/10 通过 |
| 生成声明严格检查 | 失败，12 个 TS2371、1 个 TS2304，仍需 Wake 修复 |

日志位于验证副本 components/rc-table 下的 compatible-plan-eslint.log、compatible-plan-typecheck.log、compatible-plan-dom.log、compatible-plan-browser.log、compatible-plan-declarations.log。

这是一份已通过 Table 原型验证的实施方案，不是全仓修复完成报告。正式仓库本次仅新增这份方案文档。
