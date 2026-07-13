/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Key } from "react";
import { JSONPath } from "jsonpath-plus";
import type { ColumnType, GroupRowMeta, MergeCell, Row, TreeRowMeta } from "./types";

/**
 * 按简单 JSONPath（$.a 或 $.a.b.c）把值写回对象。
 * 仅支持点号路径，不处理数组下标或通配符。
 */
export const setValueByJsonPath = (obj: unknown, path: string, value: unknown): void => {
    if (obj == null || typeof obj !== 'object') return;
    const parts = path.replace(/^\$\.?/, '').split('.').filter(Boolean);
    if (parts.length === 0) return;
    let cur: any = obj;
    for (let i = 0; i < parts.length - 1; i++) {
        if (cur == null || typeof cur !== 'object') return;
        cur = cur[parts[i]];
    }
    if (cur != null && typeof cur === 'object') {
        cur[parts[parts.length - 1]] = value;
    }
};

export interface HeaderCellType {
    column?: ColumnType<any>;
    rowSpan: number
    colSpan: number
    rowIndex: number
    columnIndex: number
    fixed?: "left" | "right"
}

/**
 * 递归计算列树结构的最大深度。
 *
 * @param columns - 当前计算的列节点，通常包含可选的 `children` 子列属性。
 * @param depth - 当前递归的深度，通常从 1 开始。
 * @returns 列树结构中的最大深度。
 */
export const calculateColumnDepth = (columns: ColumnType<any>, depth: number): number => {
    let maxNumber = depth;
    columns?.children?.forEach(element => {
        const nextDepthNumber = calculateColumnDepth(element, depth + 1);
        if (nextDepthNumber > maxNumber) {
            maxNumber = nextDepthNumber;
        }
    })
    return maxNumber;
}

/**
 * 从给定的列数组中返回最大深度的列。
 * 列的深度由 `calculateColumnDepth` 函数确定。
 *
 * @param columns - 需要评估的列定义数组。
 * @returns 拥有最大深度的列对象。
 */
export const getMaxDepth = (columns: ColumnType<any>[]) => {
    if (columns.length === 0) return 0;
    let maxColumnDepth = calculateColumnDepth(columns[0], 1);
    columns.forEach(element => {
        const nextColumnDepth = calculateColumnDepth(element, 1);
        if (nextColumnDepth > maxColumnDepth) {
            maxColumnDepth = nextColumnDepth;
        }
    })
    return maxColumnDepth;
}

/**
 * 递归获取嵌套列结构中的所有底层列。
 *
 * @param columns - 列定义数组，可能包含嵌套的子列。
 * @returns 不包含任何子列（即底层列）的列数组。
 */
export const getBottomColumns = (columns: ColumnType<any>[], fixed?: "left" | "right" ) => {
    const result: ColumnType<any>[] = []
    columns.forEach(element => {
        if (element.children && element.children.length > 0) {
            result.push(...getBottomColumns(element.children, element.fixed ?? fixed));
        } else {
            result.push({
                ...element,
                fixed: element.fixed ?? fixed
            });
        }
    })
    return result;
}

/**
 * 根据提供的列定义生成表头单元格的元数据数组。
 *
 * 此函数遍历列的树形结构，计算每个表头单元格的 `colSpan`、`rowSpan`、`rowIndex` 和 `columnIndex`，
 * 适用于渲染具有嵌套列的复杂表头。
 *
 * @param columns - 用于生成表头单元格的列定义数组。
 * @returns 一个 `HeaderCellType` 对象数组，每个对象表示一个带有计算后跨度和索引属性的表头单元格。
 */
export const getHeaderCells = (columns: ColumnType<any>[]) => {
    const maxDepth = getMaxDepth(columns);
    const traverse = (cols: ColumnType<any>[], depth: number, startColumnIndex: number, parent: HeaderCellType | null) => {
        const headerCells: HeaderCellType[] = [];
        let currentColumnIndex = startColumnIndex;
        cols.forEach((element) => {
            const bottomColumn = getBottomColumns([element]);
            const currentMaxDepth = calculateColumnDepth(element, 1);

            const rowIndex = depth;
            const colSpan = bottomColumn.length - 1;
            const headerCell = {
                column: element,
                colSpan,
                rowSpan: maxDepth - currentMaxDepth - depth,
                rowIndex,
                columnIndex: currentColumnIndex,
                fixed: element.fixed ?? parent?.fixed
            }
            headerCells.push(headerCell);
            if (element.children && element.children.length > 0) {
                const childCells = traverse(element.children, depth + 1, currentColumnIndex, headerCell);
                headerCells.push(...childCells);
            }
            currentColumnIndex += colSpan + 1;
        })
        return headerCells;
    }
    return traverse(columns, 0, 0, null);
}

export const getHeaderCellsTwoDimensionalArray = (columns: ColumnType<any>[]) => {
    const headerCells = getHeaderCells(columns);
    const maxRowIndex = Math.max(...headerCells.map(cell => cell.rowIndex));
    const maxColIndex = Math.max(...headerCells.map(cell => cell.columnIndex + (cell.colSpan || 0)));

    const result: (HeaderCellType | null)[][] = Array.from({ length: maxRowIndex + 1 }, () =>
        Array.from({ length: maxColIndex + 1 }, () => null)
    );
    headerCells.forEach(cell => {
        for (let r = 0; r <= (cell.rowSpan || 0); r += 1) {
            for (let c = 0; c <= (cell.colSpan || 0); c += 1) {
                const row = cell.rowIndex + r;
                const col = cell.columnIndex + c;
                if (r === 0 && c === 0) {
                    result[row][col] = cell;
                } else {
                    result[row][col] = null;
                }
            }
        }
    });
    return result;
}

export function sortColumns(columns: ColumnType<any>[]) {
    const getOrder = (col: ColumnType<any>) => {
        if (col.fixed === "left") return -1;
        if (col.fixed === "right") return 1;
        return 0;
    };
    columns.sort((a, b) => {
        return getOrder(a) - getOrder(b);
    });
    return columns;
}

export function buildMergeCellLookup(mergeCells: MergeCell[]) {
    const getCellKey = (rowIndex: number, columnIndex: number) => `${rowIndex}:${columnIndex}`;
    const skipCellSet = new Set<string>();
    const mergeCellMap = new Map<string, MergeCell>();

    mergeCells.forEach((mergeCell) => {
        const { rowIndex, columnIndex, rowSpan, colSpan } = mergeCell;
        mergeCellMap.set(getCellKey(rowIndex, columnIndex), mergeCell);
        for (let c = 0; c <= colSpan; c += 1) {
            for (let r = 0; r <= rowSpan; r += 1) {
                if (c === 0 && r === 0) {
                    continue;
                }
                skipCellSet.add(getCellKey(rowIndex + r, columnIndex + c));
            }
        }
    })

    return {
        getCellKey,
        skipCellSet,
        mergeCellMap
    }
}

export function getMergedCellSize({
    mergeCell,
    gridTemplateRows,
    gridTemplateColumns
}: {
    mergeCell: MergeCell,
    gridTemplateRows: number[],
    gridTemplateColumns: number[]
}) {
    const { rowSpan, colSpan } = mergeCell;
    let height = 0;
    let width = 0;
    for (let r = 0; r <= rowSpan; r += 1) {
        height += gridTemplateRows[mergeCell.rowIndex + r];
    }
    for (let c = 0; c <= colSpan; c += 1) {
        width += gridTemplateColumns[mergeCell.columnIndex + c];
    }
    return {
        height,
        width
    }
}

// =============== 单元格选中 Key ===============

export const KEY_SEP = "\u001F";

export const makeSelectKey = (rowId: Key, columnIndex: number): string =>
    `${String(rowId)}${KEY_SEP}${columnIndex}`;


// =============== 行分组（Row Grouping） ===============

// 分组行 id 前缀：用户传入的 row.id 不应以此开头，否则可能与内部生成的分组 id 冲突
export const GROUP_ROW_ID_PREFIX = "__rc_table_group__";

/**
 * 分组行在内部 displayRows 中的实际形态。
 * 它对外仍兼容 `Row`（保留 id / dataRef / height），通过 dataRef 上的 `__group` 标记区分。
 */
export interface InternalGroupRow<T extends Row> {
    id: Key
    height?: number
    dataRef: {
        __group: true
        meta: GroupRowMeta<T>
    }
}

export function isGroupRow<T extends Row>(row: T | InternalGroupRow<T>): row is InternalGroupRow<T> {
    return (row as InternalGroupRow<T>).dataRef != null
        && typeof (row as InternalGroupRow<T>).dataRef === "object"
        && (row as InternalGroupRow<T>).dataRef.__group === true;
}

// 用控制字符前缀做命名空间，避免与真实数据（包括字符串 "__null__"、JSON 片段等）撞车
const stringifyGroupValue = (value: unknown): string => {
    if (value === null) return "\u0000n";
    if (value === undefined) return "\u0000u";
    if (typeof value === "object") {
        try {
            return `\u0000o${JSON.stringify(value)}`;
        } catch {
            return `\u0000o${String(value)}`;
        }
    }
    return `\u0000${typeof value === "string" ? "s" : "p"}${String(value)}`;
};

const resolveColumnValue = <T extends Row>(row: T, columnName: string): unknown => {
    const result = JSONPath({ path: columnName, json: row?.dataRef, wrap: false });
    if (Array.isArray(result)) {
        return result[0];
    }
    return result;
};

/**
 * 根据 groupBy 与 rows 构造扁平化的展示行序列（分组 banner 行 + 叶子数据行）。
 *
 * 设计要点：
 * 1. 严格按 `rows` 原始顺序分组，不做隐式排序；相同分组键值若在 rows 中被拆开成两段，会被识别为两个独立分组，
 *    与 react-data-grid 行为一致，保留消费方对排序的掌控。
 * 2. 分组 id 形如 `__rc_table_group__::<level>::<encodedKey0>>>><encodedKey1>...`，包含路径，全局唯一。
 * 3. expandedSet 缺省视为"全部展开"（即首屏可见所有叶子），由消费方决定要不要做"默认全部收起"。
 * 4. 当 groupBy 为空或没有命中任何列时，直接返回原始 rows，避免无谓的包装。
 */
export function buildGroupedDisplayRows<T extends Row>(params: {
    rows: T[]
    groupBy: string[]
    expandedSet: Set<Key> | null
    defaultExpanded: boolean
}): {
    displayRows: Array<T | InternalGroupRow<T>>
    /** 当前 displayRows 中实际出现的分组 id（仅可见 banner 节点） */
    allGroupIds: Key[]
    /**
     * 数据集中**理论上**存在的全部分组 id —— 与展开状态无关。
     * 仅在「expandedSet 缺省 + defaultExpanded=true」时反推展开基线需要它，避免
     * 用户先收起父分组再切换其中某子分组时丢失同级展开状态。
     */
    allPossibleGroupIds: Key[]
} {
    const { rows, groupBy, expandedSet, defaultExpanded } = params;
    if (!groupBy || groupBy.length === 0) {
        return { displayRows: rows, allGroupIds: [], allPossibleGroupIds: [] };
    }

    const allGroupIds: Key[] = [];
    const allPossibleGroupIds: Key[] = [];
    const displayRows: Array<T | InternalGroupRow<T>> = [];

    interface BuildContext {
        level: number
        parentGroupId: string
        rowsSlice: T[]
    }

    const isExpanded = (groupId: string) => {
        if (expandedSet == null) return defaultExpanded;
        return expandedSet.has(groupId);
    };

    const walk = (ctx: BuildContext) => {
        const columnName = groupBy[ctx.level];
        if (columnName == null) {
            // 已到最深层，回归普通数据行
            displayRows.push(...ctx.rowsSlice);
            return;
        }

        // 顺序分组：相邻同值合并，遇到新值开新组
        let currentKey: string | null = null;
        let currentValue: unknown = null;
        let currentBucket: T[] = [];

        const flush = () => {
            if (currentBucket.length === 0) return;
            const groupIdStr = ctx.parentGroupId === ""
                ? `${GROUP_ROW_ID_PREFIX}::${ctx.level}::${currentKey}`
                : `${ctx.parentGroupId}>>>${currentKey}`;
            const expanded = isExpanded(groupIdStr);
            const meta: GroupRowMeta<T> = {
                groupId: groupIdStr,
                level: ctx.level,
                columnName,
                value: currentValue,
                // 末级分组的 count 等于桶大小；上级分组在递归末尾汇总
                count: currentBucket.length,
                expanded,
                leafRows: currentBucket
            };
            const groupRow: InternalGroupRow<T> = {
                id: groupIdStr,
                dataRef: {
                    __group: true,
                    meta
                }
            };
            allGroupIds.push(groupIdStr);
            allPossibleGroupIds.push(groupIdStr);
            // 收起态下也要把后续层级的分组 id 全量收集，确保 toggle 基线完整
            if (!expanded && ctx.level < groupBy.length - 1) {
                collectPossibleGroupIds(currentBucket, ctx.level + 1, groupIdStr);
            }
            const placeholderIndex = displayRows.length;
            displayRows.push(groupRow);
            if (expanded) {
                walk({
                    level: ctx.level + 1,
                    parentGroupId: groupIdStr,
                    rowsSlice: currentBucket
                });
            }
            // 上级 count = 之后展开追加的所有叶子行数；遍历完后回填
            if (ctx.level < groupBy.length - 1) {
                let leafCount = 0;
                for (let i = placeholderIndex + 1; i < displayRows.length; i += 1) {
                    if (!isGroupRow(displayRows[i])) {
                        leafCount += 1;
                    }
                }
                // 收起态下没有子节点可统计，退而用桶大小（叶子数据条数）
                meta.count = expanded ? Math.max(leafCount, currentBucket.length) : currentBucket.length;
            }

            currentKey = null;
            currentValue = null;
            currentBucket = [];
        };

        ctx.rowsSlice.forEach((row) => {
            const value = resolveColumnValue(row, columnName);
            const key = stringifyGroupValue(value);
            if (currentKey == null) {
                currentKey = key;
                currentValue = value;
                currentBucket.push(row);
            } else if (key === currentKey) {
                currentBucket.push(row);
            } else {
                flush();
                currentKey = key;
                currentValue = value;
                currentBucket.push(row);
            }
        });
        flush();
    };

    // 收起态下无需构造 displayRows，只把分组 id 全量遍历出来
    function collectPossibleGroupIds(slice: T[], level: number, parentId: string) {
        const columnName = groupBy[level];
        if (columnName == null) return;
        let currentKey: string | null = null;
        let currentBucket: T[] = [];
        const flushOne = () => {
            if (currentBucket.length === 0) return;
            const id = parentId === ""
                ? `${GROUP_ROW_ID_PREFIX}::${level}::${currentKey}`
                : `${parentId}>>>${currentKey}`;
            allPossibleGroupIds.push(id);
            if (level < groupBy.length - 1) {
                collectPossibleGroupIds(currentBucket, level + 1, id);
            }
            currentKey = null;
            currentBucket = [];
        };
        slice.forEach((row) => {
            const key = stringifyGroupValue(resolveColumnValue(row, columnName));
            if (currentKey == null || key === currentKey) {
                currentKey = key;
                currentBucket.push(row);
            } else {
                flushOne();
                currentKey = key;
                currentBucket.push(row);
            }
        });
        flushOne();
    }

    walk({ level: 0, parentGroupId: "", rowsSlice: rows });

    return { displayRows, allGroupIds, allPossibleGroupIds };
}


// =============== 树形数据（Tree Data） ===============

/**
 * 将树形结构数据深度优先展开为扁平行列表，同时构造每行的树形元数据。
 *
 * 设计要点：
 * 1. 保留原始 rows 顺序，相同层级的兄弟节点按原始顺序排列；
 * 2. expandedSet 缺省视为"按 defaultExpanded 决定"，空集合表示全部收起；
 * 3. treeRowMetaMap 覆盖所有被展开路径上的节点，收起节点的子孙不在其中。
 */
export function buildTreeDisplayRows<T extends Row>(params: {
    rows: T[]
    getChildRows: (row: T) => T[] | undefined | null
    expandedSet: Set<Key> | null
    defaultExpanded: boolean
}): {
    displayRows: T[]
    treeRowMetaMap: Map<Key, TreeRowMeta>
    allExpandableIds: Key[]
} {
    const { rows, getChildRows, expandedSet, defaultExpanded } = params;
    const displayRows: T[] = [];
    const treeRowMetaMap = new Map<Key, TreeRowMeta>();
    const allExpandableIds: Key[] = [];

    const isExpanded = (id: Key): boolean => {
        if (expandedSet == null) return defaultExpanded;
        return expandedSet.has(id);
    };

    const walk = (rowSlice: T[], level: number) => {
        for (const row of rowSlice) {
            const children = getChildRows(row);
            const hasChildren = Array.isArray(children) && children.length > 0;
            if (hasChildren) allExpandableIds.push(row.id);
            const expanded = hasChildren && isExpanded(row.id);
            treeRowMetaMap.set(row.id, { level, hasChildren, isExpanded: expanded });
            displayRows.push(row);
            if (expanded && children) {
                walk(children as T[], level + 1);
            }
        }
    };

    walk(rows, 0);
    return { displayRows, treeRowMetaMap, allExpandableIds };
}


// =============== 行展开（Row Expansion / 详情面板） ===============

// 内部展开图标列的列名：用户列 name 不应与此撞车
export const EXPAND_COLUMN_NAME = "__rc_table_expand__";

// 展开内容行 id 前缀：拼接源行 id 生成稳定且唯一的虚拟行 id
export const EXPANDED_CONTENT_ROW_ID_PREFIX = "__rc_table_expanded_content__";

/**
 * 展开内容行在内部 displayRows 中的实际形态。
 * 与分组行一样对外兼容 `Row`（保留 id / dataRef / height），通过 dataRef 上的 `__expandedContent` 标记区分；
 * sourceRow 指向触发展开的原始数据行，供 expandedRowRender 消费。
 */
export interface InternalExpandedRow<T extends Row> {
    id: Key
    height?: number
    dataRef: {
        __expandedContent: true
        sourceRow: T
    }
}

export function isExpandedContentRow<T extends Row>(
    row: T | InternalGroupRow<T> | InternalExpandedRow<T>
): row is InternalExpandedRow<T> {
    return (row as InternalExpandedRow<T>).dataRef != null
        && typeof (row as InternalExpandedRow<T>).dataRef === "object"
        && (row as InternalExpandedRow<T>).dataRef.__expandedContent === true;
}

/**
 * 是否为内部虚拟行（分组 banner 或展开内容行）—— 即非用户数据行。
 * 供各 cell 相关 hook 在按 rowIndex 遍历 displayRows 时统一跳过非数据行，
 * 其 false 分支可将联合类型收窄回纯数据行 T。
 */
export function isInternalRow<T extends Row>(
    row: T | InternalGroupRow<T> | InternalExpandedRow<T>
): row is InternalGroupRow<T> | InternalExpandedRow<T> {
    return isGroupRow(row) || isExpandedContentRow(row);
}

/**
 * 在已有 displayRows（可能已经过分组/树形处理）基础上，为每个「已展开 + 可展开」的数据行
 * 在其后插入一条展开内容行（InternalExpandedRow）。
 *
 * 设计要点：
 * 1. 仅对真实数据行生效，分组 banner / 树形等内部行不插入；
 * 2. 展开内容行高度优先取 getExpandedRowHeight(row)，否则回退 expandedRowHeight；
 * 3. allExpandableIds 收集所有可展开的数据行 id，供全量切换使用。
 */
export function buildExpansionDisplayRows<T extends Row>(params: {
    displayRows: Array<T | InternalGroupRow<T>>
    expandedSet: Set<Key>
    isRowExpandable?: (row: T) => boolean
    expandedRowHeight: number
    getExpandedRowHeight?: (row: T) => number | undefined
}): {
    displayRows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>
    allExpandableIds: Key[]
} {
    const { displayRows, expandedSet, isRowExpandable, expandedRowHeight, getExpandedRowHeight } = params;
    const result: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>> = [];
    const allExpandableIds: Key[] = [];

    displayRows.forEach((row) => {
        result.push(row);
        if (isGroupRow(row)) return;
        const dataRow = row as T;
        const expandable = isRowExpandable ? isRowExpandable(dataRow) : true;
        if (!expandable) return;
        allExpandableIds.push(dataRow.id);
        if (!expandedSet.has(dataRow.id)) return;
        const height = getExpandedRowHeight?.(dataRow) ?? expandedRowHeight;
        result.push({
            id: `${EXPANDED_CONTENT_ROW_ID_PREFIX}::${String(dataRow.id)}`,
            height,
            dataRef: {
                __expandedContent: true,
                sourceRow: dataRow
            }
        });
    });

    return { displayRows: result, allExpandableIds };
}
