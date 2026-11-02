# 像素基线与同一提交 CI 补充验收

## 历史来源

- 起始提交：`1f25f27f3f6d9a1240e318833d635256fc82e0ea`，远程 `canary` 与本地一致。
- 当前检出不是浅克隆；`git ls-files test/visual/baselines` 与 `git log --all -- test/visual/baselines` 均无结果。可达历史中没有已提交、已批准的像素基线，不能声称完成与不存在旧图的比较。
- 用户于 2026-11-02 明确要求继续基线对比/更新和同一提交 CI，通过后再更新设计覆盖。此次先建立首版固定 Linux 基线，再运行不更新基线的严格回归。

## 当前进度

- 原全组件审查、人工截图和 Windows/Linux 公开检查仍见 [原验收记录](validation.json)，它们不冒充本次像素回归或远程 CI。
- 首版基线与严格回归：待从精确提交检出后执行。最初的工作区启动预检已停止，原始日志和容器保留，不计完成覆盖。
- CI：待任务分支提交后触发。Windows 与 Linux 均检出 PR 的精确头提交，验证实际 HEAD，并保存源码和完整构建指纹。
- 设计覆盖：继续保留 `partial`，只有像素回归和同一提交 CI 通过后才更新清单及派生文档。

正式采集使用仓库 `scripts/visual/environment.mjs` 固定的 Playwright 1.64.1 Noble 镜像；不在 Windows 更新像素基线。源码提交、产物、原始报告、基线文件 SHA 与 CI 运行链接将在完成后补充。
