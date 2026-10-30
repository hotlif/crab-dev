# LineEdit Linux 无损执行索引复核

原候选：`.website/review/20261029-line-edit-all-engines-linux-candidate-1`。新导出：`.website/review/20261030-line-edit-linux-lossless-index-1`。

原生 291 attempts、558 PNG、540 唯一 Linux target 全部关联一致，问题 0。1403 条 JSON 附件完整保留原生顺序/attachmentIndex；528 张 captureVisual actual、12 张 captureZoom actual 逐一对齐原生 target 和 PNG。另 18 张库存 PNG 无 target，3 个行为用例无 PNG，均未提升为基准。

新旧 results.json 字节完全一致：`dec3bc014343c20d3dfcf78f23a246cf81b7f111e4c07661eb98559eb2559569`；原生统计 expected291/skipped0/unexpected0/flaky0 未变。17 个 worker/环境/计划等不可变根文件及 412 个原生 HTML report 文件逐文件字节相同；558 张图片与原生 body、旧导出、新导出及各自声明 SHA 全部一致。旧 cases.json 未修改；新 cases 只新增有序 jsonAttachments、图片 attachmentIndex，去除这两个新增字段后 291 条记录逐项深等。

| 既有审查 | 已核对图片记录 | 具名 target | 仅库存 | 原生用例 | 文件 SHA |
| --- | ---: | ---: | ---: | ---: | --- |
| md3 | 186 | 180 | 6 | 96 | 9865f83847fb971c6683aa9de09f48cf0325d2bed06bda2289ecc9aa5c71d033 |
| apple | 186 | 180 | 6 | 96 | 9efce7015b77a09dee252de0a3fc39bdc81a97c1dba20b94c3d9309c67d81317 |
| shadcn | 186 | 180 | 6 | 96 | 11163f899f03f8b064555cf34241a8a7175d37511c6706506db3780468a36b93 |

三份审查仍引用原目录，558 条 caseId/图片路径/hash 组成的记录恰好覆盖本候选全部 PNG，既不因相同 hash 去重，也无跨设计重复或遗漏。每条已查看声明和设计来源均已核对；本审计未重复看图、不新增外观批准，三份原审查的可见范围与限制继续有效。JSON 中保留全部引用和目标范围。

原 worker source=`sha256:7beb88bd084e220beb63ca79e12e24e6bccac1d4b8374044f45ad967cc1e9414`、artifact=`sha256:f42ca21f373f12158e8e48f86aecfee0f23f7a250b747231049ff4f5df7aa84a`，在新导出中原样保留，没有回写成当前源码指纹。捕获范围内当前源码差异 5 项，仅后处理/指南：true。

- .website/docs/guides/contributing.mdx
- scripts/visual-contract.test.mjs
- scripts/visual/export-evidence.mjs
- scripts/visual/run-linux.mjs
- scripts/visual/run.mjs

本次只写本 execution-index-audit JSON/MD。原生基准回传与工具检查的进展不等于执行了 update；本审计建立/更新基准 0、普通比较运行 0、verified/lifecycle 更改 0。后续仍需批准后的原生基准建立，以及同一固定 Linux 环境连续两次普通比较。

补充锚定：原 results.json、cases.json、linux-environment.txt、local-linux-snapshot.json 的 SHA 均与上一次目标审计记录严格相同，故不只是新旧两份互相一致。新增 evidence-attachments.mjs 与 baseline-transfer.mjs 均为后处理/原生回传 helper，未出现在旧捕获源码清单中；当前 SHA 已另记 JSON。它们的存在与工具测试通过均不等于实际执行 update，也不回写旧候选指纹。
