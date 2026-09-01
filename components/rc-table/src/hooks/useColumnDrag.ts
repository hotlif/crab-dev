import { type DragEvent as ReactDragEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ColumnType } from "../types.js";

export type DropSide = 'left' | 'right';

export interface DropIndicator {
    columnName: string;
    side: DropSide;
}

interface DragState {
    columnName: string;
    // null = 顶层列拖拽；string = 该父分组名下的子列拖拽
    groupName: string | null;
}

export function useColumnDrag(params: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sColumns: ColumnType<any>[]
    onColumnOrderChange?: (orderedColumnNames: string[]) => void
    onGroupColumnOrderChange?: (groupName: string, orderedChildNames: string[]) => void
}): {
    draggingColumnName: string | null;
    draggingGroupName: string | null;
    dropIndicator: DropIndicator | null;
    handleDragStart: (columnName: string, groupName: string | null, e: ReactDragEvent) => void;
    handleDragOver: (columnName: string, groupName: string | null, e: ReactDragEvent, isSubCell?: boolean) => void;
    handleDrop: (columnName: string, groupName: string | null, e: ReactDragEvent) => void;
    handleDragEnd: () => void;
    handleDragLeave: (e: ReactDragEvent) => void;
} {
    const { sColumns, onColumnOrderChange, onGroupColumnOrderChange } = params;

    const [draggingState, setDraggingState] = useState<DragState | null>(null);
    const [dropIndicator, setDropIndicator] = useState<DropIndicator | null>(null);

    const dropIndicatorRef = useRef<DropIndicator | null>(null);
    dropIndicatorRef.current = dropIndicator;

    const clearTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    useEffect(() => () => {
        if (clearTimerRef.current !== null) clearTimeout(clearTimerRef.current);
    }, []);

    // 顶层非固定列名（用于顶层重排）
    const movableTopNames = useMemo(
        () => sColumns.filter(c => !c.fixed).map(c => c.name),
        [sColumns]
    );

    // 分组名 → 子列名数组（用于组内重排）
    const groupChildrenMap = useMemo(() => {
        const map = new Map<string, string[]>();
        sColumns.forEach(col => {
            if (col.children && col.children.length > 0) {
                map.set(col.name, col.children.map(c => c.name));
            }
        });
        return map;
    }, [sColumns]);

    // groupName: null = 顶层列，string = 子列所属父分组名
    const handleDragStart = useCallback((columnName: string, groupName: string | null, e: ReactDragEvent) => {
        setDraggingState({ columnName, groupName });
        e.dataTransfer.effectAllowed = 'move';
    }, []);

    const resolveDropSide = (e: ReactDragEvent): DropSide => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        return e.clientX < rect.left + rect.width / 2 ? 'left' : 'right';
    };

    /**
     * columnName: 目标列名（顶层或子列）
     * groupName:  null = 顶层 scope，string = 子列所在父分组名
     * isSubCell:  true 表示顶层拖拽时 r>0 的传播单元格，已在同一列上则不重算 side
     */
    const handleDragOver = useCallback((columnName: string, groupName: string | null, e: ReactDragEvent, isSubCell = false) => {
        if (!draggingState) return;

        // 取消待执行的 dragLeave 清除
        // 注：即使 scope 不匹配也先取消，防止鼠标临时经过无效区域（如顶层组头）时指示器消失
        if (clearTimerRef.current !== null) {
            clearTimeout(clearTimerRef.current);
            clearTimerRef.current = null;
        }

        // 拖拽 scope 必须与目标 scope 匹配
        if (draggingState.groupName !== groupName) return;
        if (columnName === draggingState.columnName) return;

        // 顶层拖拽时，目标必须是非固定的顶层列
        if (groupName === null) {
            const targetCol = sColumns.find(c => c.name === columnName);
            if (!targetCol || targetCol.fixed) return;
        }

        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';

        // 子单元格传播（顶层拖拽 r>0）：已在该列上则保持 side，防止抖动
        if (isSubCell && dropIndicatorRef.current?.columnName === columnName) return;

        const side = resolveDropSide(e);
        setDropIndicator(prev =>
            prev?.columnName === columnName && prev.side === side
                ? prev
                : { columnName, side }
        );
    }, [draggingState, sColumns]);

    const handleDrop = useCallback((columnName: string, groupName: string | null, e: ReactDragEvent) => {
        e.preventDefault();
        const from = draggingState;
        const savedIndicator = dropIndicatorRef.current;

        setDraggingState(null);
        setDropIndicator(null);

        if (clearTimerRef.current !== null) {
            clearTimeout(clearTimerRef.current);
            clearTimerRef.current = null;
        }

        if (!from || columnName === from.columnName) return;
        if (from.groupName !== groupName) return;

        const side = savedIndicator?.columnName === columnName
            ? savedIndicator.side
            : resolveDropSide(e);

        const reorder = (names: string[], fromName: string, toName: string) => {
            const fromIdx = names.indexOf(fromName);
            const toIdx = names.indexOf(toName);
            if (fromIdx < 0 || toIdx < 0) return null;
            let insertAt = side === 'left' ? toIdx : toIdx + 1;
            names.splice(fromIdx, 1);
            if (fromIdx < insertAt) insertAt -= 1;
            names.splice(insertAt, 0, fromName);
            return names;
        };

        if (groupName === null) {
            const result = reorder([...movableTopNames], from.columnName, columnName);
            if (result) onColumnOrderChange?.(result);
        } else {
            const childNames = groupChildrenMap.get(groupName) ?? [];
            const result = reorder([...childNames], from.columnName, columnName);
            if (result) onGroupColumnOrderChange?.(groupName, result);
        }
    }, [draggingState, movableTopNames, groupChildrenMap, onColumnOrderChange, onGroupColumnOrderChange]);

    const handleDragEnd = useCallback(() => {
        setDraggingState(null);
        setDropIndicator(null);
        if (clearTimerRef.current !== null) {
            clearTimeout(clearTimerRef.current);
            clearTimerRef.current = null;
        }
    }, []);

    const handleDragLeave = useCallback((e: ReactDragEvent) => {
        if ((e.currentTarget as HTMLElement).contains(e.relatedTarget as Node | null)) return;
        clearTimerRef.current = setTimeout(() => {
            setDropIndicator(null);
            clearTimerRef.current = null;
        }, 0);
    }, []);

    return {
        draggingColumnName: draggingState?.columnName ?? null,
        draggingGroupName: draggingState?.groupName ?? null,
        dropIndicator,
        handleDragStart,
        handleDragOver,
        handleDrop,
        handleDragEnd,
        handleDragLeave,
    };
}
