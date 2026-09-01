import { JSONPath } from "jsonpath-plus";

export interface DataValueAccessor {
    /** 与 JSONPath({ wrap: false }) 一致，返回第一个命中值。 */
    get: (dataRef: unknown) => unknown
    /** 与 JSONPath 默认行为一致，返回全部命中值。 */
    getAll: (dataRef: unknown) => unknown[]
}

const accessorCache = new Map<string, DataValueAccessor>();
const SIMPLE_SEGMENT = /^[A-Za-z_$][\w$]*$/;

const getSimplePathParts = (path: string): string[] | null => {
    const normalized = path.startsWith("$.")
        ? path.slice(2)
        : path.startsWith("$")
            ? path.slice(1)
            : path;
    if (normalized === "") return [];
    const parts = normalized.split(".");
    return parts.every(part => SIMPLE_SEGMENT.test(part)) ? parts : null;
};

const readSimplePath = (dataRef: unknown, parts: string[]): unknown => {
    let value = dataRef;
    for (const part of parts) {
        if (value == null || typeof value !== "object") return undefined;
        value = (value as Record<string, unknown>)[part];
    }
    return value;
};

/**
 * 为列路径编译并缓存读取器。常见点路径不再进入 JSONPath 解析器；数组、通配符、
 * 过滤表达式等高级 JSONPath 仍完整回退到 jsonpath-plus，保持现有兼容性。
 */
export const getDataValueAccessor = (path: string): DataValueAccessor => {
    const cached = accessorCache.get(path);
    if (cached) return cached;

    const simpleParts = getSimplePathParts(path);
    const accessor: DataValueAccessor = simpleParts
        ? {
            get: dataRef => readSimplePath(dataRef, simpleParts),
            getAll: dataRef => {
                const value = readSimplePath(dataRef, simpleParts);
                return value === undefined ? [] : [value];
            },
        }
        : {
            get: dataRef => JSONPath({ path, json: dataRef as object, wrap: false }),
            getAll: dataRef => {
                const result = JSONPath({ path, json: dataRef as object });
                return Array.isArray(result) ? result : [result];
            },
        };
    accessorCache.set(path, accessor);
    return accessor;
};
