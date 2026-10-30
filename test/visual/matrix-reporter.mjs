import fs from "node:fs/promises";
import path from "node:path";
import { loadLibraryManifest, repositoryRoot } from "../../scripts/library-manifest.mjs";
import { assessMatrix, expectedMatrix, expectedEnvironments, assessEnvironments, parseEnvironmentAnnotation } from "../../scripts/visual/matrix-contract.mjs";
import { validateVisualSpec } from "../../scripts/visual/specification.mjs";
import { acceptanceEnvironments } from "./environments.mjs";
const tagged = (entry, name) => entry.tags.some(tag => tag.replace(/^@/, '') === name);

/** Native Playwright results supply statuses; this reporter only checks declared scope. */
export default class MatrixReporter {
    onBegin(config, suite) { this.config = config; this.suite = suite; }
    async onEnd() {
        if (process.env.CRAB_VISUAL_JOB || !this.suite) return;
        const scope = process.env.CRAB_VISUAL_SCOPE ?? "filtered";
        const manifest = await loadLibraryManifest();
        const packages = manifest.packages.filter(product => Object.values(product.designCoverage).some(value => value !== "not-applicable") && (!process.env.CRAB_VISUAL_PACKAGE || product.slug === process.env.CRAB_VISUAL_PACKAGE));
        const designs = manifest.designSystems.map(design => design.id);
        const selectedProjects = this.suite.suites.map(suite => suite.title);
        const tests = this.suite.allTests();
        const matrices = [], environments = [], errors = [];
        for (const product of packages) {
            let spec;
            try {
                spec = JSON.parse(await fs.readFile(path.join(product.directory, "docs/visual.json"), "utf8"));
                const issues = validateVisualSpec(spec, await fs.readdir(path.join(product.directory, "docs/demos")));
                if (issues.length) throw Error(issues.join("; "));
            } catch (error) {
                if (scope !== "filtered") errors.push(`${product.slug}: ${error.message}`);
                continue;
            }
            for (const engine of selectedProjects) {
                const observed = [];
                for (const entry of tests.filter(entry => entry.parent.project()?.name === engine && tagged(entry, product.slug) && tagged(entry, 'matrix'))) {
                    const annotations = entry.annotations.filter(annotation => annotation.type === "matrix");
                    if (annotations.length !== 1) { errors.push(`${product.slug}: ${entry.title} requires exactly one matrix annotation`); continue; }
                    try { observed.push({ ...JSON.parse(annotations[0].description), status: entry.results.at(-1)?.status ?? "missing", testId: entry.id }); }
                    catch { errors.push(`${product.slug}: invalid matrix annotation on ${entry.title}`); }
                }
                let expected;
                try { expected = expectedMatrix(spec, designs, engine); }
                catch (error) { if (scope !== "filtered" || observed.length) errors.push(`${product.slug}/${engine}: ${error.message}`); continue; }
                const assessment = assessMatrix(expected, observed, { complete: scope !== "filtered" });
                errors.push(...assessment.errors.map(error => `${product.slug}/${engine}: ${error}`));
                matrices.push({ package: product.slug, engine, ...assessment, notApplicable: spec.notApplicable ?? {} });
            }
            if (selectedProjects.includes("chromium")) {
                const expected = expectedEnvironments(spec, designs, acceptanceEnvironments);
                const observed = [];
                for (const entry of tests.filter(entry => entry.parent.project()?.name === "chromium" && tagged(entry, product.slug))) {
                    for (const annotation of entry.annotations.filter(annotation => annotation.type === "environment")) {
                        try {
                            const cell = parseEnvironmentAnnotation(annotation.description);
                            if (acceptanceEnvironments.some(environment => environment.id === cell.id)) observed.push({ ...cell, status: entry.results.at(-1)?.status ?? "missing", testId: entry.id });
                        } catch { errors.push(`${product.slug}: invalid environment annotation on ${entry.title}`); }
                    }
                }
                const assessment = assessEnvironments(expected, observed, { complete: scope !== "filtered" });
                errors.push(...assessment.errors.map(error => `${product.slug}/environment: ${error}`));
                environments.push({ package: product.slug, ...assessment });
            }
        }
        const output = path.join(repositoryRoot, ".cache/visual", process.env.CRAB_VISUAL_RUN ?? "current", "matrix.json");
        await fs.mkdir(path.dirname(output), { recursive: true });
        await fs.writeFile(output, JSON.stringify({ scope, visualReview: "pending", matrices, environments, errors }, null, 2));
        if (errors.length) {
            console.error(`Matrix contract failed (${errors.length} issues). ${output}\n${errors.slice(0, 12).join("\n")}`);
            return { status: "failed" };
        }
    }
}
