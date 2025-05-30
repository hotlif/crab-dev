/**
 * label="基础用法"
 * description="一个简单的表格, 最基础的用法"
 */
import {
	fakerZH_CN
} from "@faker-js/faker";
import Table, { type Row, type ColumnType } from "../../../src/index";
import { useState } from "react";

const row: Row[] = [];

const columnLength = 200;

for (let i = 0; i < 1000; i += 1) {
	const data: Record<string, string | number> = {}; 
	data.name = fakerZH_CN.person.fullName();
	data.age = fakerZH_CN.number.int({
		min: 18,
		max: 56
	});;
	data.avatar = fakerZH_CN.image.avatarGitHub();
	for (let c =0; c < columnLength; c += 1) {
		data[`c${c}`] = `c${c}-${i}`;
	}
	row.push({
		id: i,
		dataRef: data,
	});
}

const columns: ColumnType<Row>[] = [];
for (let c =0; c < columnLength; c += 1) {
	if (c >= 198) {
		columns.push({
			name: `c${c}`,
			title: `列 ${c}`,
			width: 120,
			
		});
	} else {
		columns.push({
			name: `c${c}`,
			title: `列 ${c}`,
			width: 120,
		});
	}
}

const SimpleTable = () => {
	const [rows, setRows] = useState<Row[]>(row);
	return (
		<div>
			<Table
				style={{
					height: 500,
					width: 120,
				}}
				columns={[{
					name: "name",
					title: "姓名",
					width: 120,
					fixed: "left",
					children: [{
						title: "中文",
						name: "c",
						children: [{
							title: "中文1",
							name: "c1",
							align: "center"
						}]
					}, {
						title: "英文",
						name: "e"
					}]
				}, {
					name: "age",
					title: "年龄",
					width: 120,
					render: (e) => {
						return JSON.stringify(e.row)
					}
				},
				...columns
				]}
				rows={rows}
				width={1200}
				height={300}
				mergeCells={[{
					rowIndex: 0,
					columnIndex: 0,
					rowSpan: 1,
					colSpan: 2,
				}]}
			/>
		</div>
	);
};

export default SimpleTable;
