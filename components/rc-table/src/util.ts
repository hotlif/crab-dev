import { type TableProps } from "./table";
import { type Row } from "./types";

export function getGroupAllKeys<T extends Row>(tableRows: T[], groupBy: TableProps<T>["groupBy"] = [], groupByIndex: number, groupKey: string[]) {
	const keys: string[] = [];
	if (groupByIndex >= groupBy.length) {
		return keys;
	}

	const groupData = Object.groupBy(tableRows, (element) => (
		(element as Record<string, unknown>)[groupBy[groupByIndex]] as PropertyKey
	));
	
	Object.keys(groupData).forEach(key => {
		const groupKeys = [...groupKey, key];
		const values = groupData[key]!;
		const childrenKeys = getGroupAllKeys(values, groupBy, groupByIndex + 1, groupKeys);
		const k = [...groupKey, key].join("/");
		keys.push(...[k, ...childrenKeys]);
	});
	return keys;
};