import { type NamePath } from "./types.js";

type DataRecord = Record<string, unknown>;

export const setRecordValue = <T extends object>(formRecord: T, name: NamePath, value: unknown) => {
    const path: string[] = Array.isArray(name) ? name : [name];
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

    const path: string[] = Array.isArray(name) ? name : [name];
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
    if (typeof name === "string" && typeof newName === "string" && name === newName) {
        return true;
    } else if (Array.isArray(name) && Array.isArray(newName) && name.length === newName.length) {
        for (let i = 0; i < name.length; i += 1) {
            if (newName[i] != name[i]) {
                return false;
            }
        }
        return true;
    } else {
        return false;
    }
}