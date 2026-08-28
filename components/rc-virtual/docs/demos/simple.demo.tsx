export const meta = {
    title: "基础示例",
    description: "虚拟滚动组件的基础使用示例",
};
import { type ReactNode } from "react"
import RcVirtual from "../../src/index.js";
import { css } from "@crab-dev/css";

const mockRowData = () => {
    const mockData = []
    for (let i = 0; i < 20000; i += 1) {
        mockData.push({
            a: `a-${i}`,
            b: `b-${i}`,
            c: `c-${i}`,
            d: `d-${i}`,
            e: `e-${i}`,
            f: `f-${i}`,
        })
    }
    return mockData;
}

const cellStyle = css`
	display: inline-block;
	box-sizing: border-box;
	border: 1px solid #000;
`

// 虚拟列表左侧占位：用于在可视区中预留被横向裁剪的区域
const paddingLeft = (
    <div
        key="virtual-left-padding"
        className={css`
			display: inline-block;
			box-sizing: border-box;
			width: var(--crab-rc-virtual-left-padding-width, 0px);
			height: 100%;
		`}
    />
)

// 虚拟列表右侧占位：用于在可视区中补齐右侧被裁剪宽度
const paddingRight = (
    <div
        key="virtual-right-padding"
        className={css`
			display: inline-block;
			box-sizing: border-box;
			width: var(--crab-rc-virtual-right-padding-width, 0px);
			height: 100%;
		`}
    />
)

// 虚拟列表底部占位：用于在纵向滚动时补齐不可见区域
const paddingBottom = (
    <div
        key="virtual-bottom-padding"
        className={css`
			display: inline-block;
			box-sizing: border-box;
			height: var(--crab-rc-virtual-bottom-padding-height, 0px);
			width: 100%;
		`}
    />
)

const mockData = mockRowData();
const gridTemplateColumns = [120, 120, 120, 120, 120, 120]
const ROW_HEIGHT = 24;
const totalWidth = gridTemplateColumns.reduce((a, b) => a + b, 0);

const SimpleDemo = () => {
    return (
        <RcVirtual
            viewportHeight={400}
            viewportWidth={300}
            gridTemplateColumns={gridTemplateColumns}
            gridTemplateRows={mockData.map(() => ROW_HEIGHT)}
            renderRows={(rowRange, columnRange) => {
                const rows: ReactNode[] = [
                    <div
                        key="virtual-top-padding"
                        className={css`
							display: inline-block;
							box-sizing: border-box;
							height: var(--crab-rc-virtual-top-padding-height, 0px);
							width: 100%;
						`}
                    />
                ];

                for (let rowIndex = rowRange[0]; rowIndex <= rowRange[1]; rowIndex += 1) {
                    const node = mockData[rowIndex];
                    const cells: ReactNode[] = [];
                    for (let colIndex = columnRange[0]; colIndex <= columnRange[1]; colIndex += 1) {
                        const keys = Object.keys(node) as (keyof typeof node)[];
                        cells.push(
                            <div
                                key={`cell-${rowIndex}-${colIndex}`}
                                className={cellStyle}
                                style={{ width: gridTemplateColumns[colIndex] }}
                            >
                                {node[keys[colIndex]]}
                            </div>
                        );
                    }

                    rows.push(
                        <div
                            key={`row-${rowIndex}`}
                            className={css`
								white-space: nowrap;
							`}
                            style={{
                                height: ROW_HEIGHT,
                                width: totalWidth,
                            }}
                        >
                            {paddingLeft}
                            {cells}
                            {paddingRight}
                        </div>
                    );
                }

                rows.push(paddingBottom);
                return rows;
            }}
        />
    )
}

export default SimpleDemo;
