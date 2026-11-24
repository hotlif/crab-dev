---
"@crab-dev/standards-eslint-preset": patch
---

升级 TypeScript ESLint 解析器及插件，修复其间接依赖 minimatch 处理复杂路径匹配模式时可能耗尽 CPU 和内存的问题（CVE-2026-118764）。
