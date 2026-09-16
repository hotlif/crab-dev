import { readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { lint } from "@crab-dev/wake";
import globals from "globals";

const hostGlobals = {
    ...globals.browser,
    ...globals.es2025,
    // Bundled UMD dependencies retain guarded CommonJS / AMD branches.
    ...globals.node,
    define: "readonly",
    Temporal: "readonly",
    __REACT_DEVTOOLS_GLOBAL_HOOK__: "readonly",
    __webpack_init_sharing__: "readonly",
    __webpack_share_scopes__: "readonly",
    regeneratorRuntime: "readonly",
    // ELK's GWT exception bridge references $doc only in its IE < 9 branch.
    $doc: "readonly",
};

const bindingRules = lint({ listRules: true }).then(result => ({
    ...Object.fromEntries(result.catalog.rules.map(rule => [rule.id, "off"])),
    "js/no-undef": "error",
}));

export async function findUnboundNames(source) {
    const result = await lint({
        // A virtual filename avoids generated-output ignore patterns; every supplied
        // production source is still parsed and checked for unresolved bindings.
        stdin: { filename: "binding-check/input.js", text: source },
        rules: await bindingRules,
        globals: Object.fromEntries(Object.entries(hostGlobals).map(([name, writable]) => [name, writable === true ? "writable" : "readonly"])),
        maxWarnings: 0,
    });
    return result.files.flatMap(file => file.diagnostics).map(({ location, message }) => ({
        line: location?.line ?? 1,
        column: location?.column ?? 1,
        message,
    }));
}

export async function checkBuiltBindings(root) {
    const files = (await readdir(root, { recursive: true })).filter((file) => /\.m?js$/.test(file));
    const failures = [];
    for (const file of files) {
        for (const finding of await findUnboundNames(await readFile(path.join(root, file), "utf8"))) {
            failures.push({ file, ...finding });
        }
    }
    return { files: files.length, failures };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const root = path.resolve(process.argv[2] ?? "docs-dist");
    const result = await checkBuiltBindings(root);
    await writeFile(path.join(root, "binding-check.json"), JSON.stringify(result, null, 2));
    if (result.failures.length) {
        for (const failure of result.failures) console.error(`${failure.file}:${failure.line}:${failure.column} ${failure.message}`);
        process.exitCode = 1;
    }
    console.log(`Checked ${result.files} production JavaScript files; ${result.failures.length} unbound references.`);
}
