import { createContext, useContext, useRef, useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Button from '@crab-dev/rc-button';
import LineEdit, { TokenVars as lineEditVars } from '@crab-dev/rc-line-edit';
import TablePro, {
    type DataTypeLoader,
    type ProtocolColumnType,
    type TableDataRequest,
} from '@crab-dev/rc-table-pro';
import type { Row } from '@crab-dev/rc-table';

export const meta = {
    title: '专业表格验收矩阵',
    description: '公开类型加载器提供编辑；可取消请求逐步完成刷新、错误与重试，真实滚动保留专业工具栏。',
};
interface Order extends Row {
    dataRef: { name: string; status: string };
}
const columns: ProtocolColumnType[] = [
    {
        name: '$.name',
        title: '项目 / Project',
        dataType: 'order-name',
        width: 280,
        fixed: 'left',
        sortable: true,
        filterable: true,
    },
    { name: '$.status', title: '状态 / Status', dataType: 'text', width: 240, filterable: true },
];
const rows: Order[] = Array.from({ length: 60 }, (_, index) => ({
    id: `order-${index}`,
    dataRef: {
        name: `订单 ${String(index + 1).padStart(3, '0')} / Order`,
        status: index % 2 ? '处理中 Processing' : '已完成 Ready',
    },
}));
const fetchColumns = () => Promise.resolve(columns);
const fetchBrokenColumns = () => Promise.reject(new Error('列定义暂时不可用 / Columns unavailable.'));
const OrderNames = createContext<{
    names: Record<string, string>;
    commit: (id: string, value: string) => void;
} | null>(null);
function useOrderNames() {
    const store = useContext(OrderNames);
    if (!store) throw new Error('Order names must be provided by the matrix demo');
    return store;
}
function OrderName({ row }: { row: Order }) {
    const { names } = useOrderNames();
    return names[String(row.id)] ?? row.dataRef.name;
}
type EditorProps = Parameters<NonNullable<DataTypeLoader<Order>['editRender']>>[0];
const editorStyle = css`
    ${lineEditVars['root.touch.min-height']}: 0px;
    ${lineEditVars['root.outline-color-focus']}: currentColor;
    ${lineEditVars['root.outline-offset-focus']}: calc(-1 * var(${lineEditVars['root.outline-width-focus']}));
    width: 100%;
    min-width: 0;
    && {
        height: 100%;
        max-height: 100%;
        color: inherit;
        font: inherit;
    }
`;
function OrderEditor({ row, editorValue, onEditorValueChange, onCommit, onCancel }: EditorProps) {
    const { names, commit } = useOrderNames();
    const cancelled = useRef(false);
    return (
        <LineEdit
            autoFocus
            bordered={false}
            className={editorStyle}
            aria-label="专业订单名称草稿"
            value={typeof editorValue === 'string' ? editorValue : (names[String(row.id)] ?? row.dataRef.name)}
            onValueChange={onEditorValueChange}
            onKeyDown={(event) => {
                if (event.key === 'Escape') {
                    event.stopPropagation();
                    cancelled.current = true;
                    onCancel?.();
                }
            }}
            onBlur={(event) => {
                if (cancelled.current) return;
                const value = event.currentTarget.value;
                commit(String(row.id), value);
                onCommit?.(value);
            }}
        />
    );
}
// Editors consume the demo's state through context, so changing a draft does not reload column protocols.
const typeLoaders: DataTypeLoader<Order>[] = [
    {
        name: 'order-name',
        render: ({ row }) => <OrderName row={row} />,
        filterEditor: undefined,
        editRender: (props) => <OrderEditor {...props} />,
    },
];
interface PendingResponse {
    complete: () => void;
    fail: () => void;
}
const frame = css`
    width: 100%;
    max-width: 900px;
    min-width: 0;
    padding: ${token.space['component-gap']};
    box-sizing: border-box;
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
`;
const table = css`
    width: 100%;
    height: 360px;
`;
export default function VisualMatrixDemo() {
    const [scenario, setScenario] = useState('default');
    const [names, setNames] = useState<Record<string, string>>({});
    const [pending, setPending] = useState<PendingResponse | null>(null);
    const [revision, setRevision] = useState(0);
    const request: TableDataRequest<Order> = ({ signal, page, pageSize }) => {
        const pageRows = rows.slice((page - 1) * pageSize, page * pageSize).map((row) => ({
            ...row,
            dataRef: {
                ...row.dataRef,
                name: names[String(row.id)] ?? `${row.dataRef.name}${revision ? ' / Updated' : ''}`,
            },
        }));
        if (scenario === 'loading' || scenario === 'refreshing')
            return new Promise((resolve, reject) => {
                const finish = () => {
                    signal.removeEventListener('abort', abort);
                    setPending((current) => (current === controls ? null : current));
                };
                const abort = () => {
                    finish();
                    reject(new globalThis.DOMException('Request cancelled', 'AbortError'));
                };
                const controls = {
                    complete: () => {
                        finish();
                        setRevision(1);
                        resolve({
                            rows: pageRows.map((row) => ({
                                ...row,
                                dataRef: { ...row.dataRef, name: `${row.dataRef.name} / Updated` },
                            })),
                            total: rows.length,
                        });
                    },
                    fail: () => {
                        finish();
                        reject(new Error('刷新失败 / Refresh failed. 已有数据仍保留。'));
                    },
                };
                if (signal.aborted) abort();
                else {
                    signal.addEventListener('abort', abort, { once: true });
                    setPending(controls);
                }
            });
        if (scenario === 'error')
            return Promise.reject(new Error('数据暂时不可用 / Data unavailable. 请重试 / Retry.'));
        return Promise.resolve({
            rows: scenario === 'empty' ? [] : pageRows,
            total: scenario === 'empty' ? 0 : rows.length,
        });
    };
    return (
        <>
            <label>
                验收状态{' '}
                <select aria-label="验收状态" value={scenario} onChange={(event) => setScenario(event.target.value)}>
                    <option value="default">已有数据</option>
                    <option value="empty">空结果</option>
                    <option value="error">请求错误</option>
                    <option value="columns-error">列定义错误</option>
                    <option value="loading">加载中</option>
                    <option value="refreshing">保留数据刷新</option>
                </select>
            </label>
            {pending && (
                <div aria-label="真实请求响应控制">
                    <Button onClick={pending.complete}>完成请求 / Complete request</Button>
                    <Button onClick={pending.fail}>请求失败 / Fail request</Button>
                </div>
            )}
            <section aria-label="TablePro visual matrix" className={frame}>
                <OrderNames value={{ names, commit: (id, value) => setNames((current) => ({ ...current, [id]: value })) }}>
                    <TablePro<Order>
                        key={scenario === 'refreshing' ? 'default' : scenario}
                        aria-label="专业订单表格"
                        className={table}
                        fetchColumns={scenario === 'columns-error' ? fetchBrokenColumns : fetchColumns}
                        request={request}
                        typeLoaders={typeLoaders}
                        editType="cell"
                        rowSelection={{ type: 'checkbox' }}
                        sideBar
                        showSearchBar
                        pagination={{ defaultPageSize: 20, showTotal: true }}
                    />
                </OrderNames>
            </section>
        </>
    );
}
