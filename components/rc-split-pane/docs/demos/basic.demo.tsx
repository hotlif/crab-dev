/**
 * title = "基础用法"
 * description = "左右分栏，拖动分隔条调整左侧宽度；双击分隔条复位到 defaultSize"
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

const BasicDemo = () => (
    <div style={{ height: 160, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
        <SplitPane defaultSize={200} min={120} max={360}>
            <div style={{ ...paneStyle, background: '#fafafa' }}>左侧（200px 起，120~360）</div>
            <div style={paneStyle}>右侧 flex 填充</div>
        </SplitPane>
    </div>
);

export default BasicDemo;
