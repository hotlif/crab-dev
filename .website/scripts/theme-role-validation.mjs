import token from "@crab-dev/rc-token-semantic";

// These aliases intentionally resolve at the consuming element. Materializing
// them at a root would freeze descendant selection/background overrides.
export const themeFallbackAliases = [
    { name: "--token-semantic-color-brand-container", property: "background-color", expression: token.color.brand.container, fallback: token.color.selection.background },
    { name: "--token-semantic-color-brand-on-container", property: "color", expression: token.color.brand["on-container"], fallback: token.color.selection.foreground },
    { name: "--token-semantic-color-surface-canvas", property: "background-color", expression: token.color.surface.canvas, fallback: token.color.background.sunken },
    { name: "--token-semantic-color-surface-content", property: "background-color", expression: token.color.surface.content, fallback: token.color.background.surface },
    { name: "--token-semantic-color-surface-raised", property: "background-color", expression: token.color.surface.raised, fallback: token.color.background.elevated },
];
export const requiredColorRole = "--token-semantic-field-required-color";

/** A real fallback must resolve to the reference, rather than inherit a sentinel. */
export function aliasConsumptionPassed(values) {
    return values.length === 2
        && values[0].sentinel !== values[1].sentinel
        && values.every(value => value.parsed === value.expectedFallback && Boolean(value.parsed)
            && value.parsed !== "transparent" && value.parsed !== "rgba(0, 0, 0, 0)")
        && values[0].parsed === values[1].parsed;
}

/** CSS-wide inherit is valid only when both distinct parent colors are inherited. */
export function inheritanceConsumptionPassed(values) {
    return values.length === 2
        && Boolean(values[0].expected) && Boolean(values[1].expected)
        && values[0].expected !== values[1].expected
        && values.every(value => value.expected === value.parsed);
}

/** A nested MD3 boundary must reset the parent's custom role, then inherit its label. */
export function nestedRequiredCheckPassed(check) {
    return check.childDesign === "md3" && check.childRole === ""
        && Boolean(check.labelColor) && check.labelColor === check.sentinel && check.markerColor === check.labelColor
        && (check.parentDesign === "md3" ? check.parentRole === "" : Boolean(check.parentRole));
}

export function nestedRequiredChecksPassed(checks, colorMode) {
    if (!Array.isArray(checks) || checks.length !== 6) return false;
    const expected = ["md3", "apple", "shadcn"].flatMap(parent => ["rgb(11, 53, 97)", "rgb(137, 71, 19)"].map(sentinel => `${parent}/${sentinel}`)).sort();
    const actual = checks.map(check => `${check.parentDesign}/${check.sentinel}`).sort();
    return JSON.stringify(actual) === JSON.stringify(expected)
        && checks.every(check => check.colorMode === colorMode && check.passed === true && nestedRequiredCheckPassed(check));
}

/** All raw roles and every expected consumption proof remain mandatory. */
export function themeRoleAuditPassed(data, designSystem, colorMode) {
    const expectedProofs = themeFallbackAliases.map(spec => spec.name);
    if (designSystem === "md3" && data.emptyRoles?.includes(requiredColorRole)) expectedProofs.push(requiredColorRole);
    const actualProofs = data.fallbackChecks?.map(check => check.name).sort();
    return data.roles > 0
        && data.actualDesign === designSystem && data.actualTheme === colorMode
        && Array.isArray(data.differences) && data.differences.length === 0
        && Array.isArray(data.unknownEmptyRoles) && data.unknownEmptyRoles.length === 0
        && JSON.stringify(actualProofs) === JSON.stringify(expectedProofs.sort())
        && data.fallbackChecks.every(check => check.passed === true)
        && (designSystem === "md3" ? nestedRequiredChecksPassed(data.nestedRequiredChecks, colorMode)
            : data.nestedRequiredChecks === undefined || Array.isArray(data.nestedRequiredChecks) && data.nestedRequiredChecks.length === 0);
}

/** Build a closure-free browser probe using the real public token expressions. */
export function createThemeRoleAuditExpression(names, designSystem, colorMode) {
    return `(() => {
        const aliasConsumptionPassed = ${aliasConsumptionPassed.toString()};
        const inheritanceConsumptionPassed = ${inheritanceConsumptionPassed.toString()};
        const nestedRequiredCheckPassed = ${nestedRequiredCheckPassed.toString()};
        const names = ${JSON.stringify(names)};
        const aliases = ${JSON.stringify(themeFallbackAliases)};
        const designSystem = ${JSON.stringify(designSystem)};
        const colorMode = ${JSON.stringify(colorMode)};
        const requiredName = ${JSON.stringify(requiredColorRole)};
        const frame = document.querySelector('.demo-frame-root');
        if (!frame) return { roles: names.length, differences: [], unknownEmptyRoles: names, fallbackChecks: [] };
        const probe = document.createElement('div');
        probe.hidden = true;
        probe.dataset.theme = colorMode;
        probe.dataset.crabDesign = designSystem;
        document.body.append(probe);
        try {
            const expected = getComputedStyle(probe);
            const actual = getComputedStyle(frame);
            const differences = names.map(name => ({ name, expected: expected.getPropertyValue(name).trim(), actual: actual.getPropertyValue(name).trim() })).filter(item => item.expected !== item.actual);
            const emptyRoles = names.filter(name => !expected.getPropertyValue(name).trim() || !actual.getPropertyValue(name).trim());
            const allowedEmpty = new Set(aliases.map(spec => spec.name));
            if (designSystem === 'md3') allowedEmpty.add(requiredName);
            const unknownEmptyRoles = emptyRoles.filter(name => !allowedEmpty.has(name));
            const evaluateConsumer = (host, spec) => {
                const values = ['rgb(11, 53, 97)', 'rgb(137, 71, 19)'].map(sentinel => {
                    const parent = document.createElement('span');
                    parent.style.color = sentinel;
                    const consumer = document.createElement('span');
                    consumer.style.setProperty(spec.property, spec.expression);
                    const fallback = document.createElement('span');
                    fallback.style.setProperty(spec.property, spec.fallback);
                    parent.append(consumer, fallback);
                    host.append(parent);
                    const parsed = getComputedStyle(consumer).getPropertyValue(spec.property);
                    const expectedFallback = getComputedStyle(fallback).getPropertyValue(spec.property);
                    const parentColor = getComputedStyle(parent).color;
                    parent.remove();
                    return { sentinel: parentColor, parsed, expectedFallback };
                });
                return { values, passed: aliasConsumptionPassed(values) };
            };
            const fallbackChecks = aliases.map(spec => {
                const baseline = evaluateConsumer(probe, spec);
                const workbench = evaluateConsumer(frame, spec);
                return { name: spec.name, expression: spec.expression, fallback: spec.fallback, baseline, workbench,
                    passed: baseline.passed && workbench.passed && baseline.values.every((value, index) => value.parsed === workbench.values[index].parsed) };
            });
            if (emptyRoles.includes(requiredName) && designSystem === 'md3') {
                const inheritConsumer = host => ['rgb(11, 53, 97)', 'rgb(137, 71, 19)'].map(sentinel => {
                    const parent = document.createElement('span');
                    parent.style.color = sentinel;
                    const child = document.createElement('span');
                    child.style.color = ${JSON.stringify(token.field.required.color)};
                    parent.append(child);
                    host.append(parent);
                    const expected = getComputedStyle(parent).color;
                    const parsed = getComputedStyle(child).color;
                    parent.remove();
                    return { expected, parsed, passed: expected === parsed };
                });
                const baseline = inheritConsumer(probe);
                const workbench = inheritConsumer(frame);
                fallbackChecks.push({ name: requiredName, expression: ${JSON.stringify(token.field.required.color)}, baseline, workbench,
                    passed: inheritanceConsumptionPassed(baseline) && inheritanceConsumptionPassed(workbench) });
            }
            const nestedRequiredChecks = [];
            if (designSystem === 'md3') for (const parentDesign of ['md3', 'apple', 'shadcn']) for (const sentinel of ['rgb(11, 53, 97)', 'rgb(137, 71, 19)']) {
                const parent = document.createElement('div');
                parent.dataset.crabDesign = parentDesign;
                parent.dataset.theme = colorMode;
                const child = document.createElement('div');
                child.dataset.crabDesign = 'md3';
                child.dataset.theme = colorMode;
                const label = document.createElement('span');
                label.style.color = sentinel;
                label.textContent = 'Label';
                const marker = document.createElement('span');
                marker.style.color = ${JSON.stringify(token.field.required.color)};
                marker.textContent = '*';
                label.append(marker);
                child.append(label);
                parent.append(child);
                frame.append(parent);
                const check = { parentDesign, childDesign: 'md3', colorMode, sentinel,
                    parentRole: getComputedStyle(parent).getPropertyValue(requiredName).trim(),
                    childRole: getComputedStyle(child).getPropertyValue(requiredName).trim(),
                    labelColor: getComputedStyle(label).color, markerColor: getComputedStyle(marker).color };
                check.passed = nestedRequiredCheckPassed(check);
                nestedRequiredChecks.push(check);
                parent.remove();
            }
            return { actualTheme: frame.dataset.theme, actualDesign: frame.dataset.crabDesign, roles: names.length, differences, emptyRoles, unknownEmptyRoles, fallbackChecks, nestedRequiredChecks };
        } finally { probe.remove(); }
    })()`;
}
