import { css } from '@crab-dev/css';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import token, { designSystemRegistry } from '@crab-dev/rc-token-semantic';
import Table from '@crab-dev/rc-table';
import type { ColumnType, Row } from '@crab-dev/rc-table';

export const meta = {
    title: '当前主题的交互状态',
    description: '观察当前主题下的选中、禁用和焦点反馈；示例继承文档配置，可直接操作。',
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
const stackStyle = css`
    display: grid; grid-template-columns: minmax(0, 1fr);
    gap: ${token.space['group-gap']}; width: 100%; min-width: 0;
`;
const boundaryStyle = css`min-width: 0; max-width: 100%;`;
const regionStyle = css`
    box-sizing: border-box; width: fit-content; min-width: 0; max-width: 100%; overflow-x: auto;
    color: ${token.color.text.primary}; background: ${token.color.surface.content};
    border: 1px solid ${token.data.table.border.color}; border-radius: ${token.data.table.radius};
    &:focus-visible { outline: 2px solid ${token.color.focus.ring}; }
`;
const titleStyle = css`
    margin: 0; padding: ${token.space['component-gap']} ${token.data.table.cell['padding-inline']};
    font: inherit; font-weight: ${token.typography.label['font-weight']};
`;

export default function ThemeStatesDemo() {
    const { designSystem: design } = useConfig();
    return (
        <div className={stackStyle}>
            <ConfigProvider designSystem={design} className={boundaryStyle}>
                    <section className={regionStyle} tabIndex={0} aria-label={`${designSystemRegistry[design].label} 表格示例`}>
                        <h3 className={titleStyle}>{designSystemRegistry[design].label}</h3>
                        <Table
                            width={400} height={190} columns={columns} rows={rows}
                            aria-label={`${designSystemRegistry[design].label} 订单`}
                            rowSelection={{ type: 'checkbox', defaultSelectedRowIds: new Set(['2']) }}
                        />
                    </section>
                </ConfigProvider>
        </div>
    );
}
