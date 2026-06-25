import { type Key, useCallback, useEffect, useState } from "react";

interface UseRowEditParams {
    editType?: "cell" | "row"
    editingRowId?: Key | null
    defaultEditingRowId?: Key | null
    onEditingRowIdChange?: (id: Key | null) => void
    onRowCommit?: (rowId: Key, changes: Record<string, unknown>) => void
    onRowCancel?: (rowId: Key) => void
}

export function useRowEdit(params: UseRowEditParams) {
    const { editType, editingRowId, defaultEditingRowId, onEditingRowIdChange, onRowCommit, onRowCancel } = params;

    const [innerEditingRowId, setInnerEditingRowId] = useState<Key | null>(defaultEditingRowId ?? null);
    const [editorValues, setEditorValues] = useState<Record<string, unknown>>({});

    const isRowEditMode = editType === "row";
    const currentEditingRowId: Key | null = isRowEditMode
        ? (editingRowId !== undefined ? editingRowId : innerEditingRowId)
        : null;

    const setEditingId = useCallback((id: Key | null) => {
        if (editingRowId === undefined) setInnerEditingRowId(id);
        onEditingRowIdChange?.(id);
    }, [editingRowId, onEditingRowIdChange]);

    const startRowEdit = useCallback((rowId: Key) => {
        setEditorValues({});
        setEditingId(rowId);
    }, [setEditingId]);

    const setColumnValue = useCallback((columnName: string, value: unknown) => {
        setEditorValues(prev => ({ ...prev, [columnName]: value }));
    }, []);

    const commitRowEdit = useCallback(() => {
        if (currentEditingRowId == null) return;
        onRowCommit?.(currentEditingRowId, editorValues);
        setEditorValues({});
        setEditingId(null);
    }, [currentEditingRowId, editorValues, onRowCommit, setEditingId]);

    const cancelRowEdit = useCallback(() => {
        if (currentEditingRowId == null) return;
        onRowCancel?.(currentEditingRowId);
        setEditorValues({});
        setEditingId(null);
    }, [currentEditingRowId, onRowCancel, setEditingId]);

    useEffect(() => {
        if (!currentEditingRowId) return;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape") cancelRowEdit();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [currentEditingRowId, cancelRowEdit]);

    return { isRowEditMode, currentEditingRowId, editorValues, startRowEdit, setColumnValue, commitRowEdit, cancelRowEdit };
}
