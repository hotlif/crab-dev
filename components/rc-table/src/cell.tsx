import { type HTMLAttributes, useRef } from "react";
import { ChevronUp, ChevronDown } from "./icon";

import { cx, css } from "@linaria/core";
import {
	cellContainerStyle,
	cellExpandedGroupIconStyle,
	cellGroupTitleStyle,
} from "./style/index";
import { ColumnType, Row } from "./types";


export interface CellProps<T extends Row> extends Omit<HTMLAttributes<HTMLDivElement>,
	"onDragEnd" |
	"onDragStart" |
	"onDrag" |
	"onAnimationStart"
	> {
	type?: "group" | "normal"
	isHeaderCell?: boolean
	rowIndex: number
	dataRowIndex?: number,
	dataColumnIndex?: number,
	colStart : number
	colEnd: number
	expandedGroup?: boolean
	row?: T
	column: ColumnType<T>
	gridTemplateRows: number[]
}

function Cell<T extends Row> ({
	type,
	isHeaderCell,
	rowIndex,
	colStart,
	colEnd,
	className,
	children,
	style = {},
	expandedGroup,
	row,
	column,
	dataRowIndex,
	dataColumnIndex,
	gridTemplateRows,
	...restProps
}: CellProps<T>) {
	const divRef = useRef<HTMLDivElement>(null);
	const renderChildren = () => {
		let childrenElement = children;
		if (type === "group") {
			childrenElement = (
				<span
					className={css`${cellGroupTitleStyle}`}
				>
					{children}
					{expandedGroup ?
						<ChevronDown className={css`${cellExpandedGroupIconStyle}`}/> :
						<ChevronUp className={css`${cellExpandedGroupIconStyle}`} />
					}
				</span>
			);
		}
		if (column?.render != null && isHeaderCell !== true) {
			return column.render({
				row: row!,
				column,
				originalElement: childrenElement,
				rowIndex: dataRowIndex!,
				columnIndex: dataColumnIndex!,
			});
		}
		return childrenElement;
	};

	return (
		<div
			className={cx(css`${cellContainerStyle}`, className)}
			style={{
				...style,
				...{
					"--table-grid-column": `${colStart} / ${colEnd}`,
				} as Record<string, string>
			}}
			key={`${rowIndex}` + `-${colStart}-${colEnd}`}
			ref={divRef}
			{...restProps}
		>
			{renderChildren()}
		</div>
	);
};

export default Cell;
