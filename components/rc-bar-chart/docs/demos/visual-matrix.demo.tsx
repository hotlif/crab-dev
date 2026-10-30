import { useState } from 'react';
import { css } from '@crab-dev/css';
import BarChart from '@crab-dev/rc-bar-chart';
import Button from '@crab-dev/rc-button';
import { useLocale } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';

export const meta = { title: '专业图表状态矩阵', description: '固定正负数据、真实图例切换、数据刷新与键盘柱焦点。动画保持自然播放，图表坐标独立于控件尺寸。' };
const sceneStyle = css`padding: ${token.space['card-padding']}; overflow: auto; max-inline-size: 100%; background: ${token.color.surface.content};`;
const stackStyle = css`display: flex; flex-direction: column; gap: ${token.space['stack-gap']}; min-inline-size: 0;`;
const rowStyle = css`display: flex; flex-wrap: wrap; align-items: center; gap: ${token.space['component-gap']};`;
const fixedStyle = css`inline-size: min(100%, 640px); min-inline-size: 240px;`;

export default function VisualMatrixDemo() {
    const { locale } = useLocale();
    const en = locale === 'en-US';
    const [mode, setMode] = useState('default');
    const [revision, setRevision] = useState(0);
    const [selection, setSelection] = useState('');
    const categories = en ? ['January', 'February', 'March', 'April'] : ['一月', '二月', '三月', '四月'];
    const longCategories = en ? ['January – enterprise services', 'February – international operations', 'March – recurring subscriptions', 'April – customer success'] : ['一月：企业级服务长期运营收入', '二月：国际市场拓展与合作', '三月：订阅续费与新增客户', '四月：客户成功支持服务'];
    const series = [
        { name: en ? 'Revenue' : '收入', data: revision % 2 ? [180, 70, 140, 105] : [120, 85, 160, 95] },
        { name: en ? 'Adjustments' : '调整', data: mode === 'negative' ? [-55, 30, -70, 40] : [55, 30, 70, 40] },
    ];
    return <div className={stackStyle}>
        <div className={rowStyle}>
            <label>验收状态 <select aria-label="验收状态" value={mode} onChange={event => setMode(event.target.value)}>
                {['default', 'empty', 'horizontal', 'stacked', 'negative', 'long-text'].map(value => <option key={value} value={value}>{value}</option>)}
            </select></label>
            <Button appearance="outlined" onClick={() => setRevision(value => value + 1)}>刷新数据</Button>
        </div>
        <section className={sceneStyle} aria-label="BarChart visual matrix" data-revision={revision}>
            <div className={fixedStyle}><BarChart width="auto" height={280} aria-label="Revenue chart"
                categories={mode === 'empty' ? [] : mode === 'long-text' ? longCategories : categories}
                series={series} orientation={mode === 'horizontal' ? 'horizontal' : 'vertical'} stacked={mode === 'stacked'} showValues
                referenceLines={[{ value: 110, label: en ? 'Target 110' : '目标 110' }]}
                onBarClick={value => setSelection(`${value.category} ${value.seriesName} ${value.value}`)} />
            </div>
            <output aria-label="已激活数据">{selection || (en ? 'No activation' : '尚未激活数据')}</output>
        </section>
    </div>;
}
