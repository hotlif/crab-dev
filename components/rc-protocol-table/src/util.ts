import type { ColumnType, Row } from "@crab-dev/rc-table";
import type { DataTypeLoader, ProtocolColumnType} from "./types";

export const transformColumns = (
    columns: ProtocolColumnType[],
    dataTypeLoaders?: DataTypeLoader[]
): ColumnType<Row>[] => {
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
            render,
            editRender,
            children: Array.isArray(element.children) ? transformColumns(element.children, dataTypeLoaders) : undefined,
            filterCellClassName: element.filterCellClassName,
            filterEditor,
        }
    })
}
