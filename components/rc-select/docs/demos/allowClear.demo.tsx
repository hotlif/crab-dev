export const meta = {
    title: "可清除",
    description: "设置 allowClear 可清空已选值；可切换主题，对比三种尺寸和两种外观",
    group: "数据录入",
    component: "Select 选择器",
    order: 20,
};

import Select from '../../src/index.js';
import Button from '@crab-dev/rc-button';
import ConfigProvider from '@crab-dev/rc-config-provider';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import { useState } from 'react';

const previewStyle = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['section-gap']};
    width: calc(${token.size[64]} * 9);
    max-width: 100%;
    box-sizing: border-box;
    padding: ${token.space['section-gap']};
    background: ${token.color.surface.content};
    color: ${token.color.text.primary};
    & > button { align-self: flex-start; }
`;

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.size[64]} * 4)), 1fr));
    gap: ${token.space['section-gap']};
`;

const options = [
    { label: '北京', value: 'beijing' },
    { label: '上海', value: 'shanghai' },
    { label: '广州', value: 'guangzhou' },
    { label: '深圳', value: 'shenzhen' },
];

const AllowClearDemo = () => {
    const [theme, setTheme] = useState<'light' | 'dark'>('light');

    return (
        <ConfigProvider theme={theme} className={previewStyle}>
            <Button appearance="outlined" size="small" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                切换为{theme === 'light' ? '深色' : '浅色'}
            </Button>
            <div className={gridStyle}>
                {(['small', 'middle', 'large'] as const).map(size =>
                    (['outlined', 'filled'] as const).map(appearance => <Select
                        key={`${size}-${appearance}`}
                        label={`${size} · ${appearance === 'outlined' ? '描边' : '填充'}`}
                        size={size}
                        appearance={appearance}
                        allowClear
                        defaultValue="beijing"
                        options={options}
                        placeholder="请选择城市"
                    />),
                )}
            </div>
        </ConfigProvider>
    );
};

export default AllowClearDemo;
