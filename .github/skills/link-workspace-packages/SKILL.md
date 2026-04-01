---
name: link-workspace-packages
description: 'Link workspace packages in Yarn 4 PnP monorepo. USE WHEN: (1) you just created or generated new packages and need to wire up their dependencies, (2) user imports from a sibling package and needs to add it as a dependency, (3) you get resolution errors for workspace packages (@org/*) like "cannot find module", "failed to resolve import", "TS2307", or "cannot resolve". DO NOT patch around with tsconfig paths or manual package.json edits - use Yarn workspace commands to fix actual linking.'
---

# Link Workspace Packages (Yarn 4 PnP)

Add dependencies between packages in a Yarn 4 Plug'n'Play monorepo.

## Detect

- Lockfile: `yarn.lock`
- Runtime: `.pnp.cjs` (Plug'n'Play, no `node_modules`)
- Dependencies stored in `.yarn/cache/` as zip archives
- `packageManager` field in root `package.json`: `"yarn@4.x.x"`

## Workflow

1. Identify consumer package (the one importing)
2. Identify provider package(s) (being imported)
3. Add dependency using `yarn workspace` command
4. Verify resolution via `.pnp.cjs` (no symlinks in PnP mode)

---

## Commands

```bash
# Add a workspace sibling as dependency
yarn workspace @org/app add @org/ui

# Remove a workspace dependency
yarn workspace @org/app remove @org/ui
```

Result in consumer's `package.json`:

```json
{ "dependencies": { "@org/ui": "workspace:^" } }
```

## Examples

**Example 1: Link a component to another component**

```bash
yarn workspace @crab-dev/rc-dialog add @crab-dev/rc-button
```

**Example 2: Link an internal tool as devDependency**

```bash
yarn workspace @crab-dev/rc-button add -D @crab-dev/standards-eslint-preset
```

**Example 3: Debug "Cannot find module"**

1. Check if dependency is declared in consumer's `package.json`
2. If not, add it: `yarn workspace <consumer> add <provider>`
3. If the package can't load from zip (ESM issues), mark it as unplugged in root `package.json`:
   ```json
   { "dependenciesMeta": { "problematic-pkg": { "unplugged": true } } }
   ```
4. Run `yarn install` to unpack it

## Notes

- Yarn 4 PnP does **not** use `node_modules` — dependencies resolve via `.pnp.cjs`
- Dependencies are stored as zip archives in `.yarn/cache/`
- `workspace:^` resolves to the local package during development and is replaced with the actual version on publish
- Some packages (e.g. those with native binaries or broken ESM) may need `"unplugged": true` in `dependenciesMeta`
- Root `package.json` should have `"private": true` to prevent accidental publish
