import { useRef, useState } from 'react';
import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import TablePro, { type ProtocolColumnType, type TableProHandle, type TableQuery } from '@crab-dev/rc-table-pro';
import type { Row } from '@crab-dev/rc-table';

export const meta = {
    title: '刷新、定位与焦点',
    description: '刷新后等待完成反馈；定位记录 10 只查找当前页，聚焦按钮将键盘操作交回表格。',
};

interface ItemRow extends Row { dataRef: { name: string; revision: number } }
const columns: ProtocolColumnType[] = [
    { name: '$.name', title: '记录', dataType: 'text', width: 180 },
    { name: '$.revision', title: '数据版本', dataType: 'number', width: 120 },
];
const fetchColumns = async () => columns;
const layout = css`display: flex; flex-direction: column; gap: 12px;`;
const toolbar = css`display: flex; align-items: center; flex-wrap: wrap; gap: 12px;`;
const tableStyle = css`width: 100%; height: 360px;`;

export default function RefreshDemo() {
    const tableRef = useRef<TableProHandle>(null);
    // 可变演示数据源：模拟保存后的服务端版本，不承担表格的查询状态管理。
    const revision = useRef(1);
    const [busy, setBusy] = useState(false);
    const [status, setStatus] = useState('尚未手动更新');
    const request = async (query: TableQuery) => {
        await new Promise<void>(resolve => setTimeout(resolve, 300));
        query.signal.throwIfAborted();
        const allRows: ItemRow[] = Array.from({ length: 25 }, (_, index) => ({
            id: index + 1, dataRef: { name: `记录 ${index + 1}`, revision: revision.current },
        }));
        return { rows: allRows.slice((query.page - 1) * query.pageSize, query.page * query.pageSize), total: allRows.length };
    };
    const updateAndRefresh = async () => {
        const table = tableRef.current;
        if (!table) return;
        revision.current += 1;
        setBusy(true);
        setStatus('正在刷新');
        try {
            await table.refresh();
            setStatus('刷新完成，可以继续后续操作');
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') {
                setStatus('本次刷新已取消');
                return;
            }
            setStatus('刷新失败，请重试');
        } finally {
            setBusy(false);
        }
    };
    const locateRecord = async () => {
        const table = tableRef.current;
        if (!table) return;
        try {
            const found = await table.scrollToRow(10, { align: 'center' });
            setStatus(found ? '已定位记录 10' : '记录 10 不在当前页');
        } catch (error) {
            if (error instanceof Error && error.name === 'AbortError') return;
            setStatus('定位失败');
        }
    };
    return <div className={layout}>
        <div className={toolbar}>
            <Button disabled={busy} onClick={updateAndRefresh}>更新并刷新</Button>
            <Button disabled={busy} onClick={locateRecord}>定位记录 10</Button>
            <Button onClick={() => tableRef.current?.focus()}>聚焦表格</Button>
            <span role="status">{status}</span>
        </div>
        <TablePro<ItemRow> ref={tableRef} className={tableStyle} fetchColumns={fetchColumns} request={request}
            pagination={{ defaultPageSize: 10 }} showSearchBar resizable rowSelection={{ type: 'checkbox' }} />
    </div>;
}
