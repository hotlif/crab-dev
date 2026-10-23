export const meta = {
    title: "上下分栏",
    description: "direction=vertical 时拖动调整上方面板高度，适合主区 + 控制台的布局",
};

import { cx } from '@crab-dev/css';
import { frameStyle, paneStyle, consoleStyle, tallFrameStyle } from '../demo-style.js';
import SplitPane from '../../src/index.js';


const VerticalDemo = () => (
    <div className={cx(frameStyle, tallFrameStyle)}>
        <SplitPane direction="vertical" defaultSize={120} min={60} max={180}>
            <div className={paneStyle}>主区</div>
            <div className={cx(paneStyle, consoleStyle)}>控制台</div>
        </SplitPane>
    </div>
);

export default VerticalDemo;
