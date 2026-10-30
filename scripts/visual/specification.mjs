const densities = new Set(["compact", "standard", "comfortable"]);
const nonempty = value => typeof value === "string" && value.trim().length > 0;

export function validateVisualSpec(spec, demoNames) {
    const errors = [];
    if (spec?.schemaVersion !== 1) errors.push("visual schemaVersion must be 1");
    if (!nonempty(spec?.demo) || !demoNames.includes(spec.demo)) errors.push("visual demo must reference an existing package demo");
    for (const axis of ["sizes", "densities", "states"]) {
        const values = spec?.[axis];
        if (!Array.isArray(values) || !values.length || values.some(value => !nonempty(value)) || new Set(values).size !== values.length) errors.push(`${axis} must contain unique applicable values`);
    }
    if (Array.isArray(spec?.densities) && spec.densities.some(value => !densities.has(value))) errors.push("unknown density");
    if (spec?.capabilities !== undefined && (!Array.isArray(spec.capabilities) || spec.capabilities.some(value => value !== 'webgl2') || new Set(spec.capabilities).size !== spec.capabilities.length)) errors.push('unknown or duplicate browser capability');
    if (spec?.crossEngine !== undefined) {
        for (const axis of ["sizes", "densities", "states"]) {
            const values = spec.crossEngine?.[axis];
            if (!Array.isArray(values) || !values.length || values.some(value => !spec?.[axis]?.includes(value)) || new Set(values).size !== values.length) errors.push(`crossEngine.${axis} must be a nonempty unique subset of ${axis}`);
        }
        if (!spec.crossEngine?.states?.includes("default")) errors.push("crossEngine must cover the default presentation");
    }
    if (spec?.notApplicable !== undefined && (typeof spec.notApplicable !== "object" || spec.notApplicable === null || Array.isArray(spec.notApplicable) || Object.values(spec.notApplicable).some(value => !nonempty(value)))) errors.push("not-applicable axes need a written reason");
    return errors;
}
