import { useId, useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import ConfigProvider, { type ConfigSize, type ConfigTheme } from '@crab-dev/rc-config-provider';
import Button from '@crab-dev/rc-button';
import Card from '@crab-dev/rc-card';
import Checkbox from '@crab-dev/rc-checkbox';
import LineEdit from '@crab-dev/rc-line-edit';
import Select from '@crab-dev/rc-select';
import Switch from '@crab-dev/rc-switch';
import Tabs from '@crab-dev/rc-tabs';
import Alert from '@crab-dev/rc-alert';

const stackStyle = css`
    display: grid;
    gap: ${token.space['section-gap']};
    min-width: 0;
`;
const rowStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${token.space['component-gap']};
    min-width: 0;
`;
const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, 20rem), 1fr));
    gap: ${token.space['section-gap']};
    min-width: 0;
`;
const panelStyle = css`
    display: grid;
    gap: ${token.space['section-gap']};
    min-width: 0;
    padding: ${token.space['section-gap']};
    color: ${token.color.text.primary};
    background: ${token.color.background.surface};
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.radius.lg};
    font-size: ${token.font.size.body};
    line-height: ${token.font['line-height'].body};
    overflow-wrap: anywhere;
`;
const noteStyle = css`
    margin: 0;
    color: ${token.color.text.secondary};
    font-size: ${token.font.size.caption};
`;
const fieldStyle = css`
    display: grid;
    gap: ${token.space['component-gap']};
    min-width: 0;
`;
const fullWidthStyle = css`
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
`;

function Preview({ mode, size }: { mode: ConfigTheme; size: ConfigSize }) {
    const fieldId = useId();
    return (
        <ConfigProvider theme={mode} size={size}>
            <section className={panelStyle} aria-label={mode === 'light' ? '浅色品牌预览' : '暗黑品牌预览'}>
                <strong>{mode === 'light' ? '浅色 Light' : '暗黑 Dark'}</strong>
                <div className={rowStyle}>
                    <Button appearance="primary">主要操作</Button>
                    <Button appearance="subtle">次要操作</Button>
                    <Button appearance="primary" disabled>禁用</Button>
                </div>
                <div className={fieldStyle}>
                    <label htmlFor={fieldId}>项目名称</label>
                    <LineEdit id={fieldId} className={fullWidthStyle} size={size} placeholder="聚焦查看品牌色边框" />
                    <Select size={size} aria-label="项目状态" defaultValue="active" options={[
                        { value: 'active', label: '进行中' },
                        { value: 'draft', label: '草稿' },
                        { value: 'done', label: '已完成' },
                    ]} />
                </div>
                <div className={rowStyle}>
                    <Checkbox defaultChecked size={size}>选中</Checkbox>
                    <Switch defaultChecked size={size}>开启</Switch>
                    <Switch size={size}>关闭</Switch>
                </div>
                <Tabs aria-label="品牌导航" items={[
                    { key: 'overview', label: '概览', children: <p className={noteStyle}>选中标记、链接与焦点一起跟随品牌色。</p> },
                    { key: 'details', label: '详情', children: <p className={noteStyle}>中性背景与内容分隔保持独立。</p> },
                ]} />
                <Card variant="elevated" title="浮层卡片" size="small" hoverable>
                    <p className={noteStyle}>通过背景、弱边框和投影表达层次，悬停查看过渡。</p>
                </Card>
                <Alert type="success">保存成功：反馈色保持语义独立。</Alert>
                <ConfigProvider brandColor={null}>
                    <div className={rowStyle}>
                        <Button appearance="primary" size="small">局部默认紫色</Button>
                        <span className={noteStyle}>brandColor=null</span>
                    </div>
                </ConfigProvider>
            </section>
        </ConfigProvider>
    );
}

export default function Example() {
    const [draft, setDraft] = useState('#1677ff');
    const [brandColor, setBrandColor] = useState('#1677ff');
    const [size, setSize] = useState<ConfigSize>('middle');
    const inputId = useId();
    const hintId = useId();
    const valid = /^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(draft.trim());
    const update = (value: string) => {
        setDraft(value);
        if (/^#(?:[\da-f]{3}|[\da-f]{6})$/i.test(value.trim())) setBrandColor(value.trim());
    };
    return (
        <div className={stackStyle}>
            <div className={fieldStyle}>
                <label htmlFor={inputId}>品牌色</label>
                <LineEdit id={inputId} value={draft} onChange={event => update(event.target.value)}
                    aria-describedby={hintId} status={valid ? undefined : 'error'} spellCheck={false} />
                <p id={hintId} className={noteStyle}>
                    {valid ? '输入 #RGB 或 #RRGGBB，自动生成浅色与暗黑配色；亮度会为可读性调整。' : '请输入有效的 #RGB 或 #RRGGBB；预览保留上一个有效颜色。'}
                </p>
            </div>
            <div className={rowStyle} role="group" aria-label="预设品牌色">
                {[
                    ['蓝色', '#1677ff'], ['绿色', '#15803d'], ['橙色', '#ea580c'], ['紫色', '#6750a4'],
                ].map(([label, color]) => <Button key={color} isSelected={brandColor.toLowerCase() === color} onClick={() => update(color)}>{label}</Button>)}
            </div>
            <div className={rowStyle} role="group" aria-label="对比控件尺寸">
                {(['small', 'middle', 'large'] as const).map(value => (
                    <Button key={value} isSelected={size === value} onClick={() => setSize(value)}>{value}</Button>
                ))}
            </div>
            <ConfigProvider brandColor={brandColor}>
                <div className={gridStyle}>
                    <Preview mode="light" size={size} />
                    <Preview mode="dark" size={size} />
                </div>
            </ConfigProvider>
        </div>
    );
}
