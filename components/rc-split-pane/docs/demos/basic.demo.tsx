export const meta = {
    title: "基础用法",
    description: "左右分栏，拖动分隔条调整左侧宽度；双击分隔条复位到 defaultSize",
};

import { cx } from '@crab-dev/css';
import { frameStyle, paneStyle, sidebarStyle } from '../demo-style.js';
import SplitPane from '../../src/index.js';


const BasicDemo = () => (
    <div className={frameStyle}>
        <SplitPane defaultSize={200} min={120} max={360}>
            <div className={cx(paneStyle, sidebarStyle)}>左侧（200px 起，120~360）</div>
            <div className={paneStyle}>右侧 flex 填充</div>
        </SplitPane>
    </div>
);

export default BasicDemo;
