/**
 * title = "基础示例"
 * description = "虚拟滚动组件的基础使用示例"
 */
import { type Key, ReactNode, useState } from "react"
import RcVirtual from "../../src/index.js";
import { css } from "@linaria/core";

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


const styleClass = css`
	display: inline-block;
	border: 1px solid #000;
`

const mockData = mockRowData();
const gridTemplateColumns = [120, 120, 120, 120, 120, 120]

const SimpleDemo = () => {
    return (
        <RcVirtual
            viewportHeight={400}
            viewportWidth={300}
            gridTemplateColumns={gridTemplateColumns}
            gridTemplateRows={mockData.map(element => 24)}
            renderRows={(rowRange) => {
                const rows: ReactNode[] = [];
                let rowIndex = rowRange[0];
                if (rowIndex > 0) {
                    rowIndex -= 1;
                }


                for (; rowIndex <= rowRange[1]; rowIndex += 1) {
                    const nodes: ReactNode[] = [];
                    const node = mockData[rowIndex];
                    nodes.push((
                        <div
                            className={styleClass}
                            style={{
                                width: gridTemplateColumns[0],
                            }}
                        >
                            {node.a}
                        </div>
                    ))
                    nodes.push((
                        <div
                            className={styleClass}
                            style={{
                                width: gridTemplateColumns[1],
                            }}
                        >
                            {node.b}
                        </div>
                    ))
                    nodes.push((
                        <div
                            className={styleClass}
                            style={{
                                width: gridTemplateColumns[2],
                            }}
                        >
                            {node.c}
                        </div>
                    ))
                    nodes.push((
                        <div
                            className={styleClass}
                            style={{
                                width: gridTemplateColumns[3],
                            }}
                        >
                            {node.d}
                        </div>
                    ))
                    nodes.push((
                        <div
                            className={styleClass}
                            style={{
                                width: gridTemplateColumns[4],
                            }}
                        >
                            {node.e}
                        </div>
                    ))
                    nodes.push((
                        <div
                            className={styleClass}
                            style={{
                                width: gridTemplateColumns[5],
                            }}
                        >
                            {node.f}
                        </div>
                    ))

                    rows.push((
                        <div
                            className={css`
									white-space: nowrap;	
								`}
                        >
                            {nodes}
                        </div>
                    ));
                }
                return rows;
            }}
        />
    )
}

export default SimpleDemo;
