# 版本变更说明

本目录保存 Changesets 变更记录。每条记录的 frontmatter 指定受影响的包和版本变化级别，正文说明用户可感知的变化。

描述应写明修改解决的问题和修改后的行为。涉及不兼容变化时，补充受影响的用法与迁移步骤。

发布由 [release.yml](../.github/workflows/release.yml) 中的 CI 执行：`yarn changeset:version` 准备版本变更，`yarn changeset:release` 构建并发布包。不要在本地执行发布命令。提交与版本管理约定见 [AGENTS.md](../AGENTS.md)。
