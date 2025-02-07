/**
 * label="基础用法"
 * description="一个简单的表格, 最基础的用法"
 */
import {
	fakerZH_CN
} from "@faker-js/faker";
import Table, {
	ColumnType, Row
} from "../../../src/index";
import { useState } from "react";

const row: Record<string, unknown>[] = [];

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
	row.push(data);
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
					width: "100%"
				}}
				columns={[{
					name: "name",
					title: "姓名",
					width: 120,
				}, {
					name: "age",
					title: "年龄",
					width: 120,
				}, {
					name: "avatar",
					title: "头像",
					width: 120,
					render: ({
						row,
					}) => {
						return (
							<img style={{ width: 35, height: 35}} src={row!.avatar as string} />
						);
					}
				},
					...columns
				]}
				rows={rows}
				onRowsChange={setRows}
			/>
		</div>
	);
};

export default SimpleTable;
