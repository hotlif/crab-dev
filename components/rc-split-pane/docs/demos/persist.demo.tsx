/**
 * title = "记住尺寸与键盘调整"
 * description = "persistKey 记住用户调整（刷新页面后仍生效）；Tab 聚焦分隔条后可用方向键步进、Home/End 到边界、Enter 复位"
 */

import { useState } from 'react';
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

const PersistDemo = () => {
    const [size, setSize] = useState<number | null>(null);

    return (
        <div style={{ height: 160, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
            <SplitPane
                defaultSize={200}
                min={120}
                max={400}
                step={24}
                persistKey="rc-split-pane-demo"
                onSizeChange={setSize}
            >
                <div style={{ ...paneStyle, background: '#fafafa' }}>
                    {size === null ? '拖我，然后刷新页面' : `${Math.round(size)}px`}
                </div>
                <div style={paneStyle}>右侧 flex 填充</div>
            </SplitPane>
        </div>
    );
};

export default PersistDemo;
