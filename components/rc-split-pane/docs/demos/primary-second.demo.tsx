export const meta = {
    title: "定宽侧在后",
    description: "primary=second 时右侧面板定宽（编辑器右挂侧栏的典型布局），拖拽方向自动反转",
};

import { cx } from '@crab-dev/css';
import { frameStyle, paneStyle, sidebarStyle } from '../demo-style.js';
import SplitPane from '../../src/index.js';


const PrimarySecondDemo = () => (
    <div className={frameStyle}>
        <SplitPane primary="second" defaultSize={220} min={160} max={400}>
            <div className={paneStyle}>内容区 flex 填充</div>
            <div className={cx(paneStyle, sidebarStyle)}>右侧栏（220px 起）</div>
        </SplitPane>
    </div>
);

export default PrimarySecondDemo;
