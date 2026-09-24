import { type NamePath } from "./types.js";

type DataRecord = Record<string, unknown>;

export const setRecordValue = <T extends object>(formRecord: T, name: NamePath, value: unknown) => {
    const path = typeof name === 'string' ? [name] : name;
    if (path.length === 0) {
        return;
    }

    let current: DataRecord = formRecord as DataRecord;
    for (let index = 0; index < path.length; index += 1) {
        const key = path[index];

        if (index === path.length - 1) {
            current[key] = value;
            return;
        }

        const next = current[key];
        if (typeof next !== "object" || next == null || Array.isArray(next)) {
            const nextRecord: DataRecord = {};
            current[key] = nextRecord;
            current = nextRecord;
            continue;
        }

        current = next as DataRecord;
    }
}

export const getRecordValue = <T extends object>(formRecord: T | null | undefined, name: NamePath) => {
    if (formRecord == null) {
        return undefined;
    }

    const path = typeof name === 'string' ? [name] : name;
    let current: unknown = formRecord;

    for (const key of path) {
        if (typeof current !== "object" || current == null) {
            return undefined;
        }
        current = (current as DataRecord)[key];
    }

    return current;
}

export const equalsNamePath = (name: NamePath, newName: NamePath) => {
    const left = typeof name === 'string' ? [name] : name;
    const right = typeof newName === 'string' ? [newName] : newName;
    return left.length === right.length && left.every((part, index) => part === right[index]);
}