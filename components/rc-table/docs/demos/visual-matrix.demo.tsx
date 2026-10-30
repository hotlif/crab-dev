import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import LineEdit from '@crab-dev/rc-line-edit';
import Table, { type ColumnType, type Row } from '@crab-dev/rc-table';

export const meta = {
    title: '表格验收矩阵',
    description: '固定数据核对行密度、固定列、选择、展开、编辑及虚拟滚动。尺寸和密度由工作台独立切换。',
};
interface Order extends Row {
    dataRef: { name: string; status: string; amount: number };
}
const initialRows: Order[] = Array.from({ length: 80 }, (_, index) => ({
    id: `order-${index + 1}`,
    dataRef: {
        name: `订单 ${String(index + 1).padStart(3, '0')} / Order`,
        status: index % 2 ? '处理中 Processing' : '已完成 Ready',
        amount: 1280 + index,
    },
}));
const frame = css`
    width: 100%;
    min-width: 0;
    max-width: 800px;
    padding: ${token.space['component-gap']};
    box-sizing: border-box;
    background: ${token.color.surface.content};
    color: ${token.color.text.primary};
`;
const measured = css`
    width: 100%;
    height: 300px;
    min-width: 0;
`;
const field = css`
    width: 100%;
    min-width: 0;
`;
export default function VisualMatrixDemo() {
    const [state, setState] = useState('default');
    const [rows, setRows] = useState(initialRows);
    const [activeOrder, setActiveOrder] = useState('尚未打开订单 / No order opened');
    const columns: ColumnType<Order>[] = [
        {
            name: '$.name',
            title: '项目 / Project',
            width: 240,
            fixed: 'left',
            sortable: true,
            editRender: ({ row, editorValue, onEditorValueChange, onCommit, onCancel }) => (
                <LineEdit
                    autoFocus
                    bordered={false}
                    className={field}
                    aria-label="订单名称草稿"
                    value={typeof editorValue === 'string' ? editorValue : row.dataRef.name}
                    onValueChange={onEditorValueChange}
                    onKeyDown={(event) => {
                        if (event.key === 'Escape') {
                            event.stopPropagation();
                            onCancel?.();
                        }
                    }}
                    onBlur={(event) => {
                        const value = event.currentTarget.value;
                        setRows((current) =>
                            current.map((item) =>
                                item.id === row.id ? { ...item, dataRef: { ...item.dataRef, name: value } } : item,
                            ),
                        );
                        onCommit?.(value);
                    }}
                />
            ),
        },
        { name: '$.status', title: '状态 / Status', width: 240 },
        { name: '$.amount', title: '金额 / Amount', width: 180, align: 'right', sortable: true },
    ];
    return (
        <>
            <label>
                验收状态{' '}
                <select aria-label="验收状态" value={state} onChange={(event) => setState(event.target.value)}>
                    <option value="default">已有数据</option>
                    <option value="empty">空数据</option>
                </select>
            </label>
            <section aria-label="Table visual matrix" className={frame}>
                <AutoSizer className={measured}>
                    {({ width, height }) => (
                        <Table
                            aria-label="订单验收表格"
                            width={width}
                            height={height}
                            rows={state === 'empty' ? [] : rows}
                            columns={columns}
                            onRowClick={(row) => setActiveOrder(row.dataRef.name)}
                            editType="cell"
                            resizable
                            showRowNumber
                            rowSelection={{ type: 'checkbox' }}
                            expandedRowHeight={80}
                            expandedRowRender={(row) => (
                                <p>{row.dataRef.name}：固定日期 2026-10-29 的审批说明 / Review details</p>
                            )}
                        />
                    )}
                </AutoSizer>
                <output aria-label="已打开订单">{activeOrder}</output>
            </section>
        </>
    );
}
