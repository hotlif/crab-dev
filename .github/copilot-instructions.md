# Crab Dev — Project Guidelines

## Architecture

Nx monorepo with three top-level areas:

| Area | Purpose | Naming |
|------|---------|--------|
| `components/` | React UI components | `@crab-dev/rc-{name}` |
| `standards/` | Shared ESLint, Jest, TypeScript presets | `@crab-dev/standards-{name}` |
| `toolbox/` | Internal build tools | `@crab-dev/{tool-name}` |

**Toolchain summary:**
- **Crustify** — Webpack 5 dev server with React Compiler, Linaria, and auto-scan plugins
- **Lignify** — Zero-config docs/dev environment wrapping Crustify; scans `*.view.tsx`, `*.demo.tsx`, `*.mdx`
- **Packify** — Rollup 4 library bundler outputting ESM (`esm/`), CJS (`cjs/`), declarations (`declarations/`), CSS (`css/`)
- **babel-plugin-auto-import-style** — Auto-injects `@crab-dev/rc-*/css/index.css` imports

## Build and Test

```bash
yarn build                  # Build packify first, then all libraries via Nx
yarn test                   # Run all tests
yarn generate:token         # Generate CSS tokens from token.toml files
```

Per-component scripts:
```bash
yarn start                  # Dev server (lignify → crustify → webpack-dev-server)
yarn build:library          # Publish build (packify → rollup)
yarn generate:token         # Generate CSS tokens (packify generate:css-token)
yarn test                   # Jest tests
yarn eslint                 # Lint
```

CI runs on `canary` branch. See `.github/workflows/jest.yml`.

## Component Structure

Every `rc-*` component follows this layout:

```
src/
├── {component}.tsx          # Main component (FC)
├── types.ts                 # Props interfaces & types
├── token.ts                 # AUTO-GENERATED from token.toml — do not edit
├── index.ts                 # Default export + named type exports
├── hooks/                   # Optional: component-specific hooks
└── __tests__/
    └── {component}.test.tsx # Jest + React Testing Library
docs/
├── *.demo.tsx               # Live demos (auto-scanned by lignify)
├── *.view.tsx               # Page entries
└── *.mdx                    # Documentation
token.toml                   # Design token definitions (CSS variables)
```

## Code Style

- **TypeScript strict mode**, ESNext target, bundler module resolution
- **4-space indentation**
- **Path aliases**: `@/` → `src/`, `@@/` → project root, `@@@/{ns}` → auto-scanned groups
- **Import extensions required** — use `.js`/`.ts`/`.tsx` extensions on relative imports (not on npm packages)
- **Exports**: `export default Component` + `export type { ComponentProps }` from `index.ts`

## Conventions

### Styling — Linaria (zero-runtime CSS-in-JS)
```typescript
import { css, cx } from '@linaria/core';

const baseStyle = css`...`;
// compose with cx(): cx(baseStyle, conditionalStyle, props.className)
```
Styles compile to static class names at build time → `css/index.css`.

### Theming — token.toml → CSS custom properties
- Define tokens in `token.toml` with `[build]` section (output path, prefix) and `[token]` section
- Run `packify generate:css-token` to regenerate `token.ts`
- **Never hand-edit `token.ts`** — it is auto-generated
- Color system uses **OKLch** color space: `oklch(lightness chroma hue)`
- Tokens become CSS variables at runtime: `var(--{prefix}-{key}, fallback)`

### Props patterns
- Extend native HTML attributes with `Omit<>` for overridden props (e.g., custom `onClick`)
- Use discriminated unions for accessibility constraints (e.g., require `aria-label` when no `children`)

### Testing
- Jest 30 + `@testing-library/react` + jsdom
- Import from `@jest/globals`: `describe`, `it`, `expect`, `jest`
- Tests live in `src/__tests__/{component}.test.tsx`
- Run with ESM flag: `yarn node --experimental-vm-modules $(yarn bin jest)`

### Dependencies between components
- Components may depend on other `@crab-dev/rc-*` packages (e.g., rc-dialog → rc-button)
- Use `workspace:^` for internal toolbox/standards deps
- React 19 is a peer dependency
