---
name: release-change
description: 准备提交、开 PR、写 changeset 或处理版本与发布问题时使用。覆盖变更记录格式与 bump 级别、Conventional Commits 约束、pre-commit 钩子、版本 PR 与 CI 发布校验。用户问为什么要 changeset 或发布为何没触发时加载本技能。
---

# 变更记录与发布

## 何时使用

- 代码改完准备提交或开 PR，需要 changeset。
- 版本 PR、发布流水线或提交信息校验失败。

## Changeset

- 记录放在 `.changeset/<slug>.md`，frontmatter 指明受影响的包与 bump 级别，正文写用户可感知的变化。

```md
---
"@crab-dev/rc-button": patch
---

修复禁用态下焦点轮廓被裁切的问题。
```

- `patch` 修复，`minor` 新增能力，`major` 不兼容；不兼容时在正文写影响范围与迁移步骤。
- `yarn changeset` 可交互生成；代理环境直接写文件等价。
- 用户可感知变化必须有 changeset；纯仓库内部整理按维护者判断。

## 提交

- 英文 Conventional Commits，例如 `fix(rc-button): keep focus ring visible`。
- 不添加 `Co-Authored-By`。
- `.husky/commit-msg` 用 commitlint 校验；`.husky/pre-commit` 依次执行 `yarn typecheck`、`yarn lint`、`yarn test`，耗时较长属正常，不用绕过钩子代替验证。
- 生成产物只能和触发它的源修改同一提交。

## 版本与发布

- 唯一流程是 Changesets：变更记录 → 自动版本 PR → 同一提交验证 → CI 发布。
- `yarn changeset:version` 由版本 PR 的 CI 执行，会更新版本与 lockfile；不要手工改包版本，也不要建立第二条版本流程。
- `yarn changeset:release` 只在 CI 发布，不本地 publish。
- `.github/workflows/release.yml` 在 `canary` 的 Test 工作流成功后触发，先确认验证提交仍是分支头，再用 `changesets/action` 创建版本 PR 或发布。
- 发布校验要求 checkout、Test 运行提交与 `GITHUB_SHA` 一致；不一致时流程停止，先核对来源，不改写 SHA、不跳过守卫。
- 版本 PR 的验证可能需要具有写权限的维护者点击 **Approve workflows to run** 后才会执行。

## 常见错误

- 手改 `package.json` 版本号或 `CHANGELOG.md` 绕过 Changesets。
- changeset 只写“修复问题”而不说清现象与影响。
- 本地执行 `yarn changeset:release` 或 `npm publish`。
- 提交信息用中文或缺少 scope，被 commitlint 拦下。

## 完成定义

- 改动有匹配的 changeset，bump 级别与影响一致。
- 提交信息符合 Conventional Commits，生成物随源提交。
- 发布相关问题能说清卡在验证、SHA 一致性还是权限审批。
