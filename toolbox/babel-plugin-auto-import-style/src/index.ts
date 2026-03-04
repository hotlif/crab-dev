import { declare } from "@babel/helper-plugin-utils";

const CRAB_COMPONENT_RE = /^@crab-dev\/rc-[a-zA-Z0-9_-]+$/;
const CSS_SUFFIX = "/css/index.css";

export default declare((api) => {
    api.assertVersion(7);

    const types = api.types;

    return {
        visitor: {
            Program(path, state) {
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
                        seenStyleImports.add(source.slice(0, -CSS_SUFFIX.length));
                    }
                }

                state.set("seenStyleImports", seenStyleImports);
            },

            ImportDeclaration(path, state) {
                if (path.node.importKind === "type") {
                    return;
                }

                const importPath = path.node.source.value;
                if (!CRAB_COMPONENT_RE.test(importPath)) {
                    return;
                }

                const seenStyleImports = state.get("seenStyleImports") as Set<string> | undefined;
                if (seenStyleImports?.has(importPath)) {
                    return;
                }

                const styleImport = types.importDeclaration([], types.stringLiteral(`${importPath}${CSS_SUFFIX}`));
                path.insertAfter(styleImport);
                seenStyleImports?.add(importPath);
            }
        }
    };
});
