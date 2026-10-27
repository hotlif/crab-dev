import assert from "node:assert/strict";
import { parse } from "@babel/parser";
import token from "@crab-dev/rc-token-semantic";
import { aliasConsumptionPassed, createThemeRoleAuditExpression, inheritanceConsumptionPassed, nestedRequiredCheckPassed, nestedRequiredChecksPassed, requiredColorRole, themeFallbackAliases, themeRoleAuditPassed } from "./theme-role-validation.mjs";

const sentinels = ["rgb(11, 53, 97)", "rgb(137, 71, 19)"];
const aliasValues = sentinels.map(sentinel => ({ sentinel, parsed: "oklch(0.8 0.1 290)", expectedFallback: "oklch(0.8 0.1 290)" }));
assert.equal(aliasConsumptionPassed(aliasValues), true);
assert.equal(aliasConsumptionPassed(aliasValues.map(value => ({ ...value, expectedFallback: "rgb(0, 0, 0)" }))), false, "wrong fallback must fail");
assert.equal(aliasConsumptionPassed(aliasValues.map(value => ({ ...value, parsed: value.sentinel, expectedFallback: value.sentinel }))), false, "accidental inheritance must fail");
assert.equal(aliasConsumptionPassed(aliasValues.map(value => ({ ...value, parsed: "rgba(0, 0, 0, 0)", expectedFallback: "rgba(0, 0, 0, 0)" }))), false, "transparent initial background must fail");
assert.equal(aliasConsumptionPassed([aliasValues[0]]), false);
assert.equal(aliasConsumptionPassed([aliasValues[0], aliasValues[0]]), false, "sentinels must be distinct");

const inherited = sentinels.map(color => ({ expected: color, parsed: color }));
assert.equal(inheritanceConsumptionPassed(inherited), true);
assert.equal(inheritanceConsumptionPassed(inherited.map(value => ({ ...value, parsed: sentinels[0] }))), false, "fixed color cannot prove inheritance");
assert.equal(inheritanceConsumptionPassed([inherited[0], inherited[0]]), false);

assert.equal(themeFallbackAliases.length, 5);
assert.equal(new Set(themeFallbackAliases.map(spec => spec.name)).size, 5);
assert.equal(themeFallbackAliases[0].expression, token.color.brand.container);
assert.equal(themeFallbackAliases[0].fallback, token.color.selection.background);
assert.ok(themeFallbackAliases.every(spec => spec.expression.startsWith(`var(${spec.name}, `)));
const nested = ["md3", "apple", "shadcn"].flatMap(parentDesign => sentinels.map(sentinel => ({
    parentDesign, childDesign: "md3", colorMode: "light", sentinel,
    parentRole: parentDesign === "md3" ? "" : "rgb(190, 30, 40)", childRole: "", labelColor: sentinel, markerColor: sentinel, passed: true,
})));
const makeAudit = (design = "md3") => ({
    actualDesign: design, actualTheme: "light", roles: 549, differences: [], unknownEmptyRoles: [],
    emptyRoles: [...themeFallbackAliases.map(spec => spec.name), ...(design === "md3" ? [requiredColorRole] : [])],
    fallbackChecks: [...themeFallbackAliases.map(spec => ({ name: spec.name, passed: true })), ...(design === "md3" ? [{ name: requiredColorRole, passed: true }] : [])],
    nestedRequiredChecks: design === "md3" ? nested : [],
});
assert.equal(themeRoleAuditPassed(makeAudit(), "md3", "light"), true);
assert.equal(themeRoleAuditPassed(makeAudit("apple"), "apple", "light"), true);
assert.equal(themeRoleAuditPassed({ ...makeAudit(), differences: [{ name: "--token-semantic-color-text-primary" }] }, "md3", "light"), false);
assert.equal(themeRoleAuditPassed({ ...makeAudit(), unknownEmptyRoles: ["--token-semantic-unknown"] }, "md3", "light"), false, "unknown empty role must fail");
assert.equal(themeRoleAuditPassed({ ...makeAudit(), fallbackChecks: makeAudit().fallbackChecks.slice(1) }, "md3", "light"), false, "missing consumption proof must fail");
assert.equal(themeRoleAuditPassed({ ...makeAudit(), fallbackChecks: makeAudit().fallbackChecks.map(check => ({ ...check, name: requiredColorRole })) }, "md3", "light"), false, "duplicate proof must fail");
assert.equal(themeRoleAuditPassed({ ...makeAudit(), fallbackChecks: makeAudit().fallbackChecks.map((check, index) => ({ ...check, passed: index !== 0 })) }, "md3", "light"), false);
assert.equal(themeRoleAuditPassed({ ...makeAudit("apple"), unknownEmptyRoles: [requiredColorRole] }, "apple", "light"), false, "only MD3 permits empty required-color inheritance");
assert.equal(themeRoleAuditPassed(makeAudit(), "shadcn", "light"), false);
assert.equal(themeRoleAuditPassed(makeAudit(), "md3", "dark"), false);
assert.equal(themeRoleAuditPassed({ ...makeAudit(), roles: 0 }, "md3", "light"), false);
const expression = createThemeRoleAuditExpression(["--token-semantic-color-text-primary"], "md3", "dark");
assert.doesNotThrow(() => parse(expression, { sourceType: "script" }));
assert.ok(expression.includes(JSON.stringify(token.field.required.color)));
assert.equal(nestedRequiredChecksPassed(nested, "light"), true);
assert.equal(nestedRequiredCheckPassed({ ...nested[2], childRole: "rgb(190, 30, 40)", markerColor: "rgb(190, 30, 40)" }), false, "parent red must not leak into MD3");
assert.equal(nestedRequiredCheckPassed({ ...nested[2], parentRole: "" }), false, "parent role must actually be present");
assert.equal(nestedRequiredCheckPassed({ ...nested[2], labelColor: "rgb(190, 30, 40)", markerColor: "rgb(190, 30, 40)" }), false, "the actual label must receive the requested sentinel");
assert.equal(themeRoleAuditPassed({ ...makeAudit(), nestedRequiredChecks: nested.slice(1) }, "md3", "light"), false, "all six nested proofs are mandatory");
assert.equal(themeRoleAuditPassed({ ...makeAudit(), nestedRequiredChecks: [...nested.slice(0, 5), nested[0]] }, "md3", "light"), false, "duplicate parent/sentinel key must fail");
assert.equal(themeRoleAuditPassed({ ...makeAudit(), nestedRequiredChecks: nested.map(check => ({ ...check, colorMode: "dark" })) }, "md3", "light"), false);
assert.equal(themeRoleAuditPassed({ ...makeAudit(), nestedRequiredChecks: undefined }, "md3", "light"), false);
console.log("PASS: theme role fallback, inheritance, sentinel independence, unknown empties, exact proofs, nested MD3 isolation and probe syntax (35 checks)");
