# Crab 视觉与交互质量审查

开始日期：2026-09-16。状态：**进行中，未达到最终完成条件。**

工具链更新：按用户后续要求升级到 Wake 0.1.43，并用原生 lint 替换工作区 ESLint。React 19.3.0 的旧版本范围阻塞已解除；新检查结果与规则差异见[迁移记录](../toolchain/README.md)。下文 0.1.38 验证属于原候选的历史证据。

目标是改善中文企业后台的信息查找、高密度阅读、复杂操作和视觉一致性。工程通过、浏览器测量、人工复审与真实用户对照分别记录；不以其中一项替代其他项。

## 审查库存与证据

- [基线库存](baseline.json)：52 个公共包、80 个 MDX 页面、137 项原有 L1 值。源文件和测试入口已列出，初始 review / productionVerification 均为 pending。
- [Material 对照协议](material-comparison.md)：四个相同任务、12 个招募位置、顺序平衡和预先定义的计算口径。当前没有真实参与者数据。
- [19 章复核矩阵](chapter-review.md)：列出规范职责、来源复核与待验证范围。
- [52 包审查矩阵](component-review.md)：分别记录组件自身的部分复核、待审行为和后续检查；共享主题通过不自动更新为组件通过。
- `production/priority-pages.json`：首页、目录、全局令牌、语义令牌四页的 24 种主题 / 宽度测量，包含标题、正文高度、溢出、异常及生产 HTML 摘要。
- `production/round-1-measurements.json`：首轮 480 条完整测量，4 条溢出均来自语义令牌页的 320 / 768px；主题不匹配与运行时异常均为 0。该文件不是人工复审通过证明。
- `production/all-pages.json`：最近一次全库存自动测量。对照 capturedAt 与 buildHash 区分版本，不能将修复前的首轮结果当作最终候选复审。
- `production/foundation-regression-measurements.json`：基础批次修复后的 480 条测量，整页溢出、主题错配、运行异常均为 0；该版本尚不包含后续输入批次。新记录增加全产物 `revision.sha256`，旧 `buildHash` 仅为 HTML 摘要。
- `production/input-router-regression-measurements.json`：输入和 Router 批次固定产物 `3c6f3dce…` 的 480 条测量，整页溢出、主题错配、运行异常均为 0，每页恰有一个可见 H1。该版本包含 Dialog 窄屏宽度修复，尚不包含后续关闭按钮改造；不能充当最终两轮复审。
- `production/first-controls.json` / `reference-interactions.json`：键盘、系统颜色、粗指针、复制及媒体偏好的浏览器专项证据；与 React 包内测试分开记录。
- `production/input-clear-before.json`：单行 / 多行清除后焦点落到 BODY 的修复前实测。`input-interactions.json` 记录修复后的对应操作与输入状态。
- `production/*.png`：隔离 Chrome 152 的生产截图；`-top` 是首屏，长截图最多 24000 CSS px，超过范围的尾部需要补拍，不能称为完整长页截图。

基线时 CUA 与 Node REPL 初始化均失败，未获得修改前的公共主题截图，不重建或伪造这些截图。后续使用本机独立无头 Chrome、隔离配置和仅监听本机的调试端口完成可重复验收。用户当前浏览器标签仍需刷新到新产物；无头测量不代表真实触控设备或读屏实测。

## 首轮已修改

| 编号 | 等级与依据 | 修复内容 | 当前复核状态 |
| --- | --- | --- | --- |
| F01 | P2 · 源码确认，站点和公共主题有两套角色映射 | 新增公共 Purple 七档，L2 与 rc-theme 共用 themeColorContract，站点删除重复 L2 覆盖 | 基元保留检查、48 包令牌契约、颜色测试通过；全组合复审未完成 |
| F02 | P2 · 数值测量，深色按压表面上的必要边界不足 | 调整公共边界映射；深色反馈改为 Oklab 混合以保留色相 | 12 项站点颜色配对测试和 7 项公共主题测试通过 |
| F03 | P2 · 源码确认，目录重复内边距和固定空白 | 卡片统一 16px 内容内边距，移除标题 / 描述固定高度，缩小插图 | 三档宽度与两种主题复测无整页溢出；320 / 768 首屏已目视复核 |
| F04 | P2 · 320 / 768 生产截图和高度测量 | 目录删除重复介绍；最小列宽调为 13rem，使 768px 可用正文区容纳两列 | 768 两列已确认，同内容高度 13989 → 9073px；320 保持一列 |
| F05 | P2 · 源码确认，首页双语换行和方向标记不统一 | 名称固定为相邻两行，页内定位用 ↓；窄屏缩短辅助介绍，保留完整入口 | 首页三档宽度与两种主题已测量；细节视觉复审进行中 |
| F06 | P1 · 生产测量，语义令牌页参数表撑宽整页 | 将手写 MDX 表格的局部滚动规则推广到通用正文容器，移除重复专页规则 | 修复后六种组合宽度均正常；不修改交互示例内的公共 Table |
| F07 | P2 · 浏览器键盘复制后焦点丢失，源码 pending 禁用对应 | 改用 Button loading 保留焦点，继续拦截重复操作 | 4 项令牌手册浏览器检查通过：成功后焦点保留，注入复制拒绝后显示提示并保留可选择代码 |
| F08 | P2 · 独立工作台实测仍以 #8b5cf6 覆盖品牌且深色前景为白色 | 各包 docs/theme.css 通过共享适配入口导入公共 rc-theme CSS，预览表面同样消费 L2 | 52 个入口检查通过，生产按钮工作台 Light 40 / White、Dark 80 / 20 已实测；其余工作台状态仍待逐项复核 |
| F09 | P2 · 生产工作台实测，四种旧反馈别名仍覆盖新角色 | 私有适配层将 Wake 宿主上的默认旧别名设为 initial，公共主题各角色恢复自身回退 | 52 包 × 明暗 = 104 项通过，每项 77 个角色零差异；公共旧变量仍可在业务主题作用域使用 |
| F10 | P1 · Router 工作台完整生产导航复现 | public/history-frame.html 提供真实同源 History 文档；初始条目禁用后退；缺失 tab 显式回到 overview | 生产明暗导航、查询、连续返回共 12 项通过；公共 Router API 未修改 |
| T01 | 契约错误 · 表格 cell.border-color 包含自身变量回退 | 删除重复自引用，保留原变量与旧表格边框回退 | 契约检查及 2 项兼容测试通过 |
| T02 | 契约错误 · 日期 / 表格七个非规范键 | 规范化内部名称，兼容层保留原 TokenVars 键与 CSS 变量，新增变量优先 | 契约与 3 项兼容测试通过；完整 React 测试受阻 |
| C01 | P1 · 源码确认，Checkbox / Radio 隐藏输入未转移焦点显示 | 可见方框 / 圆形获得独立焦点环，补充强制颜色下的形状 | ESLint、类型和构建通过；明暗键盘焦点、切换、系统颜色和粗指针生产检查通过 |
| C02 | P1 · 源码确认，Switch 焦点仅依赖 box-shadow | 改为实线焦点，系统颜色下保留轨道、手柄和状态 | 工程及浏览器焦点、Space、系统颜色和粗指针检查通过；物理设备未测 |
| C03 | P1 · 源码确认，Button loading 只限制指针点击 | 捕获和点击处理同时阻止加载期间激活，防止提交；默认加载不整体淡化 | 新行为回归已编写；React 测试被版本门禁阻止，未标通过 |
| C04 | P2 · 源码确认，禁用链接仍匹配 hover，禁用边框可能跳动 | 区分 aria-disabled 与 loading，保留边框占位，减少动态效果时移除按压缩放 | ESLint、类型和构建通过；状态对照待完成 |
| C05 | 项目规格落实 · Button / Checkbox / Radio / Switch | 粗指针下独立命中区至少 44×44，视觉 size 入口保持 | 仅这四种控件已补充；不宣称全库触控已达标 |
| C06 | P2 · 浏览器系统颜色测量，Radio 未选中背景误用 Highlight | Radio 移除 `:indeterminate` 分支；该伪类在无选中项的单选组也会匹配 | 明暗系统颜色的选中 / 未选中背景区分及组内循环生产检查通过 |
| C07 | P1 · 生产键盘复现，两个未命名 RadioGroup 之间发生方向键串组 | 未指定或空 name 自动生成组名，显式 name 保持 | 新增连续方向键循环检查；原生 FormData 行为变化见迁移说明 |
| C08 | P1 · 独立示例实测，Button isSelected 只有外观，无按压语义 | 原生按钮的 isSelected 默认映射 aria-pressed，显式 ARIA 优先，其他角色不自动映射 | ESLint、类型和构建通过；Enter 后 aria-pressed 与选择一致，React 行为回归仍受门禁阻止 |
| C09 | P1 · 两个生产输入示例中清除后焦点落到 BODY | LineEdit / TextEdit 在清除回调前将焦点恢复到输入区；动作复用 Button | 包内 ESLint、类型、构建和令牌契约通过；明暗 / 系统颜色中清除后继续输入通过 |
| C10 | P1 · 源码确认，禁用密码字段的原生操作未设置 disabled | 密码可见性动作同步 disabled；只读继续允许查看且不修改值 | 生产激活、焦点限制和只读查看检查通过；React 回归受门禁阻止 |
| C11 | P2 · 源码确认，输入错误仅改外观、系统颜色焦点缺失 | 错误默认 aria-invalid，显式 ARIA 优先；独立实线焦点与强制颜色；粗指针目标与可增长高度 | 输入专项共 40 项通过；320 粗指针截图已检查；文字放大仍待实测 |
| C12 | P1 · 320px 成员编辑内的放弃确认层超出视口 | 公共 Dialog / useConfirm 最小宽度收敛到视口，限制短视口下内容高度并局部滚动 | 320 / 1440 明暗确认层均在视口内；成员资料流程 28 项通过 |
| C13 | P2 · 成员保存中焦点落到 BODY | 保存按钮和 Dialog 确认按钮以 loading 保留焦点，同时阻止重复激活 | 成员保存中焦点保留、校验定位、草稿保留和保存返回通过；React 门禁受阻 |
| C14 | P1 · 生产关闭入口为 aria-hidden 的 div | 公共 Dialog 关闭入口复用有名称的 Button，保留安全取消语义；粗指针 44px | 64 项生产检查通过，含关闭与返回、长内容、系统颜色、触控及文字放大模拟；异步取消不在该专项内 |
| C15 | P2 · 源码确认，异步取消禁用发起按钮且显示确认加载 | 按发起动作显示 loading，保留焦点；同步 guard 拦截同一渲染批次重入 | 类型、构建通过；新增取消回归受 React 门禁阻止，浏览器异步取消未实测 |
| C16 | P1 · 生产输入原值 3、草稿 20、按 ↑ 后得到 4 | NumberEdit 用有效草稿步进，边界和 aria-valuenow 同步；未指定精度时保留草稿小数 | 48 项生产检查通过，覆盖三宽度 / 明暗、键盘与鼠标步进、空值和范围；React 门禁受阻 |
| C17 | P1 · 生产 Select 清除后焦点落到 BODY | 清除通知前恢复选择器焦点，继续支持方向键选择 | 18 项生产检查通过，含清除、重新展开、选新值；React 门禁受阻 |

等级只描述影响；“源码确认”与“生产复现”不互换。已修改的问题在完整回归前不记为清零。

## 工程记录

| 检查 | 本轮结果 | 边界 |
| --- | --- | --- |
| 根 generate:token | 48 个包成功 | Turbo 输出原有循环依赖告警；未更改锁定版本或依赖 |
| check:tokens | 48 个令牌包通过 | 包括引用环、命名、分层、兼容回退和基础对比度 |
| check-visual-foundation.mjs | 137 项原值不变，新增 7 项 Purple | 只验证本次迁移基线，未来主动修改需重新评审 |
| 全库 build:library | 52 项成功 | 已包含首批基础控件修复 |
| 14 个受影响包 eslint / typecheck | 通过 | global、semantic、theme、table、date-picker、button、checkbox、radio、switch、line-edit、text-edit、dialog、number-edit、select；Router 文档另行通过 |
| 公共主题 / 语义 / 兼容纯测试 | 13 项通过 | theme 7、semantic 3、table 2、date-picker 1 |
| 站点颜色测试 | 12 项通过 | 明暗、表面、hover / active、反馈配对 |
| React 包内 test | **受阻** | 全仓测试 53 个 test 任务中 50 个失败：49 个 React 门禁、1 个 TextEdit Windows I/O 997；后者独立复跑也进入 React 门禁 |
| 站点 check:docs | 通过 | 52 页、55 教程、117 教学示例、246 唯一 Demo，0 漂移 |
| 站点 test:generator | 26 项通过 | 包含 64 颜色与七档 Purple；普通组件模板保留 |
| 站点 eslint / typecheck | 通过 | 新增测量脚本与后续布局修改还须最后复查 |
| 站点 build | 80 路由、2540 文件，成功 | 1889 个生产 JS 检查，0 未绑定引用；最新 `63968ce3…` 候选包含 Dialog、NumberEdit 与 Select 本批修复 |

React 门禁要求 react / react-dom `>=19.2.8 <19.3.0`，仓库锁定为 `19.3.0`，Wake 为 `0.1.38`。本轮保留锁定版本，不改测试加载器或跳过门禁，不将纯令牌测试通过描述为组件交互测试通过。解决需要兼容的工具链安排；目前未做发布或版本升级。

全仓测试任务结果见 [完整记录](full-test-results.json)。Turbo 的 55 个成功任务包含 52 个前置构建，不能写成 55 个测试任务通过；真正成功的 test 任务是 theme、semantic 和 TypeScript 预设。输入批次新增加 5 个行为回归，同样没有越过版本门禁。内部复用 Button 后已执行 `yarn install --immutable`，外部版本保持不变；原有 React peer、elkjs packageExtension 和 PnP loader 提示单独保存在 `install-immutable.log`。

## 公共默认变化与兼容

1. L1 新增 `purple.10/20/30/40/80/90/100`；原 137 项键值保持。Purple 编号越大越亮，不能访问 purple.600，也不能据色名推断业务语义。来源见[固定色板](https://github.com/material-components/material-web/blob/main/tokens/versions/v0_192/_md-ref-palette.scss)。
2. L2 默认 Light 品牌为 Purple 40，Dark 为 Purple 80，前景 / 悬停 / 按压 / 焦点 / 选中同步配对。文档站移除私有紫灰表面覆盖，改用公共 Zinc 表面。已有 CSS 名称和导出未删除。
3. `themeColorContract` 与其类型为新增公共数据导出。运行时主题入口仍为 `@crab-dev/rc-theme/css/index.css`，`data-theme` 和已有 L3 覆盖继续有效。
4. Table / DatePicker 的旧 TokenVars 键由手写兼容模块保留；旧 CSS 变量进入新变量的 fallback。两种新旧变量同时设置时，新规范变量优先。
5. Button 的 loading 默认透明度改为 1，避免把整组前景和背景淡化；旧透明度变量仍可覆盖。调用方仍需维护请求 pending、错误恢复和服务端幂等。
6. 粗指针命中区是组件局部落实，不增加全局 density API。样板控件 36/28、数据行 44/36 仍只在声明的样板范围内适用。
7. 52 个工作台新增项目内 `docs/theme.css` 桥接入口，通过 `rc-theme/docs/workbench.css` 只导入公共主题并将表面、前景绑定到 L2，不保存第二份参数。Wake 要求 theme_css 入口位于当前组件目录中；CSS import 由构建解析。先完成 rc-theme 的 Library 构建，再构建工作台；不新增 npm 依赖。
8. RadioGroup 未指定或空 name 时现在自动生成组内名称，防止键盘跨组。该名称会参与原生 FormData；使用原生表单提交时应指定稳定业务 name，不依赖之前未命名字段被忽略的行为。显式 name 继续原样使用，独立组不应共用名称。
9. 原生按钮显式使用 isSelected 时，默认生成匹配的 aria-pressed；显式 aria-pressed 优先，链接及其他角色不自动使用按压语义。不传 isSelected 的普通动作不变成切换按钮。loading 与 disabled 同时使用时，仍遵循原生 disabled 的焦点限制。
10. LineEdit / TextEdit 内部动作新增对已有 rc-button 的 workspace 依赖，无新外部包。动作默认 24px、粗指针 44px，清除恢复焦点；LineEdit 固定 height 改为 min-height，small 上下 padding 改为 0 以容纳原有 20px 行高，带操作时可自然增高。基于旧固定总高度拼接的组合需要复核。error 默认 aria-invalid，显式值优先；未传 id 时自动生成关联 ID，不改变显式 ID。
11. Dialog 以原有 520px 尺度作为默认目标宽度、useConfirm 保留 22rem，避免长段落自动撑满桌面；两者受视口两侧各 16px 的上限约束。关闭入口现在是可聚焦按钮，名称使用 cancelText；依赖旧 DOM、自动扩宽或特殊 top 覆盖的定制需复核。异步操作由发起按钮显示 loading；Escape / 遮罩取消先转移到取消动作，避免其他按钮禁用时丢失焦点。
12. NumberEdit 步进现在以有效草稿为基值；空草稿从零开始，无法解析的中间态回到已提交值。未指定 precision 时保留草稿小数位。parser 会在编辑期间读取，必须无副作用并返回有限数或 null；这是调用时机变化，旧业务中有请求的 parser 需要迁移。Select 清除后恢复选择器焦点，公开值和回调签名不变。

主题定制要分别验证：无 rc-theme CSS 的 Light 回退、Light、Dark、局部嵌套主题、Portal、旧 L2 / L3 覆盖、强制颜色。源码兼容不等于旧自定义配色必然满足新组合的对比度。

## 余下审查

- 全部库存的状态适用性、键盘路径、图标和 19 章规则逐项核对；不能按“页面能打开”推断组件已审查。
- LineEdit / TextEdit 的清除焦点丢失已在修复前生产页复现；本轮补充焦点恢复、错误语义、内部 Button 和禁用密码约束，需专项复测。表格、性能组件、浮层和业务组合按计划继续推进。
- 生产断点前后、200% 文字缩放、强制颜色、减少动态效果、复制成功 / 失败、焦点恢复和长文本 / 异步失败必须单独记录。
- 同一最终候选上完成两轮完整复审，确认问题清零后才能结束；当前轮次不满足该条件。
- Dialog 顶部关闭和长标签已专项复测；异步取消、内容保留及父表单组合仍待复核。原生模态 Tab 偶尔停在 BODY，无头 hasFocus 在边界返回值不稳定；脚本独立验证背景入口拒绝 focus、下一次 Tab 回到模态，不把 BODY 停留自动推断为背景控件可操作。
- Material 参考实现和至少 12 名真实参与者对照尚未完成，当前没有“优于 Material”的实测结论。

## 复跑方法

保持本机预览在 4173，使用独立 Chrome 配置在仅本机的 9334 端口启动无头调试。生产脚本只操作该隔离实例，不用于外部网站。仓库根运行 `node .website/scripts/review-production.mjs` 测量四张重点页面，加 `--all` 测量全部 80 页。不得在测量过程中覆盖生产目录，否则版本摘要失去意义。

分别运行 `verify-production-interactions.mjs` 与 `verify-reference-interactions.mjs` 执行已定义的浏览器检查。加入 verify-input-interactions.mjs 检查输入控件。所有浏览器脚本共用隔离标签，必须串行运行。Enter 必须包含浏览器的文本事件；复制失败用明确的本地故障注入，结果不能误写为真实权限故障。旧的首轮“焦点 / 切换通过”不代表当时已验证系统颜色的未选中区分。

`verify-workbench-themes.mjs` 将工作台宿主的 77 个角色与不受 Wake 宿主覆盖的公共主题作用域比较；`verify-router-example.mjs` 检查初始、导航、查询与回退；`verify-profile-interactions.mjs` 检查成员编辑、未保存确认、校验与保存恢复。后三者不替代更复杂嵌套、服务端失败、真实读屏或物理设备验收。

先审查 JSON 中的标题、正文高度与异常，再打开对应截图；内容尚未加载或测量为空时应重跑，不使用空壳尺寸作结论。必要二维内容允许局部滚动，outside 字段只是候选线索，不能直接等同于整页溢出。

规范依据：[WCAG 2.2](https://www.w3.org/TR/WCAG22/)。44×44 为 Crab 对独立触控目标的项目约定；WCAG 2.2 AA 的 2.5.8 为 24×24 CSS px 基线并含例外，不能混写。
