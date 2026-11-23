import type { ColumnType, Row } from "@crab-dev/rc-table";
import type { DataTypeLoader, TableDataResult, ProtocolColumnType} from "./types.js";

export function positiveInteger(value: number | undefined, fallback: number): number {
    return typeof value === 'number' && Number.isSafeInteger(value) && value > 0 ? value : fallback;
}

export function columnsWithSummary<T extends Row>(columns: ColumnType<T>[], summary: TableDataResult<T>['summary']): ColumnType<T>[] {
    if (!summary) return columns;
    return columns.map(col => col.children ? { ...col, children: columnsWithSummary(col.children, summary) }
        : { ...col, summaryRender: () => summary[col.name] ?? null });
}

export const transformColumns = <T extends Row>(
    columns: ProtocolColumnType[],
    dataTypeLoaders?: DataTypeLoader<T>[]
): ColumnType<T>[] => {
    return columns.map(element => {
        const dataTypeLoader = dataTypeLoaders?.find(loader => loader.name === element.dataType);
        const render = dataTypeLoader?.render;
        const editRender = dataTypeLoader?.editRender;
        const filterEditor = dataTypeLoader?.filterEditor;
        return {
            name: element.name,
            title: element.title,
            width: element.width,
            align: element.align,
            hidden: element.hidden,
            fixed: element.fixed,
            filterable: element.filterable,
            sortable: element.sortable,
            resizable: element.resizable,
            selectable: element.selectable,
            render,
            editRender,
            parsePaste: dataTypeLoader?.parsePaste,
            validatePaste: dataTypeLoader?.validatePaste,
            filterEditor,
            getSearchText: dataTypeLoader?.getSearchText,
            summaryRender: dataTypeLoader?.summaryRender,
            children: Array.isArray(element.children) ? transformColumns(element.children, dataTypeLoaders) : undefined,
            filterCellClassName: element.filterCellClassName,
        }
    })
}
