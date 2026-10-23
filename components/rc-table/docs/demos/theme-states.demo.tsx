import { css } from '@crab-dev/css';
import ConfigProvider from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import Table from '../../src/table.js';
import type { ColumnType, Row } from '../../src/types.js';

export const meta = {
    title: '三套风格与选中状态',
    description: '相同数据分别使用 macOS、MD3 和 shadcn；表头、分隔线、单元格留白及行选中配色随设计边界切换。',
};

interface Order extends Row {
    dataRef: { name: string; status: string; amount: number };
}

const rows: Order[] = [
    { id: '1', dataRef: { name: '年度订阅', status: '已完成', amount: 1280 } },
    { id: '2', dataRef: { name: '设计审核', status: '处理中', amount: 640 } },
    { id: '3', dataRef: { name: '团队席位', status: '待确认', amount: 320 } },
];
const columns: ColumnType<Order>[] = [
    { name: '$.name', title: '项目', width: 150 },
    { name: '$.status', title: '状态', width: 100 },
    { name: '$.amount', title: '金额', width: 90 },
];
const stackStyle = css`display: grid; gap: ${token.space['group-gap']}; width: 100%; min-width: 0;`;
const regionStyle = css`
    width: fit-content; max-width: 100%; overflow-x: auto;
    color: ${token.color.text.primary}; background: ${token.color.surface.content};
    border: 1px solid ${token.data.table.border.color}; border-radius: ${token.data.table.radius};
    &:focus-visible { outline: 2px solid ${token.color.focus.ring}; }
`;
const titleStyle = css`
    margin: 0; padding: ${token.space['component-gap']} ${token.data.table.cell['padding-inline']};
    font: inherit; font-weight: ${token.typography.label['font-weight']};
`;

export default function ThemeStatesDemo() {
    return (
        <div className={stackStyle}>
            {(['macos', 'material', 'shadcn'] as const).map((design) => (
                <ConfigProvider key={design} design={design}>
                    <section className={regionStyle} tabIndex={0} aria-label={`${design} 表格示例`}>
                        <h3 className={titleStyle}>{design === 'material' ? 'MD3' : design === 'macos' ? 'macOS' : 'shadcn'}</h3>
                        <Table
                            width={400} height={190} columns={columns} rows={rows}
                            aria-label={`${design} 订单`}
                            rowSelection={{ type: 'checkbox', defaultSelectedRowIds: new Set(['2']) }}
                        />
                    </section>
                </ConfigProvider>
            ))}
        </div>
    );
}
