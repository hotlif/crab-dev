export const meta = {
    title: "定宽侧在后",
    description: "primary=second 时右侧面板定宽（编辑器右挂侧栏的典型布局），拖拽方向自动反转",
};

import type { CSSProperties } from 'react';
import SplitPane from '../../src/index.js';

const paneStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    fontSize: 13,
    color: '#666',
};

const PrimarySecondDemo = () => (
    <div style={{ height: 160, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
        <SplitPane primary="second" defaultSize={220} min={160} max={400}>
            <div style={paneStyle}>内容区 flex 填充</div>
            <div style={{ ...paneStyle, background: '#f8faff' }}>右侧栏（220px 起）</div>
        </SplitPane>
    </div>
);

export default PrimarySecondDemo;
