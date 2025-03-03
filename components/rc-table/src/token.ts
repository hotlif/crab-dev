import { css } from "@linaria/core";

const TableCellBorderColorVarName = "--table-cell-border-color";
export const TableCellBorderColor = `var(${TableCellBorderColorVarName})`;

const TableHeaderBackgroundColorVarName = "--table-header-background-color";
export const TableHeaderBackgroundColor = `var(${TableHeaderBackgroundColorVarName})`;

const TableBodyGroupBackgroundColorVarName = "--table-body-group-background-color";
export const TableBodyGroupBackgroundColor = `var(${TableBodyGroupBackgroundColorVarName})`;

const TableCellSelectionColorVarName = "--table-cell-selection-color";
export const TableCellSelectionColor = `var(${TableCellSelectionColorVarName})`;

export const globals = css`
	:global() {
		html {
			--table-cell-border-color: #ddd;
			--table-header-background-color: hsl(0deg 0% 97.5%);
			--table-body-group-background-color: hsl(0deg 0% 98.5%);
			--table-cell-selection-color: rgb(22, 119, 255);
		}
	}
`;
