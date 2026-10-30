import { parse } from "@babel/parser";

export function parseTypeScript(sourceCode, filePath) {
    return parse(sourceCode, {
        sourceType: "module",
        sourceFilename: filePath,
        plugins: filePath.endsWith(".tsx") ? ["typescript", "jsx"] : ["typescript"],
    });
}

export function visitSyntax(node, visit) {
    if (!node || typeof node !== "object" || typeof node.type !== "string") return;
    visit(node);
    for (const value of Object.values(node)) {
        if (Array.isArray(value)) value.forEach((child) => visitSyntax(child, visit));
        else if (value && typeof value === "object") visitSyntax(value, visit);
    }
}
