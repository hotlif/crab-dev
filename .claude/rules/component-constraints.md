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
├── {component}.tsx          # 主组件
├── types.ts                 # Props 与对外类型（可与组件同文件）
├── token.ts                 # 由 token.toml 生成 —— 不得手改
├── index.ts                 # default 导出组件 + 具名导出类型 / Hook
├── hooks/                   # 可选：组件内部 Hook
└── __tests__/
    └── {component}.test.tsx
docs/
├── *.demo.tsx               # 在线示例（lignify 自动扫描）
├── *.view.tsx               # 页面入口
└── *.mdx                    # 说明文档
public/
└── docgen.json              # react-docgen 生成 —— 不得手改
token.toml                   # 设计令牌定义（可选）
```

- `src/token.ts` 与 `public/docgen.json` 为生成产物，**不得**手改（详见
  [`tech-stack-constraints.md`](./tech-stack-constraints.md) §9）。

---

## §2 `index.ts` 导出形态（MUST 二选一）

```typescript
// 形态 1：单一组件
import Button from './button.js';
export type { ButtonProps } from './types.js';
export default Button;

// 形态 2：组件 + 附属 Hook / 类型
import Dialog from './dialog.js';
import useConfirm from './hooks/useConfirm.js';
export type { DialogProps } from './dialog.js';
export { useConfirm };
export default Dialog;
```

- 组件**必须**以 `default` 导出；类型 / Hook 以**具名**导出。

---

## §3 测试约定（MUST）

- 技术栈：**Jest 30** + `@testing-library/react` + jsdom；
- **必须**从 `@jest/globals` 导入 `describe` / `it` / `expect` / `jest` / `afterEach`；
- **必须**以 ESM 模式运行：`yarn node --experimental-vm-modules $(yarn bin jest)`；
- **必须**开启 React act 环境：`(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true;`；
- **必须**在每个测试后清理：`afterEach(() => cleanup())`；
- **必须**从**源文件**导入被测组件，**不得**从 `index.ts` 导入：`import Button from '../button.js';`；
- 测试文件位置：`src/__tests__/{component}.test.tsx`；
- Jest `moduleNameMapper` 去除 `.js` 扩展名：`'^(\\.{1,2}/.*)\\.js$': '$1'`。
