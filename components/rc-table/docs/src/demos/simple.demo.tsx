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

const columnLength = 15;

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
	if (c > 13) {
		columns.push({
			name: `c${c}`,
			title: `列 ${c}`,
			width: 120,
			// fixed: "right"
		});
	} else if (c < 1) {
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

console.log("columns", columns);
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
					name: "user",
					title: "人物信息",
					width: 120,
					fixed: "left",
					children: [{
						title: "中文",
						name: "c",
						children: [{
							title: "姓名",
							name: "name",
							align: "center"
						}]
					}, {
						title: "英文",
						name: "e"
					}]
				},
				...columns
				]}
				rows={rows}
				width={1200}
				height={300}
			/>
		</div>
	);
};

export default SimpleTable;
