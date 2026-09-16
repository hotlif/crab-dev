import { beforeAll, describe, expect, it } from "@crab-dev/wake/test";
import { readFile } from "node:fs/promises";

interface CompilerResult {
    name: string;
    code: number;
    output: string;
}

let results: CompilerResult[];

beforeAll(async () => {
    // Wake's embedded runtime cannot spawn Node processes. The package test command
    // runs fresh compiler fixtures first, then Wake verifies their actual diagnostics.
    results = JSON.parse(await readFile(new URL("../../.tmp/typecheck-results.json", import.meta.url), "utf8"));
});

function result(name: string): CompilerResult {
    const match = results.find(item => item.name === name);
    if (!match) throw new Error(`Missing compiler fixture result: ${name}`);
    return match;
}

describe("native TypeScript 7 with Yarn PnP", () => {
    it("runs the pinned TypeScript 7 compiler", () => {
        expect(result("version").code).toBe(0);
        expect(result("version").output).toMatch(/^Version 7\./);
    });

    it("resolves a workspace preset and React JSX types inside the PnP archive", () => {
        expect(result("valid").output).toBe("");
        expect(result("valid").code).toBe(0);
    });

    it("fails for real type errors instead of ignoring diagnostics", () => {
        expect(result("invalid-type").code).toBe(2);
        expect(result("invalid-type").output).toContain("TS2322");
    });

    it("keeps strict null checks from the shared preset", () => {
        expect(result("strict-null").code).toBe(2);
        expect(result("strict-null").output).toContain("TS2322");
    });

    it("fails for an undeclared PnP dependency", () => {
        expect(result("missing-package").code).toBe(2);
        expect(result("missing-package").output).toContain("TS2307");
    });

    it("rejects default initializers in declaration files", () => {
        expect(result("invalid-declaration").code).toBe(2);
        expect(result("invalid-declaration").output).toContain("TS2371");
    });
});
