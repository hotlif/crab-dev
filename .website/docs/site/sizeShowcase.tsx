import { css } from '@crab-dev/css';
import ConfigProvider, { type ConfigSize } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import Button from '@crab-dev/rc-button';
import Card from '@crab-dev/rc-card';
import LineEdit from '@crab-dev/rc-line-edit';
import NumberEdit from '@crab-dev/rc-number-edit';
import TextEdit from '@crab-dev/rc-text-edit';
import Select from '@crab-dev/rc-select';
import Segmented from '@crab-dev/rc-segmented';
import Pagination from '@crab-dev/rc-pagination';
import Checkbox from '@crab-dev/rc-checkbox';
import Radio from '@crab-dev/rc-radio';
import Switch from '@crab-dev/rc-switch';
import Tabs from '@crab-dev/rc-tabs';
import Menu, { MenuItemType } from '@crab-dev/rc-menu';
import Table, { type ColumnType, type Row } from '@crab-dev/rc-table';
import AutoSizer from '@crab-dev/rc-auto-sizer';
import { useState } from 'react';

const stackStyle = css`
    display: grid;
    min-width: 0;
    gap: ${token.density.gap};
    color: ${token.color.text.primary};
`;
const fieldsStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.size[64]} * 3)), 1fr));
    gap: ${token.density.gap};
    align-items: start;
    & > * { min-width: 0; max-width: 100%; }
`;
const rowStyle = css`
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: ${token.density.gap};
`;
const tableStyle = css`
    height: calc(${token.size[64]} * 5);
    min-width: 0;
`;

interface SampleRow extends Row {
    dataRef: { name: string; owner: string; state: string };
}
const columns: ColumnType<SampleRow>[] = [
    { name: '$.name', title: '任务', width: 200 },
    { name: '$.owner', title: '负责人', width: 120 },
    { name: '$.state', title: '状态', width: 140 },
];
const rows: SampleRow[] = Array.from({ length: 30 }, (_, index) => ({
    id: index,
    dataRef: { name: `项目任务 ${index + 1}`, owner: '设计团队', state: index % 2 ? '处理中' : '待处理' },
}));

export default function SizeShowcase() {
    const [size, setSize] = useState<ConfigSize>('small');
    return <div className={stackStyle}>
        <Segmented
            aria-label="界面尺寸"
            size="middle"
            value={size}
            options={[{ value: 'small', label: '紧凑' }, { value: 'middle', label: '标准' }, { value: 'large', label: '宽松' }]}
            onChange={value => { if (value === 'small' || value === 'middle' || value === 'large') setSize(value); }}
        />
        <ConfigProvider size={size} className={stackStyle} aria-label="尺寸演示区域">
            <Card title="任务筛选">
                <div className={stackStyle}>
                    <div className={fieldsStyle}>
                        <LineEdit label="任务名称" defaultValue="组件尺寸优化" allowClear />
                        <Select label="任务状态" defaultValue="pending" allowClear options={[{ value: 'pending', label: '待处理' }, { value: 'active', label: '处理中' }]} />
                        <NumberEdit aria-label="预计工时" defaultValue={8} min={0} />
                    </div>
                    <TextEdit aria-label="任务说明" placeholder="任务说明" rows={2} />
                    <div className={rowStyle}>
                        <Checkbox defaultChecked>仅显示我的任务</Checkbox>
                        <Radio name="size-demo-scope" defaultChecked>当前项目</Radio>
                        <Switch>自动刷新</Switch>
                        <Button>查询</Button>
                        <Button size="large" appearance="text">固定 large</Button>
                    </div>
                </div>
            </Card>
            <Tabs aria-label="任务视图" items={[{ key: 'all', label: '所有任务' }, { key: 'mine', label: '我的任务' }]} />
            <div className={tableStyle}>
                <AutoSizer>{({ width, height }) => <Table aria-label="尺寸演示表格" width={width} height={height} columns={columns} rows={rows} />}</AutoSizer>
            </div>
            <Pagination total={300} showQuickJumper />
            <Menu mode="horizontal" items={[{ type: MenuItemType.Item, key: 'overview', title: '项目概览' }, { type: MenuItemType.Item, key: 'activity', title: '活动记录' }]} />
            <ConfigProvider size="middle" className={rowStyle} aria-label="固定标准尺寸区域">
                <Button appearance="outlined">始终使用标准尺寸</Button>
            </ConfigProvider>
        </ConfigProvider>
    </div>;
}
