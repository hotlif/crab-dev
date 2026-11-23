import type { CellEditRecord, ColumnType, Row } from './types.js';
import { isInternalRow, type InternalExpandedRow, type InternalGroupRow } from './util.js';
import { getDataValueAccessor } from './valueAccess.js';

/** Spreadsheet text/plain uses TSV with CSV-style quoting, including embedded newlines. */
export function readClipboardRows(text: string): string[][] {
    const rows: string[][] = [];
    let row: string[] = [];
    let value = '';
    let quoted = false;
    for (let index = 0; index < text.length; index++) {
        const char = text[index];
        if (char === '"' && (quoted || value === '')) {
            if (quoted && text[index + 1] === '"') {
                value += '"';
                index++;
            } else {
                quoted = !quoted;
            }
        } else if (!quoted && char === '\t') {
            row.push(value);
            value = '';
        } else if (!quoted && (char === '\n' || char === '\r')) {
            if (char === '\r' && text[index + 1] === '\n') index++;
            rows.push([...row, value]);
            row = [];
            value = '';
        } else {
            value += char;
        }
    }
    if (row.length || value || !/[\r\n]$/.test(text)) rows.push([...row, value]);
    return rows;
}

export function getPasteRecords<T extends Row>(
    text: string, startRow: number, startColumn: number,
    rows: Array<T | InternalGroupRow<T> | InternalExpandedRow<T>>, columns: ColumnType<T>[],
    isCovered: (row: number, column: number) => boolean, batchId: string,
): CellEditRecord[] {
    const records: CellEditRecord[] = [];
    const timestamp = Date.now();
    let rowIndex = startRow;
    for (const fields of readClipboardRows(text)) {
        while (rows[rowIndex] && isInternalRow(rows[rowIndex])) rowIndex++;
        const row = rows[rowIndex];
        if (!row || isInternalRow(row)) break;
        for (const [offset, field] of fields.entries()) {
            const columnIndex = startColumn + offset;
            const column = columns[columnIndex];
            if (!column) break;
            if (column.selectable === false || !(column.editRender || column.parsePaste) || isCovered(rowIndex, columnIndex)) continue;
            const newValue = column.parsePaste ? column.parsePaste(field, row) : field;
            const error = column.validatePaste?.(newValue, row);
            if (error) throw new Error(column.title + ' · ' + error);
            const oldValue = getDataValueAccessor(column.name).get(row.dataRef);
            if (!Object.is(oldValue, newValue)) records.push({ rowId: row.id, columnName: column.name, columnIndex, oldValue, newValue, timestamp, batchId });
        }
        rowIndex++;
    }
    return records;
}
