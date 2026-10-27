import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import Button from '@crab-dev/rc-button';
import type { Row } from '@crab-dev/rc-table';
import TablePro, { type ProtocolColumnType, type TableDataRequest } from '@crab-dev/rc-table-pro';

export const meta = {
    title: '可重放的数据状态',
    description: '切换真实请求的加载、空结果、数据错误、列错误和成功状态。加载请求持续等待至切换场景时取消；请求计数来自传输函数的实际调用，可核对错误场景的重复重试，切换“显示数据”后恢复成功。',
};

type Scenario = 'loading' | 'empty' | 'data-error' | 'columns-error' | 'ready';
interface ExampleRow extends Row { dataRef: { name: string; status: string } }
const columns: ProtocolColumnType[] = [
    { name: '$.name', title: '项目 Name', dataType: 'text', width: 180 },
    { name: '$.status', title: '状态 Status', dataType: 'text', width: 160 },
];
const rows: ExampleRow[] = [{ id: 'example', dataRef: { name: '组件状态验收', status: '已加载 Ready' } }];
const scenarios: { id: Scenario; label: string }[] = [
    { id: 'loading', label: '保持加载' }, { id: 'empty', label: '显示空结果' },
    { id: 'data-error', label: '数据错误' }, { id: 'columns-error', label: '列错误' },
    { id: 'ready', label: '显示数据' },
];
const controlsStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; margin-block-end: ${token.space['stack-gap']};`;
const tableStyle = css`width: 100%; height: 320px;`;
const attemptsStyle = css`display: block; margin-block-end: ${token.space['inline-gap']}; font-size: ${token.font.size.caption};`;

function ScenarioTable({ scenario }: { scenario: Scenario }) {
    const [attempts, setAttempts] = useState({ columns: 0, data: 0 });
    // 模拟传输实例：保持请求函数身份，避免父配置更新重置正在验收的请求。
    const [transport] = useState(() => {
        const fetchColumns = (): Promise<ProtocolColumnType[]> => {
            setAttempts(current => ({ ...current, columns: current.columns + 1 }));
            return scenario === 'columns-error'
                ? Promise.reject(new Error('列定义暂时不可用。请使用表格内的重试按钮重新加载。'))
                : Promise.resolve(columns);
        };
        const request: TableDataRequest<ExampleRow> = ({ signal }) => {
            setAttempts(current => ({ ...current, data: current.data + 1 }));
            if (scenario === 'loading') {
                return new Promise((_resolve, reject) => {
                    const cancel = () => reject(new globalThis.DOMException('场景切换，已取消等待请求', 'AbortError'));
                    if (signal.aborted) cancel();
                    else signal.addEventListener('abort', cancel, { once: true });
                });
            }
            if (scenario === 'data-error') {
                return Promise.reject(new Error('数据服务暂时不可用。较长的错误说明应在窄屏下完整换行，并让重试操作保持可见。'));
            }
            const result = scenario === 'empty' ? [] : rows;
            return Promise.resolve({ rows: result, total: result.length });
        };
        return { fetchColumns, request };
    });
    return <>
        <output className={attemptsStyle} aria-label="传输请求次数" data-column-requests={attempts.columns} data-data-requests={attempts.data}>
            列请求：{attempts.columns}；数据请求：{attempts.data}
        </output>
        <TablePro<ExampleRow> className={tableStyle} fetchColumns={transport.fetchColumns} request={transport.request} pagination={false} sideBar={false} />
    </>;
}

export default function VisualStatesDemo() {
    const [scenario, setScenario] = useState<Scenario>('loading');
    const [replay, setReplay] = useState(0);
    return <section aria-label="表格请求状态" data-visual-scenario={scenario}>
        <div className={controlsStyle}>
            {scenarios.map(item => <Button key={item.id} appearance="outlined" onClick={() => { setScenario(item.id); setReplay(value => value + 1); }}>{item.label}</Button>)}
        </div>
        <ScenarioTable key={`${scenario}-${replay}`} scenario={scenario} />
    </section>;
}
