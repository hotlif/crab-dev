const matrixValues = {
    colorModes: ["light", "dark", "forced-colors"],
    densities: ["compact", "standard", "comfortable"],
    directions: ["ltr", "rtl"],
    locales: ["zh-CN", "en-US"],
};
const fingerprint = /^sha256:[a-f0-9]{64}$/;
const nonempty = (value) => typeof value === "string" && value.trim().length > 0;
const relativeEvidencePath = (path) => nonempty(path) && !path.startsWith("/") && !path.includes("\\") && !path.split("/").includes("..") && !/^[a-z]+:/i.test(path);

/**
 * verification[designId] = {
 *   source: { kind: "commit", ref: "<40/64 hex SHA>" } |
 *           { kind: "worktree", ref: "sha256:<64 hex content fingerprint>" },
 *   artifactFingerprint: "sha256:<64 hex>",
 *   matrixScope: { colorModes: [...], sizes: [...], densities: [...], directions: [...], locales: [...], states: [...] },
 *   evidencePaths: ["review/<recorded evidence file>"]
 * }
 * Each record applies only to the corresponding verified design system and source snapshot.
 */
export function validateDesignVerification(entry, designIds) {
    const errors = [];
    const records = entry.verification;
    for (const design of designIds) {
        if (entry.designCoverage?.[design] !== "verified") {
            if (records?.[design]) errors.push(`${design} evidence must correspond to verified coverage.`);
            continue;
        }
        const record = records?.[design];
        if (!record || typeof record !== "object" || Array.isArray(record)) {
            errors.push(`${design} verified coverage requires a complete evidence record.`);
            continue;
        }
        const source = record.source;
        const validSource = source?.kind === "commit" ? /^(?:[a-f0-9]{40}|[a-f0-9]{64})$/.test(source.ref ?? "")
            : source?.kind === "worktree" && fingerprint.test(source.ref ?? "");
        if (!validSource) errors.push(`${design} evidence needs an exact commit or worktree fingerprint.`);
        if (!fingerprint.test(record.artifactFingerprint ?? "")) errors.push(`${design} evidence needs an artifact SHA-256 fingerprint.`);
        for (const [axis, allowed] of Object.entries(matrixValues)) {
            const values = record.matrixScope?.[axis];
            if (!Array.isArray(values) || values.length === 0 || values.some((value) => !allowed.includes(value))) errors.push(`${design} evidence needs an explicit valid ${axis} matrix scope.`);
        }
        // Named component scales (for example MD3 Button xs/s/m/l/xl) remain independent of global sizes.
        const sizes = record.matrixScope?.sizes;
        if (!Array.isArray(sizes) || sizes.length === 0 || sizes.some((size) => typeof size !== "string" || !/^[a-z][a-z0-9-]*$/.test(size))) errors.push(`${design} evidence needs explicit applicable component size names or not-applicable.`);
        const states = record.matrixScope?.states;
        if (!Array.isArray(states) || states.length === 0 || states.some((state) => !nonempty(state))) errors.push(`${design} evidence needs explicit component states.`);
        if (!Array.isArray(record.evidencePaths) || record.evidencePaths.length === 0 || record.evidencePaths.some((path) => !relativeEvidencePath(path))) errors.push(`${design} evidence needs repository-relative evidence paths.`);
    }
    for (const design of Object.keys(records ?? {})) {
        if (!designIds.includes(design)) errors.push(`Unknown evidence design system ${design}.`);
    }
    return errors;
}
