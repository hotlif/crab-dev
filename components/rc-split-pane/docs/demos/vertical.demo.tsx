/**
 * title = "上下分栏"
 * description = "direction=vertical 时拖动调整上方面板高度，适合主区 + 控制台的布局"
 */

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

const VerticalDemo = () => (
    <div style={{ height: 220, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
        <SplitPane direction="vertical" defaultSize={120} min={60} max={180}>
            <div style={paneStyle}>主区</div>
            <div style={{ ...paneStyle, background: '#1e293b', color: '#94a3b8' }}>控制台</div>
        </SplitPane>
    </div>
);

export default VerticalDemo;
