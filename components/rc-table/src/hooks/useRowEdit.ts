import { type Key, useCallback, useEffect, useState } from "react";

const EMPTY_EDITOR_VALUES: Record<string, unknown> = {};

interface UseRowEditParams {
    editType?: "cell" | "row"
    editingRowId?: Key | null
    defaultEditingRowId?: Key | null
    onEditingRowIdChange?: (id: Key | null) => void
    onRowCommit?: (rowId: Key, changes: Record<string, unknown>) => void
    onRowCancel?: (rowId: Key) => void
    isInteractionActive: () => boolean
}

export function useRowEdit(params: UseRowEditParams): {
    isRowEditMode: boolean;
    currentEditingRowId: Key | null;
    editorValues: Record<string, unknown>;
    startRowEdit: (rowId: Key) => void;
    setColumnValue: (columnName: string, value: unknown) => void;
    commitRowEdit: () => void;
    cancelRowEdit: () => void;
} {
    const { editType, editingRowId, defaultEditingRowId, onEditingRowIdChange, onRowCommit, onRowCancel, isInteractionActive } = params;

    const [innerEditingRowId, setInnerEditingRowId] = useState<Key | null>(defaultEditingRowId ?? null);

    const isRowEditMode = editType === "row";
    const currentEditingRowId: Key | null = isRowEditMode
        ? (editingRowId !== undefined ? editingRowId : innerEditingRowId)
        : null;

    const [editorDraft, setEditorDraft] = useState<{ rowId: Key | null; values: Record<string, unknown> }>(() => ({
        rowId: currentEditingRowId,
        values: EMPTY_EDITOR_VALUES,
    }));
    // 即使 passive effect 尚未执行，受控行刚切换的那次 render 也绝不能读取上一行草稿。
    const editorValues = editorDraft.rowId === currentEditingRowId
        ? editorDraft.values
        : EMPTY_EDITOR_VALUES;

    useEffect(() => {
        setEditorDraft(previous => previous.rowId === currentEditingRowId
            ? previous
            : { rowId: currentEditingRowId, values: EMPTY_EDITOR_VALUES });
    }, [currentEditingRowId]);

    const setEditingId = useCallback((id: Key | null) => {
        if (editingRowId === undefined) setInnerEditingRowId(id);
        onEditingRowIdChange?.(id);
    }, [editingRowId, onEditingRowIdChange]);

    const startRowEdit = useCallback((rowId: Key) => {
        setEditorDraft({ rowId, values: EMPTY_EDITOR_VALUES });
        setEditingId(rowId);
    }, [setEditingId]);

    const setColumnValue = useCallback((columnName: string, value: unknown) => {
        setEditorDraft(previous => ({
            rowId: currentEditingRowId,
            values: {
                ...(previous.rowId === currentEditingRowId ? previous.values : EMPTY_EDITOR_VALUES),
                [columnName]: value,
            },
        }));
    }, [currentEditingRowId]);

    const commitRowEdit = useCallback(() => {
        if (currentEditingRowId == null) return;
        onRowCommit?.(currentEditingRowId, editorValues);
        setEditorDraft({ rowId: null, values: EMPTY_EDITOR_VALUES });
        setEditingId(null);
    }, [currentEditingRowId, editorValues, onRowCommit, setEditingId]);

    const cancelRowEdit = useCallback(() => {
        if (currentEditingRowId == null) return;
        onRowCancel?.(currentEditingRowId);
        setEditorDraft({ rowId: null, values: EMPTY_EDITOR_VALUES });
        setEditingId(null);
    }, [currentEditingRowId, onRowCancel, setEditingId]);

    useEffect(() => {
        if (currentEditingRowId == null) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isInteractionActive()) cancelRowEdit();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [currentEditingRowId, cancelRowEdit, isInteractionActive]);

    return { isRowEditMode, currentEditingRowId, editorValues, startRowEdit, setColumnValue, commitRowEdit, cancelRowEdit };
}
