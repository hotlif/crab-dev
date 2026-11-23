export const meta = {
    title: '远程分块与无限滚动',
    description: '跳到第 900,015 行，再回到首行。查看请求次数，验证远距离定位只请求目标块，回滚可复用缓存。可输入订单编号搜索。',
};

import { useRef, useState } from 'react';
import Button from '@crab-dev/rc-button';
import TablePro, { type ProtocolColumnType, type TableBlockQuery, type TableProHandle } from '@crab-dev/rc-table-pro';

const totalOrders = 1_000_000;
const columns: ProtocolColumnType[] = [
    { name: '$.order', title: '订单编号', dataType: 'text', width: 160, fixed: 'left', sortable: true },
    { name: '$.warehouse', title: '仓库', dataType: 'text' },
    { name: '$.items', title: '商品件数', dataType: 'number', align: 'right', width: 120 },
];
const fetchColumns = async () => columns;

function RemoteBlocksDemo() {
    const table = useRef<TableProHandle>(null);
    const [requests, setRequests] = useState(0);

    async function request({ startIndex, endIndex, sort, keyword, signal }: TableBlockQuery) {
        setRequests(count => count + 1);
        await new Promise<void>((resolve, reject) => {
            signal.throwIfAborted();
            const abort = () => {
                clearTimeout(timer);
                reject(signal.reason);
            };
            const timer = setTimeout(() => {
                signal.removeEventListener('abort', abort);
                resolve();
            }, 200);
            signal.addEventListener('abort', abort, { once: true });
        });
        const term = keyword?.trim();
        const matchingId = term ? Number(term.replace(/^ORD-/, '')) : undefined;
        const total = matchingId === undefined
            ? totalOrders
            : Number(Number.isInteger(matchingId) && matchingId >= 1 && matchingId <= totalOrders);
        const rows = Array.from({ length: Math.max(0, Math.min(endIndex, total) - startIndex) }, (_, offset) => {
            const index = startIndex + offset;
            const id = matchingId ?? (sort[0]?.direction === 'desc' ? totalOrders - index : index + 1);
            return {
                id,
                dataRef: { order: `ORD-${id}`, warehouse: id % 2 ? '东区仓' : '西区仓', items: id % 31 + 1 },
            };
        });
        return { total, rows };
    }

    function jump(index: number) {
        void table.current?.scrollToRowIndex(index, { align: 'center' }).catch(error => {
            if (error instanceof Error && error.name === 'AbortError') return;
            throw error;
        });
    }

    return <>
        <Button onClick={() => jump(0)}>回到首行</Button>
        <Button onClick={() => jump(900_014)}>跳到第 900,015 行</Button>
        <span>已发出 {requests} 次请求</span>
        <TablePro ref={table} fetchColumns={fetchColumns} style={{ width: '100%', height: 340 }}
            showSearchBar rowSelection={{ type: 'checkbox' }}
            remoteRows={{ request, blockSize: 100, maxCachedBlocks: 6 }} />
    </>;
}

export default RemoteBlocksDemo;
