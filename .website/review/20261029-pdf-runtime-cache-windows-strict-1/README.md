# PDF 冷资源缓存恢复：正式 strict 链路通过

将 PDF 的完整生成目录 `public/runtime` 移到经校验的本地备份后，同一公开命令实际从本地缓存恢复了全部 **5 文件、14,182,365 字节**。文件集、子目录、长度与 SHA256 完全一致；备份仍保留在 `.tmp/pdf-runtime-cache-20261029-3/original-runtime`。

命令：`yarn exec turbo run build:library --filter=@crab-dev/rc-pdf-editor --concurrency=2 --summarize`。两轮均使用默认 strict 模式。原生摘要声明恰好六项最小 global passthrough；RAYON_NUM_THREADS=2 及 TEMP/TMP/TMPDIR 的实际摘要哈希均精确匹配工作区验证配置。两个浏览器定位参数仅声明，本次未设置或启动浏览器。

| 阶段 | 原生结果 | PDF 任务哈希 |
| --- | --- | --- |
| warm | 24 成功、0 缓存，41.979s | 26f5e1c82dd07ed9 |
| 冷资源恢复 | 24/24 LOCAL HIT，0 重建，594ms | 26f5e1c82dd07ed9 |

全部 24 个任务的 warm/cold 哈希相同。原生 `execution.success=0 / cached=24` 证明第二轮是缓存恢复；控制台的 Wake 构建文字来自缓存日志回放。完整原生摘要、脚本、日志、逐文件清单及采集索引见 [report.json](./report.json) 与 [原始索引](./evidence/index.json)。15 份证据副本均核对 SHA256。

| 恢复文件 | 字节 |
| --- | ---: |
| licenses/LICENSE.embedpdf | 1,075 |
| licenses/LICENSE.pdfium | 12,880 |
| pdf-editor.js | 9,187,108 |
| pdf-editor.worker.js | 334,370 |
| pdfium.wasm | 4,646,932 |

移动前逐级检查绝对路径、Node 原生 realpath、目标父目录及整棵生成树无 reparse，且源与备份均在本工作区内。只完整移动命名的 runtime 目录；未删除资源、移动 dist/源码或操作其他进程。PDF 来源在 warm/cold 期间稳定。脚本保留了失败时保存新部分产物并恢复原备份的路径，本轮无需触发。

v1 的缓存证据及环境前提更正、v2 已开始但停止于 warm 的 loose 记录完整保留；最终接受的是 v3 正常 strict 公共链路，没有采用 all-env 例外。本报告仅证明 Windows 本地生成资源缓存恢复，不替代 PDF 浏览器行为、视觉、独立消费或全库验收；未建立基准或更新 verified。

