import { useState } from 'react';
import { css } from '@crab-dev/css';
import ConfigProvider from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import Button from '../../src/button.js';
import ButtonGroup from '../../src/buttonGroup.js';

export const meta = { title: 'macOS Tahoe：桌面控件与浮动玻璃操作', description: '普通操作使用圆角矩形；浮动工具栏共享玻璃背板，突出内容。' };
const frame = css`display: grid; gap: ${token.space['group-gap']}; padding: ${token.space['card-padding']}; color: ${token.color.text.primary}; background: ${token.color.surface.content}; border-radius: ${token.shape.card};`;
const row = css`display: flex; align-items: center; flex-wrap: wrap; gap: ${token.space['component-gap']};`;
const content = css`
    display: grid;
    gap: ${token.space['group-gap']};
    min-height: 180px;
    padding: ${token.space['card-padding']};
    border-radius: ${token.shape.card};
    background: linear-gradient(120deg, ${token.color.brand.container}, ${token.color.surface.content} 45%, ${token.color.secondary.container});
`;
const title = css`margin: 0; font-size: ${token.typography.title.medium['font-size']}; font-weight: ${token.typography.title.medium['font-weight']};`;

export default function MacosDemo() {
    const [selected, setSelected] = useState('列表');
    return <ConfigProvider designSystem="macos">
        <section className={frame} aria-label="macOS Tahoe controls">
            <h3 className={title}>桌面操作</h3>
            <div className={row}>
                <Button size="m" appearance="primary">保存</Button>
                <Button size="m">取消</Button>
                <Button size="m" appearance="tonal">共享</Button>
                <Button size="m" danger>删除</Button>
                <Button size="m" appearance="text">更多选项</Button>
            </div>
            <div className={content}>
                <h3 className={title}>项目资料</h3>
                <p>内容保持清晰，浮动操作在独立的玻璃层上。</p>
                <div className={row}>
                    <ButtonGroup variant="connected" size="m">
                        {['列表', '网格', '分栏'].map(label => <Button key={label} appearance="elevated" isSelected={selected === label} onClick={() => setSelected(label)}>{label}</Button>)}
                    </ButtonGroup>
                    <Button appearance="elevated" size="l">添加到收藏</Button>
                </div>
            </div>
        </section>
    </ConfigProvider>;
}
