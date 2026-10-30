import { visualArgumentIntent } from './argument-intent.mjs';

const matrixAxes = ["designSystem", "colorMode", "size", "density", "state"];

/** Derive acceptance cells from package-owned specifications, never component switches. */
export function expectedMatrix(spec, designs, engine) {
    const selected = engine === "chromium" ? spec : spec.crossEngine;
    if (!selected) throw Error("A crossEngine subset must declare every component's default and key interactions");
    return designs.flatMap(designSystem => ["light", "dark"].flatMap(colorMode => selected.sizes.flatMap(size => selected.densities.flatMap(density => selected.states.map(state => ({ designSystem, colorMode, size, density, state }))))));
}

/** A skipped, absent, duplicated or failed cell cannot count as accepted. */
export function assessMatrix(expected, observed, { complete = true } = {}) {
    return assessCells(expected, observed, matrixAxes, complete);
}

export function expectedEnvironments(spec, designs, environments) {
    return designs.flatMap(designSystem => ["light", "dark"].flatMap(colorMode => environments.filter(environment => !spec.notApplicable?.[environment.id]).map(({ id }) => ({ designSystem, colorMode, id }))));
}

/** Validate axes before separating required environments from package additions. */
export function parseEnvironmentAnnotation(description) {
    const cell = JSON.parse(description);
    if (["designSystem", "colorMode", "id"].some(axis => typeof cell?.[axis] !== "string" || !cell[axis].trim())) throw Error("Environment annotation is missing an axis");
    return cell;
}

export function assessEnvironments(expected, observed, { complete = true } = {}) {
    return assessCells(expected, observed, ["designSystem", "colorMode", "id"], complete);
}

function assessCells(expected, observed, axes, complete) {
    const key = value => axes.map(axis => value[axis]).join("/");
    const expectedKeys = new Set(expected.map(key));
    const actual = new Map();
    const errors = [];
    for (const cell of observed) {
        if (axes.some(axis => typeof cell[axis] !== "string" || !cell[axis])) { errors.push("Matrix annotation is missing an axis"); continue; }
        const id = key(cell);
        if (!expectedKeys.has(id)) errors.push(`Undeclared matrix cell: ${id}`);
        if (actual.has(id)) errors.push(`Duplicate matrix cell: ${id}`);
        actual.set(id, cell);
    }
    const cells = expected.map(cell => ({ ...cell, status: actual.get(key(cell))?.status ?? "missing", ...(actual.get(key(cell))?.testId ? { testId: actual.get(key(cell)).testId } : {}) }));
    if (complete) for (const cell of cells) if (cell.status !== "passed") errors.push(`${cell.status}: ${key(cell)}`);
    return { complete, expected: expected.length, passed: cells.filter(cell => cell.status === "passed").length, cells, errors };
}

export function isFilteredVisualRun(args) {
    return visualArgumentIntent(args).filtered;
}
