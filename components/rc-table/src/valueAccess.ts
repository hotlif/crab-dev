import { JSONPath } from "jsonpath-plus";

export interface DataValueAccessor {
    /** 与 JSONPath({ wrap: false }) 一致，返回第一个命中值。 */
    get: (dataRef: unknown) => unknown
    /** 与 JSONPath 默认行为一致，返回全部命中值。 */
    getAll: (dataRef: unknown) => unknown[]
}

const accessorCache = new Map<string, DataValueAccessor>();
const SIMPLE_SEGMENT = /^[A-Za-z_$][\w$]*$/;
const INDEXED_SEGMENT = /^[A-Za-z_$][\w$]*(?:\[(?:0|[1-9]\d*)\])+$/;
const MISSING = Symbol("missing path");

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

const createIndexedAccessor = (path: string): DataValueAccessor | undefined => {
    if (!path.includes("[") || (path.startsWith("$") && !path.startsWith("$."))) return undefined;
    const segments = (path.startsWith("$.") ? path.slice(2) : path).split(".");
    if (!segments.every(segment => segment !== "$" && (SIMPLE_SEGMENT.test(segment) || INDEXED_SEGMENT.test(segment)))) {
        return undefined;
    }
    const parts = segments.flatMap(segment => segment.split(/[\[\]]+/).filter(Boolean));
    if (parts.includes("$")) return undefined;

    const read = (dataRef: unknown): unknown => {
        // JSONPath returns undefined for a falsy root before evaluating the query.
        if (!dataRef) return undefined;
        let value: unknown = dataRef;
        for (const part of parts) {
            // Match JSONPath's own-property lookup, including sparse arrays and strings.
            if (!value || !Object.hasOwn(value as object, part)) return MISSING;
            value = (value as Record<string, unknown>)[part];
        }
        return value;
    };
    return {
        get: dataRef => {
            const value = read(dataRef);
            return value === MISSING ? undefined : value;
        },
        getAll: dataRef => {
            const value = read(dataRef);
            return value === MISSING ? [] : [value];
        },
    };
};

/**
 * 为列路径编译并缓存读取器。常见点路径和固定数组下标直接读取；通配符、切片和
 * 过滤表达式等 JSONPath 查询仍交由 jsonpath-plus 处理。
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
        : createIndexedAccessor(path) ?? {
            get: dataRef => JSONPath({ path, json: dataRef as object, wrap: false }),
            getAll: dataRef => {
                const result = JSONPath({ path, json: dataRef as object });
                return Array.isArray(result) ? result : [result];
            },
        };
    accessorCache.set(path, accessor);
    return accessor;
};
