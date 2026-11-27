# @crab-dev/standards-eslint-preset

## 0.0.4

### Patch Changes

- [#95](https://github.com/hotlif/crab-dev/pull/95) [`1ae0214`](https://github.com/hotlif/crab-dev/commit/1ae0214c3cd7ccff9bd8a49cb5ff7b200a2131bf) Thanks [@hotlif](https://github.com/hotlif)! - 升级 TypeScript ESLint 解析器及插件，修复其间接依赖 minimatch 处理复杂路径匹配模式时可能耗尽 CPU 和内存的问题（CVE-2026-118764）。

## 0.0.3

### Patch Changes

- [`d8f4a4b`](https://github.com/hotlif/crab-dev/commit/d8f4a4b0ab03ca911621c495ce8dbd3747875bac) Thanks [@hotlif](https://github.com/hotlif)! - Ignore Wake-generated output directories during linting and emit source-map metadata from the shared browser TypeScript preset.
