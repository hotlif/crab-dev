import assert from "node:assert/strict";
import { findUnboundNames } from "./check-built-bindings.mjs";

// The former production failure: cx was replaced after local names were renamed.
const broken = 'const a="calendar"; function panel(b) { return [centerFlexStyle, selected && a].filter(Boolean).join(" "); }';
assert.deepEqual((await findUnboundNames(broken)).map((finding) => finding.message), [
    "'centerFlexStyle' is not defined.", "'selected' is not defined.",
]);
assert.equal((await findUnboundNames('const cx=(...args)=>args.filter(Boolean).join(" "); const a="calendar"; function panel(b) { return cx.call(undefined,a,b&&"selected"); }')).length, 0);
assert.equal((await findUnboundNames('function outer(value) { return () => value; }')).length, 0);
assert.equal((await findUnboundNames('if (typeof module !== "undefined") module.exports = {};')).length, 0);
assert.ok((await findUnboundNames('function broken( {')).length > 0);
assert.equal((await findUnboundNames('if (typeof read === "function") read("data");', { read: "readonly" })).length, 0);
assert.ok((await findUnboundNames('read("data");')).length > 0);
console.log("PASS: production binding regression, scoped closures, guarded hosts and malformed output (5 checks)");
