# 组件约定（Component Conventions）

> 本文件规定 `components/rc-*` 组件的**目录布局、导出形态与测试约定**。措辞遵循 RFC 2119：
> **必须 / 不得 (MUST / MUST NOT)**、**应 / 不应 (SHOULD / SHOULD NOT)**、**可 (MAY)**。
>
> **范围声明**：代码风格、Props 模式、类型约束、标准预设、生成文件边界见
> [`tech-stack-constraints.md`](./tech-stack-constraints.md)，本文件**不重复**。

---

## §1 目录布局（MUST）

```
src/
├── {component}.tsx          # 主组件（复杂组件可拆多个 .tsx，如 xxxInput / xxxOverlay）
├── types.ts                 # Props 与对外类型（可与组件同文件）
├── token.ts                 # 由 token.toml 生成 —— 不得手改
├── index.ts                 # default 导出组件 + 具名导出类型 / Hook / 工具函数
├── hooks/                   # 可选：组件内部 Hook
└── __tests__/
    └── {component}.test.tsx
docs/
├── demos/
│   └── *.demo.tsx           # 在线示例（lignify 自动扫描）
└── README.md                # 说明文档
public/
└── docgen.json              # react-docgen 生成 —— 不得手改
token.toml                   # 设计令牌定义（可选）
eslint.config.js             # 仅继承 standards-eslint-preset（见 tech-stack §9）
jest.config.mjs              # 仅继承 standards-jest-preset
tsconfig.json                # extends standards-typescript-preset，可增补声明输出字段
```

- `src/token.ts` 与 `public/docgen.json` 为生成产物，**不得**手改（详见
  [`tech-stack-constraints.md`](./tech-stack-constraints.md) §9）；
- `.tmp/`、`.cache/`、`.turbo/`、`coverage/` 及构建产物（`esm/` 等）为工具生成目录，
  **不得**将其内容当作源码阅读或修改。

---

## §2 `index.ts` 导出形态（MUST 二选一）

```typescript
// 形态 1：单一组件
import Button from './button.js';
export type { ButtonProps } from './types.js';
export default Button;

// 形态 2：组件 + 附属 Hook / 类型 / 工具函数
// （真实案例见 components/rc-cron-picker：具名导出 parseCron / formatCron 等纯函数）
import Dialog from './dialog.js';
import useConfirm from './hooks/useConfirm.js';
export type { DialogProps } from './dialog.js';
export { useConfirm };
export default Dialog;
```

- 组件**必须**以 `default` 导出；类型 / Hook / 工具函数以**具名**导出。

---

## §3 测试约定（MUST）

- 技术栈：**Jest 30** + `@testing-library/react` + jsdom；
- **必须**经包内 `yarn test` 运行（封装 `packify test`：以 `--experimental-vm-modules`
  启动 node 子进程跑本包 Jest，实现 ESM 模式，并透传命令行参数）；**不得**手拼
  `yarn node --experimental-vm-modules ...` 之类的启动命令；
- **必须**从 `@jest/globals` 导入 `describe` / `it` / `expect` / `jest` / `afterEach`；
- **必须**在每个测试后清理：`afterEach(() => cleanup())`；
- **必须**从**源文件**导入被测组件，**不得**从 `index.ts` 导入：`import Button from '../button.js';`；
- 测试文件位置：`src/__tests__/{component}.test.tsx`。

**以下已由 `@crab-dev/standards-jest-preset` 统一提供，测试文件与包内配置**不得**重复设置：**

- React act 环境：`setup.react.mjs` 已全局设 `IS_REACT_ACT_ENVIRONMENT = true`；
- `moduleNameMapper` 去除相对导入的 `.js` 扩展名（`'^(\\.{1,2}/.*)\\.js$': '$1'`）；
- jsdom 环境、`clearMocks`、覆盖率收集——包内 `jest.config.mjs` 仅
  `export default browser`，不加自定义项。

**jsdom 能力缺口（SHOULD）：** jsdom 无布局引擎，涉及浮层定位 / 动画 / 尺寸测量的内部依赖
（如 `rc-dropdown-container`）**应**以 `jest.mock` 提供保留交互语义的最小替身；缺失的浏览器
API（`ResizeObserver` 等）**应**在 `beforeAll` 中 stub（真实案例见
`components/rc-cron-picker/src/__tests__/cronPicker.test.tsx`）。
