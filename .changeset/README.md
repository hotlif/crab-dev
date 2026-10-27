# 版本变更说明

本目录保存 Changesets 变更记录。每条记录的 frontmatter 指定受影响的包和版本变化级别，正文说明用户可感知的变化。

描述应写明修改解决的问题和修改后的行为。涉及不兼容变化时，补充受影响的用法与迁移步骤。

发布由 [release.yml](../.github/workflows/release.yml) 中的 CI 执行：`yarn changeset:version` 准备版本变更，`yarn changeset:release` 构建并发布包。不要在本地执行发布命令。提交与版本管理约定见 [AGENTS.md](../AGENTS.md)。

当前流程用仓库 `GITHUB_TOKEN` 创建或更新版本 PR。依据 [GitHub 的工作流触发规则](https://docs.github.com/en/actions/how-tos/write-workflows/choose-when-workflows-run/trigger-a-workflow)，相应 PR 验证会等待批准；具有仓库写权限的维护者需在 PR 合并区域点击 **Approve workflows to run**，再检查验证结果并按现有流程合并。无需为此增加令牌权限或绕过验证。

发布校验同时要求 checkout HEAD、成功 Test 运行的提交号和 `GITHUB_SHA` 一致。[Changesets v2](https://github.com/changesets/action/blob/v2/src/github.ts) 会使用 action context 的 SHA 建立版本分支和 API tag；只检查 checkout 不足以保证它们指向已验证提交。若仓库默认分支或工作流上下文发生变化导致三者不一致，流程必须停止；维护者先核对分支与验证来源，再重新运行符合条件的验证和发布流程，不覆盖 SHA 或跳过守卫。
