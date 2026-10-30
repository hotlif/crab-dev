import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import SplitPane from '@crab-dev/rc-split-pane';

export const meta = {
    title: '分栏验收矩阵',
    description: '实际拖动、键盘步进、上下限及复位；水平和垂直分栏共用公开尺寸协议。',
};
const frame = css`
    width: 100%;
    min-width: 0;
    max-width: 800px;
    height: 300px;
    padding: ${token.space['component-gap']};
    box-sizing: border-box;
    color: ${token.color.text.primary};
    background: ${token.color.surface.content};
`;
const pane = css`
    height: 100%;
    box-sizing: border-box;
    overflow: auto;
    padding: ${token.space['component-gap']};
    border: 1px solid ${token.color.border.default};
    background: ${token.color.surface.content};
    overflow-wrap: anywhere;
`;
export default function VisualMatrixDemo() {
    const [mode, setMode] = useState('horizontal');
    return (
        <>
            <label>
                验收状态{' '}
                <select aria-label="验收状态" value={mode} onChange={(event) => setMode(event.target.value)}>
                    <option value="horizontal">水平</option>
                    <option value="vertical">垂直</option>
                    <option value="disabled">禁用</option>
                </select>
            </label>
            <section aria-label="SplitPane visual matrix" className={frame}>
                <SplitPane
                    aria-label="工作区分栏"
                    direction={mode === 'vertical' ? 'vertical' : 'horizontal'}
                    defaultSize={120}
                    min={64}
                    max={220}
                    disabled={mode === 'disabled'}
                >
                    <div className={pane}>
                        资源 Resource
                        <br />
                        长内容保持在面板内 / Content remains inside the pane.
                    </div>
                    <div className={pane}>
                        编辑区域 Editor
                        <br />
                        方向键调整 / Arrow keys resize
                    </div>
                </SplitPane>
            </section>
        </>
    );
}
