
/**
 * title = "大规模数据"
 * description = "1000 列 × 1000 行，验证虚拟滚动在大数据量下的滚动性能"
 */

import Table from "../../src/index.js";
import type { ColumnType, Row } from "../../src/index.js";

interface DemoRow extends Row {
    dataRef: Record<string, string>
}

const COL_COUNT = 1000;
const ROW_COUNT = 1000;

const columns: ColumnType<DemoRow>[] = Array.from({ length: COL_COUNT }, (_, i) => ({
    title: `Col ${i}`,
    name: `$.c${i}`,
    width: 100,
}));

const rows: DemoRow[] = Array.from({ length: ROW_COUNT }, (_, rowIndex) => {
    const dataRef: Record<string, string> = {};
    for (let c = 0; c < COL_COUNT; c += 1) {
        dataRef[`c${c}`] = `R${rowIndex}-C${c}`;
    }
    return { id: rowIndex, dataRef };
});

const LargeScaleDemo = () => {
    return (
        <Table
            width={1250}
            height={500}
            columns={columns}
            rows={rows}
        />
    )
}

export default LargeScaleDemo;
