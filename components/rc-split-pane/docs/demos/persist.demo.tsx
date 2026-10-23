export const meta = {
    title: "记住尺寸与键盘调整",
    description: "persistKey 记住用户调整（刷新页面后仍生效）；Tab 聚焦分隔条后可用方向键步进、Home/End 到边界、Enter 复位",
};

import { useState } from 'react';
import { cx } from '@crab-dev/css';
import { frameStyle, paneStyle, sidebarStyle } from '../demo-style.js';
import SplitPane from '../../src/index.js';


const PersistDemo = () => {
    const [size, setSize] = useState<number | null>(null);

    return (
        <div className={frameStyle}>
            <SplitPane
                defaultSize={200}
                min={120}
                max={400}
                step={24}
                persistKey="rc-split-pane-demo"
                onSizeChange={setSize}
            >
                <div className={cx(paneStyle, sidebarStyle)}>
                    {size === null ? '拖我，然后刷新页面' : `${Math.round(size)}px`}
                </div>
                <div className={paneStyle}>右侧 flex 填充</div>
            </SplitPane>
        </div>
    );
};

export default PersistDemo;
