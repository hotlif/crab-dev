import { declare } from "@babel/helper-plugin-utils";

export default declare((api, options, dirname)  => {
    const types = api.types;
    return {
        visitor: {
            ImportDeclaration: (path) => {
                const importPath = path.node.source.value;
                if (/^@crab\/rc-[a-zA-Z0-9_\-]+$/g.test(importPath)) {
                    const styleImport = types.importDeclaration(
                        [],
                        types.stringLiteral(`${importPath}/esm/index.styles.css`)
                    );
                    path.insertAfter(styleImport)
                }
            }
        }
    }
});
