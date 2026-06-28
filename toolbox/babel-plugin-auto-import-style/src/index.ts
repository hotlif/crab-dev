import { declare } from "@babel/helper-plugin-utils";
import type { NodePath, PluginPass } from "@babel/core";
import type { Program as BabelProgram, ImportDeclaration as BabelImportDeclaration } from "@babel/types";
import { createRequire } from "module";

const CRAB_COMPONENT_RE = /^@crab-dev\/rc-[a-zA-Z0-9_-]+$/;
const CSS_SUFFIX = "/css/index.css";
const PKG_SUFFIX = "/package.json";

interface PackageManifest {
    name?: string;
    dependencies?: Record<string, string>;
}

// 缓存：包 manifest 绝对路径 -> 按级联顺序（依赖在前、本体在后）排列的 CSS 绝对路径列表。
// 以 manifest 绝对路径为键，确保同一包不会重复遍历；在 Yarn PnP 下亦唯一。
const transitiveCssCache = new Map<string, string[]>();

function tryResolve(req: NodeJS.Require, specifier: string): string | null {
    try {
        return req.resolve(specifier);
    } catch {
        return null;
    }
}

/**
 * 从 `fromFile` 起始的 require 解析上下文出发，收集 `packageName` 及其全部
 * `@crab-dev/rc-*` 传递依赖的 `css/index.css` 绝对路径。
 *
 * 为何输出绝对路径：Yarn PnP 的严格模式禁止 A 直接访问"孙依赖"C 的 bare
 * specifier，即使运行时 C 已在磁盘上。本函数沿 manifest 链逐跳解析（每一跳
 * 都在该包自身的 PnP 边界内），最终向消费源码注入 **绝对文件路径**，从而
 * 完全绕过消费端对 `@crab-dev/rc-*` 包名的二次解析。
 *
 * 级联顺序：先依赖、后本体。这样父组件定义的令牌覆盖子组件默认值的语义
 * 与 import 顺序保持一致。
 */
function collectTransitiveCssAbsolutePaths(
    packageName: string,
    fromFile: string,
    visiting: Set<string>
): string[] {
    const req = createRequire(fromFile);
    const manifestPath = tryResolve(req, `${packageName}${PKG_SUFFIX}`);
    if (!manifestPath) {
        return [];
    }
    if (visiting.has(manifestPath)) {
        return [];
    }
    const cached = transitiveCssCache.get(manifestPath);
    if (cached) {
        return cached;
    }
    visiting.add(manifestPath);

    let manifest: PackageManifest;
    try {
        manifest = req(`${packageName}${PKG_SUFFIX}`) as PackageManifest;
    } catch {
        visiting.delete(manifestPath);
        return [];
    }

    const deps = manifest.dependencies ?? {};
    const result: string[] = [];
    const seen = new Set<string>();

    for (const dep of Object.keys(deps)) {
        if (!CRAB_COMPONENT_RE.test(dep)) {
            continue;
        }
        // 从当前包的 manifest 位置继续解析，保持 PnP 语义：当前包的 deps 对自身可见。
        const nested = collectTransitiveCssAbsolutePaths(dep, manifestPath, visiting);
        for (const entry of nested) {
            if (!seen.has(entry)) {
                seen.add(entry);
                result.push(entry);
            }
        }
    }

    const selfCss = tryResolve(req, `${packageName}${CSS_SUFFIX}`);
    if (selfCss && !seen.has(selfCss)) {
        seen.add(selfCss);
        result.push(selfCss);
    }

    visiting.delete(manifestPath);
    transitiveCssCache.set(manifestPath, result);
    return result;
}

export default declare((api) => {
    api.assertVersion(8);

    const types = api.types;

    return {
        visitor: {
            Program(path: NodePath<BabelProgram>, state: PluginPass) {
                const seenStyleImports = new Set<string>();

                for (const node of path.node.body) {
                    if (!types.isImportDeclaration(node)) {
                        continue;
                    }

                    const source = node.source.value;
                    if (typeof source !== "string") {
                        continue;
                    }

                    if (source.endsWith(CSS_SUFFIX)) {
                        seenStyleImports.add(source);
                    }
                }

                state.set("seenStyleImports", seenStyleImports);
            },

            ImportDeclaration(path: NodePath<BabelImportDeclaration>, state: PluginPass) {
                if (path.node.importKind === "type") {
                    return;
                }

                const importPath = path.node.source.value;
                if (!CRAB_COMPONENT_RE.test(importPath)) {
                    return;
                }

                const seenStyleImports = state.get("seenStyleImports") as Set<string> | undefined;
                const fromFile = state.filename ?? `${process.cwd()}/__entry__.js`;
                const cssList = collectTransitiveCssAbsolutePaths(importPath, fromFile, new Set());

                const toInsert: ReturnType<typeof types.importDeclaration>[] = [];
                for (const absoluteCss of cssList) {
                    if (seenStyleImports?.has(absoluteCss)) {
                        continue;
                    }
                    seenStyleImports?.add(absoluteCss);
                    toInsert.push(types.importDeclaration([], types.stringLiteral(absoluteCss)));
                }

                if (toInsert.length > 0) {
                    // 一次性插入以保持"依赖在前、本体在后"的级联顺序；逐个 insertAfter 会逆序。
                    path.insertAfter(toInsert);
                }
            }
        }
    };
});
