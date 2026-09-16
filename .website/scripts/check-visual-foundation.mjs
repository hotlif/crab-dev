import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { readGlobalTokens } from "./generate-token-reference.mjs";

// This baseline belongs to the purple migration, not to future intentional token changes.
const baseline = JSON.parse(await readFile(new URL("../review/quality/baseline.json", import.meta.url), "utf8"));
const source = await readFile(new URL("../../components/rc-token-global/token.toml", import.meta.url), "utf8");
const entries = readGlobalTokens(source);
const current = new Map(entries.map(entry => [entry.key, entry.value]));
for (const [key, value] of Object.entries(baseline.globalValues)) {
    assert.equal(current.get(key), value, `Existing L1 value changed or disappeared: ${key}`);
}
const added = entries.filter(entry => !Object.hasOwn(baseline.globalValues, entry.key));
assert.deepEqual(added.map(entry => entry.key).sort(), ["10", "20", "30", "40", "80", "90", "100"].map(tone => `purple.${tone}`).sort());
assert.equal(added.every(entry => entry.group === "colors" && entry.expression.includes(".purple[")), true);
console.log(`${Object.keys(baseline.globalValues).length} existing L1 values unchanged; ${added.length} Purple values added to the shared reference catalogue.`);
for (const item of baseline.packages) {
    const name = item.name.replace("@crab-dev/", "");
    const config = await readFile(new URL(`../../components/${name}/wake.config.toml`, import.meta.url), "utf8");
    assert.match(config, /^theme_css = "docs\/theme\.css"$/m, `${name}: workbench must load the public theme`);
    const bridge = await readFile(new URL(`../../components/${name}/docs/theme.css`, import.meta.url), "utf8");
    const target = name === "rc-theme" ? "./workbench.css" : "../../rc-theme/docs/workbench.css";
    assert.ok(bridge.includes(`@import "${target}";`), `${name}: theme bridge must reference the shared adapter`);
    assert.equal(/--token-semantic-|#[\da-f]{3,8}\b/i.test(bridge), false, `${name}: theme bridge must not define another palette`);
}
const adapter = await readFile(new URL("../../components/rc-theme/docs/workbench.css", import.meta.url), "utf8");
assert.match(adapter, /@import "\.\.\/css\/index\.css";/);
for (const role of ["error", "success", "warning", "info"]) {
    assert.ok(adapter.includes(`--token-semantic-color-feedback-${role}: initial;`), `Wake's legacy ${role} default must not override the public feedback pairs`);
}
console.log(`${baseline.packages.length} workbenches reference the public theme without private color values.`);
