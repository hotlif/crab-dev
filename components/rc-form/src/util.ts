import { type NamePath } from "./types";

export const setRecordValue = (formRecord: any, name: NamePath, value: any) => {
    const path: string[] = Array.isArray(name) ? name : [name];
    if (path.length === 0) return;
    path.reduce((acc: any, key: string, index: number) => {
        if (index === path.length - 1) {
            acc[key] = value;
            return acc;
        }
        if (acc[key] == null || typeof acc[key] !== 'object') {
            acc[key] = {};
        }
        return acc[key];
    }, formRecord);
}

export const getRecordValue = (formRecord: any, name: NamePath) => {
    if (formRecord == null) {
        return undefined;
    }
    const path: string[] = Array.isArray(name) ? name : [name];
    return path.reduce((acc: any, key: string) => {
        if (acc == null) {
            return undefined;
        }
        return acc[key];
    }, formRecord);
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