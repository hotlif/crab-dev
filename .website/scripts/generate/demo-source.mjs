import { parseTypeScript, visitSyntax } from "./syntax.mjs";

export function unwrapExpression(expression) {
    let current = expression;
    while (
        current.type === "TSAsExpression"
        || current.type === "TSSatisfiesExpression"
        || current.type === "ParenthesizedExpression"
        || current.type === "TSTypeAssertion"
    ) {
        current = current.expression;
    }
    return current;
}

export function readStaticString(expression, fieldName, filePath) {
    const value = unwrapExpression(expression);
    if (value.type === "StringLiteral") return value.value;
    if (value.type === "TemplateLiteral" && value.expressions.length === 0) {
        return value.quasis[0].value.cooked;
    }
    throw new Error(`${filePath}: meta.${fieldName} 必须是静态字符串`);
}

export function propertyNameText(name) {
    if (name?.type === "Identifier") return name.name;
    if (name?.type === "StringLiteral") return name.value;
    return undefined;
}

export function extractDemoMeta(sourceCode, filePath) {
    const sourceFile = parseTypeScript(sourceCode, filePath);

    for (const statement of sourceFile.program.body) {
        if (statement.type !== "ExportNamedDeclaration"
            || statement.declaration?.type !== "VariableDeclaration") continue;

        for (const declaration of statement.declaration.declarations) {
            if (declaration.id.type !== "Identifier" || declaration.id.name !== "meta") continue;
            if (!declaration.init) {
                throw new Error(`${filePath}: meta 缺少初始化值`);
            }
            const initializer = unwrapExpression(declaration.init);
            if (initializer.type !== "ObjectExpression") {
                throw new Error(`${filePath}: meta 必须是静态对象字面量`);
            }

            const values = new Map();
            for (const property of initializer.properties) {
                if (property.type !== "ObjectProperty" || property.computed) continue;
                const name = propertyNameText(property.key);
                if (name === "title" || name === "description") {
                    values.set(name, readStaticString(property.value, name, filePath));
                }
            }
            if (!values.has("title") || !values.has("description")) {
                throw new Error(`${filePath}: meta 必须同时声明静态 title 和 description`);
            }
            return {
                title: values.get("title"),
                description: values.get("description"),
            };
        }
    }

    throw new Error(`${filePath}: 未找到导出的静态 meta`);
}

export function jsxRootName(name) {
    if (name.type === "JSXIdentifier") return name.name;
    if (name.type === "JSXMemberExpression") return jsxRootName(name.object);
    return undefined;
}

export function extractDemoLearning(sourceCode, filePath) {
    const sourceFile = parseTypeScript(sourceCode, filePath);
    const importedComponents = new Set();
    for (const statement of sourceFile.program.body) {
        if (statement.type !== "ImportDeclaration") continue;
        const source = statement.source.value;
        const isComponentSource = source.startsWith("@crab-dev/rc-")
            || /(?:^|\/)src(?:\/|$)/.test(source);
        if (!isComponentSource) continue;
        for (const specifier of statement.specifiers) {
            if (/^[A-Z]/.test(specifier.local.name)) importedComponents.add(specifier.local.name);
        }
    }

    const renderedComponents = new Set();
    const fallbackComponents = new Set();
    const props = new Set();
    const events = new Set();
    let hasState = false;

    visitSyntax(sourceFile, (node) => {
        if (
            node.type === "CallExpression"
            && node.callee.type === "Identifier"
            && ["useState", "useReducer", "useActionState", "useTransition"].includes(node.callee.name)
        ) {
            hasState = true;
        }
        if (node.type !== "JSXOpeningElement") return;
        const rootName = jsxRootName(node.name);
        if (!rootName || !/^[A-Z]/.test(rootName)) return;
        fallbackComponents.add(rootName);
        if (!importedComponents.has(rootName)) return;
        renderedComponents.add(rootName);
        for (const attribute of node.attributes) {
            if (attribute.type !== "JSXAttribute" || attribute.name.type !== "JSXIdentifier") continue;
            const name = attribute.name.name;
            if (["className", "style", "key", "id"].includes(name)) continue;
            props.add(name);
            if (/^on[A-Z]/.test(name)) events.add(name);
        }
    });

    const components = renderedComponents.size > 0 ? renderedComponents : fallbackComponents;
    return {
        components: [...components].slice(0, 6),
        props: [...props].slice(0, 12),
        events: [...events].slice(0, 6),
        hasState,
    };
}
