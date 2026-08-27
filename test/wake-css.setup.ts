import { mock } from "@crab-dev/wake/test";

let generatedName = 0;

function nextName(kind: "class" | "keyframes"): string {
    generatedName += 1;
    return `wake-test-${kind}-${generatedName}`;
}

function collectClassNames(value: unknown, output: string[]): void {
    if (!value) {
        return;
    }
    if (typeof value === "string") {
        output.push(value);
        return;
    }
    if (Array.isArray(value)) {
        for (const nested of value) {
            collectClassNames(nested, output);
        }
        return;
    }
    if (typeof value === "object") {
        for (const [className, enabled] of Object.entries(value)) {
            if (enabled) {
                output.push(className);
            }
        }
    }
}

function cx(...values: readonly unknown[]): string {
    const classNames: string[] = [];
    for (const value of values) {
        collectClassNames(value, classNames);
    }
    return classNames.join(" ");
}

function defineTokens<T>(value: T): T {
    return value;
}

function createVar(debugName?: string): string {
    const suffix = debugName?.replace(/[^a-zA-Z0-9_-]/g, "-") ?? String(generatedName + 1);
    generatedName += 1;
    return `var(--wake-test-${suffix}-${generatedName})`;
}

function assignVars(variables: Readonly<Record<string, string | number>>): Record<string, string | number> {
    return Object.fromEntries(Object.entries(variables).map(([variable, value]) => {
        const property = variable.startsWith("var(") && variable.endsWith(")")
            ? variable.slice(4, -1)
            : variable;
        return [property, value];
    }));
}

// Wake Test 0.1.23 does not yet run Crab CSS extraction for its CommonJS test graph.
// Component behavior tests use deterministic identifiers while Library builds keep the real compiler contract.
mock.module("@crab-dev/css", () => ({
    css: () => nextName("class"),
    cx,
    keyframes: () => nextName("keyframes"),
    globalStyle: () => undefined,
    defineTokens,
    createVar,
    assignVars,
}));
