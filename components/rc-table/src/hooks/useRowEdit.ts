import { type Key, type RefObject, useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import type { Row, RowEditErrors } from '../types.js';
import type { TableProps } from '../table-props.js';

const EMPTY_EDITOR_VALUES: Record<string, unknown> = {};

interface UseRowEditParams {
    editType?: "cell" | "row"
    editingRowId?: Key | null
    defaultEditingRowId?: Key | null
    onEditingRowIdChange?: (id: Key | null) => void
    onRowCommit?: TableProps<Row>['onRowCommit']
    onRowCancel?: (rowId: Key) => void
    isInteractionActive: () => boolean
    rootRef?: RefObject<HTMLElement | null>
}

export function useRowEdit(params: UseRowEditParams): {
    isRowEditMode: boolean;
    currentEditingRowId: Key | null;
    editorValues: Record<string, unknown>;
    saving: boolean;
    errors: RowEditErrors | undefined;
    startRowEdit: (rowId: Key) => void;
    setColumnValue: (columnName: string, value: unknown) => void;
    commitRowEdit: () => void;
    cancelRowEdit: () => void;
} {
    const { editType, editingRowId, defaultEditingRowId, onEditingRowIdChange, onRowCommit, onRowCancel, isInteractionActive, rootRef } = params;

    const [innerEditingRowId, setInnerEditingRowId] = useState<Key | null>(defaultEditingRowId ?? null);

    const isRowEditMode = editType === "row";
    const currentEditingRowId: Key | null = isRowEditMode
        ? (editingRowId !== undefined ? editingRowId : innerEditingRowId)
        : null;

    const pending = useRef<symbol | null>(null);
    const [saving, setSaving] = useState(false);
    const [errors, setErrors] = useState<RowEditErrors>();
    useLayoutEffect(() => {
        setSaving(false);
        setErrors(undefined);
        return () => { pending.current = null; };
    }, [currentEditingRowId]);

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
        if (pending.current) return;
        setErrors(undefined);
        setEditorDraft({ rowId, values: EMPTY_EDITOR_VALUES });
        setEditingId(rowId);
    }, [setEditingId]);

    const setColumnValue = useCallback((columnName: string, value: unknown) => {
        if (pending.current) return;
        setErrors(undefined);
        setEditorDraft(previous => ({
            rowId: currentEditingRowId,
            values: {
                ...(previous.rowId === currentEditingRowId ? previous.values : EMPTY_EDITOR_VALUES),
                [columnName]: value,
            },
        }));
    }, [currentEditingRowId]);

    const commitRowEdit = useCallback(async () => {
        if (currentEditingRowId == null || pending.current) return;
        const submission = Symbol();
        pending.current = submission;
        setErrors(undefined);
        try {
            const result = onRowCommit?.(currentEditingRowId, { ...editorValues });
            let validation: RowEditErrors | void;
            if (result && typeof result === 'object' && 'then' in result) {
                setSaving(true);
                validation = await result;
            } else {
                validation = result;
            }
            if (pending.current !== submission) return;
            if (validation && (validation.message || Object.values(validation.fieldErrors ?? {}).some(Boolean))) {
                setErrors(validation);
                return;
            }
            setEditorDraft({ rowId: null, values: EMPTY_EDITOR_VALUES });
            setEditingId(null);
        } catch (error) {
            if (pending.current === submission) setErrors({ message: error instanceof Error ? error.message : String(error) });
        } finally {
            if (pending.current === submission) {
                pending.current = null;
                setSaving(false);
            }
        }
    }, [currentEditingRowId, editorValues, onRowCommit, setEditingId]);

    const cancelRowEdit = useCallback(() => {
        if (currentEditingRowId == null || pending.current) return;
        setErrors(undefined);
        onRowCancel?.(currentEditingRowId);
        setEditorDraft({ rowId: null, values: EMPTY_EDITOR_VALUES });
        setEditingId(null);
    }, [currentEditingRowId, onRowCancel, setEditingId]);

    useEffect(() => {
        if (currentEditingRowId == null) return;
        const document = rootRef?.current?.ownerDocument ?? globalThis.document;
        const handler = (e: KeyboardEvent) => {
            if (e.key === "Escape" && isInteractionActive()) cancelRowEdit();
        };
        document.addEventListener("keydown", handler);
        return () => document.removeEventListener("keydown", handler);
    }, [rootRef, currentEditingRowId, cancelRowEdit, isInteractionActive]);

    return { isRowEditMode, currentEditingRowId, editorValues, saving, errors, startRowEdit, setColumnValue, commitRowEdit, cancelRowEdit };
}
