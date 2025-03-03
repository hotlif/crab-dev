import {
	TableCellBorderColor,
	TableCellSelectionColor,
	TableHeaderBackgroundColor,
	TableBodyGroupBackgroundColor,
} from "../token";

export const containerStyle = `
	border: 1px solid ${TableCellBorderColor};
	border-collapse: separate;
`;

export const leftAlignStyle = `
	text-align: left;
`;

export const rightAlignStyle = `
	text-align: right;
`;

export const centerAlignStyle = `
	text-align: center;
`;

export const cellSelectStyle = `
	outline: 2px solid ${TableCellSelectionColor};
	outline-offset: -2px;
`

export const headerContainerStyle = `
	background-color: ${TableHeaderBackgroundColor};
	border-bottom: 1px solid ${TableCellBorderColor};
	position: sticky;
`;

export const rowContainerStyle = `
	display: contents;
	background-color: #fff;
`;

export const cellContainerStyle = `
	padding-inline: 8px;
	grid-column: var(--table-grid-column);
	grid-row-start: var(--table-grid-row-start);
	background-color: inherit;
    border-left: 1px solid ${TableCellBorderColor};
	border-bottom: 1px solid ${TableCellBorderColor};
	align-content: center;
	overflow: hidden;
	text-overflow: ellipsis;;
	white-space: nowrap;
`;

export const cellContainerFirstCell = `
	border-left: unset;
`;

export const fixedLeftStyle = `
	position: sticky;
`;

export const fixedRightStyle = `
	position: sticky;
`;

export const fixedLeftFirstStyle = `
	box-shadow: 2px 0 5px -2px rgba(136, 136, 136, .3);
	border-right: 1px solid ${TableCellBorderColor};
`;

export const fixedRightFirstStyle = `
	box-shadow: -2px 0 5px -2px rgba(136, 136, 136, .3);
	border-left: 1px solid ${TableCellBorderColor};
`;

export const fixedAndHeaderZIndexStyle = `
	z-index: 4;
`;

export const headerZIndexStyle = `
	z-index: 2;
`;

export const fixedZIndexStyle = `
	z-index: 3;
`;

export const cellGroupContainerStyle = `
	background-color: ${TableBodyGroupBackgroundColor};
	border-left: unset;
`;

export const cellExpandedGroupIconStyle = `
	margin-left: 4px;
	width: 14px;
`;

export const cellGroupTitleStyle = `
	cursor: pointer;
	user-select: none;
`;

export const cellDragHandleStyle = `
	width: 20px;
	vertical-align: bottom;
	margin-right: 8px;
	cursor: grab;
`;
