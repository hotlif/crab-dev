# 平台相关脚本与终端（Platform-Specific Scripts & Terminal）

> 本文件规定 **Claude（所有模型，含 Opus / Sonnet / Haiku / Fable 等，不因模型不同而有别）**
> 在本仓库执行终端命令时，**如何按操作系统选择正确的终端与语法**。措辞遵循 RFC 2119：
> **必须 / 不得 (MUST / MUST NOT)**、**应 / 不应 (SHOULD / SHOULD NOT)**、**可 (MAY)**。
>
> **范围声明**：本文件只覆盖"终端 / shell 的选择与语法"。package.json 脚本的跨平台写法、
> 技术栈约束见 [`tech-stack-constraints.md`](./tech-stack-constraints.md)。

---

## §1 核心规则：按操作系统选择终端（MUST）

执行任何终端命令前，Claude **必须**先确认当前运行的操作系统，并使用该系统对应的终端与语法：

| 操作系统 | 平台标识 | **必须使用的终端** | 语法风格 |
|----------|----------|--------------------|----------|
| **Windows** | `win32` | **PowerShell**（PowerShell 7+ / pwsh） | PowerShell cmdlet |
| **Linux** | `linux` | **shell（bash / sh）** | POSIX |
| **macOS** | `darwin` | **shell（bash / zsh）** | POSIX |

- 判定依据为运行环境的 **platform** 字段；本仓库当前主环境为 **Windows（开发机）**，
  CI 为 **Linux（GitHub Actions `ubuntu-latest`）**。
- **不得**凭习惯默认某一种终端；**不得**在一种终端里写另一种终端的语法（见 §3）。
- 当宿主提供专门的终端工具时，**必须**用与当前系统匹配的那个：Windows 用 PowerShell 工具，
  类 Unix 用 Bash 工具。

---

## §2 各系统语法基线

### 2.1 Windows / PowerShell（MUST）

- 变量：`$x = "v"`；环境变量读 `$env:NAME`、写 `$env:NAME = "v"`（**不得** `export`）；
- 命令链：`&&` / `||`（pwsh 7+ 支持）；
- 丢弃 stderr：`2>$null`（**不得** `2>/dev/null`）；
- 多行字符串：单引号 here-string `@'...'@`（闭合 `'@` **必须**顶格、独占一行）；
- 文件 / 进程操作用 cmdlet：`Get-ChildItem`、`Remove-Item -Recurse -Force`、
  `Get-Content f -TotalCount N`、`(Get-Command x).Source`；
- Unix 专有命令（`head` / `tail` / `which` / `touch` / `rm -rf` / `ln -s`）在 PowerShell **不存在**，
  **必须**改用上述 cmdlet 等价写法。

### 2.2 Linux · macOS / shell（MUST）

- 变量：`x=v`（等号两侧无空格）；环境变量 `export X=v` 或内联 `X=v cmd`；
- 命令链：`&&` / `||`；
- 丢弃 stderr：`2>/dev/null`；
- 多行文本：here-doc `<<'EOF' … EOF`；
- 用标准 coreutils：`ls`、`rm -rf`、`head -n N`、`which`、`sed`、`find`。

---

## §3 语法对照与"不得混用"

同一操作在两套终端下写法不同，**不得**张冠李戴：

| 操作 | PowerShell（Windows） | shell（Linux / macOS） |
|------|----------------------|------------------------|
| 列目录 | `Get-ChildItem` / `ls` | `ls` |
| 查命令路径 | `(Get-Command x).Source` | `which x` |
| 前 N 行 | `Get-Content f -TotalCount N` | `head -n N f` |
| 设环境变量 | `$env:X = 'v'` | `export X=v` / `X=v cmd` |
| 删除目录 | `Remove-Item -Recurse -Force p` | `rm -rf p` |
| 丢弃 stderr | `2>$null` | `2>/dev/null` |
| 多行文本 | here-string `@'…'@` | here-doc `<<'EOF'…EOF` |

**典型错误（MUST NOT）：**

- 在 PowerShell 里写 `2>/dev/null`、`export X=v`、`$VAR`（应为 `$env:VAR`）、bash here-doc；
- 在 shell 里写 `$env:X`、`Get-ChildItem`、PowerShell here-string `@'…'@`。

---

## §4 与平台无关的优先做法（SHOULD）

- **文件读写 / 搜索 / 查找必须用宿主专用工具**（Read / Edit / Write / Glob / Grep），
  **不得**用 shell 的 `cat` / `ls` / `grep` / `sed` / `find` —— 这类工具跨平台一致、更稳，
  且完全规避 §1 的终端选择问题（与根 `CLAUDE.md` 一致）。
- 跨平台 CLI（`git` / `yarn` / `turbo` / `node` / `yarn node`）**命令本身两端一致**，
  差异只在 shell 的管道、重定向、变量语法 —— 即只需按 §1 选对终端，命令主体无需改写。
- package.json 脚本由 **Yarn portable shell**（类 POSIX、跨平台）执行，与终端选择无关；
  其跨平台写法（如建目录用 `node -e "require('fs').mkdirSync(...)"` 而非 `mkdir -p`）
  见 [`tech-stack-constraints.md`](./tech-stack-constraints.md)。
