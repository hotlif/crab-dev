import assert from "node:assert/strict";
import { lint } from "@crab-dev/wake";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));
async function diagnostics(text, filename = "components/rc-button/src/lint-probe.tsx") {
    const result = await lint({ root, environments: ["browser"], stdin: { filename, text }, maxWarnings: 0 });
    return result.files.flatMap(file => file.diagnostics);
}

assert.ok((await diagnostics("export const result = missingValue;")).some(item => item.code === "js/no-undef"));
assert.ok((await diagnostics("export const View = () => <MissingComponent />;")).some(item => item.code === "react/jsx-no-undef"));
assert.ok((await diagnostics("export const value = null as any;")).some(item => item.code === "ts/no-explicit-any"));
assert.ok((await diagnostics("const unusedValue = 1; export const value = 2;")).some(item => item.code === "js/no-unused-vars"));
assert.equal((await diagnostics("export type Handler = (value: number) => void; export const button = new MouseEvent('click');")).length, 0);
const scoped = await diagnostics("// wake-lint-disable-next-line ts/no-explicit-any -- Test mock boundary.\nexport const mockValue = null as any;\nexport const unrelated = null as any;");
assert.equal(scoped.filter(item => item.code === "ts/no-explicit-any").length, 1);
assert.ok((await diagnostics("export const broken = missingValue;", ".website/docs/_ui/lint-probe.tsx")).some(item => item.code === "js/no-undef"));
console.log("PASS: native lint detects unresolved values/JSX, any, unused bindings and enforces source scope and local suppressions (7 checks)");
