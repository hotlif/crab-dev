export const meta = {
    title: "包裹内容",
    description: "传入 children 即笼罩该区域: 内容变淡并被 inert 阻断——鼠标点不到, 键盘 Tab 也进不去。",
};

import { css } from '@crab-dev/css';
import { useState } from 'react';
import Button from '@crab-dev/rc-button';
import Spin from '../../src/index.js';

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: 16px;
    max-width: 360px;
`;

const panelStyle = css`
    padding: 16px;
    border: 1px solid oklch(0.9 0.004 286);
    border-radius: 8px;
`;

const titleStyle = css`
    margin: 0 0 8px;
    font-size: 16px;
    font-weight: 600;
`;

const bodyStyle = css`
    margin: 0 0 12px;
    color: oklch(0.44 0.01 286);
    font-size: 14px;
`;

const WrapperDemo = () => {
    const [spinning, setSpinning] = useState(true);

    return (
        <div className={stackStyle}>
            <Button appearance="subtle" onClick={() => setSpinning((prev) => !prev)}>
                {spinning ? '结束加载' : '开始加载'}
            </Button>

            <Spin spinning={spinning} tip="正在保存">
                <div className={panelStyle}>
                    <h4 className={titleStyle}>草稿</h4>
                    <p className={bodyStyle}>
                        加载期间试着用 Tab 键聚焦下面的按钮 —— 焦点不会落进来。
                    </p>
                    <Button>提交</Button>
                </div>
            </Spin>
        </div>
    );
};

export default WrapperDemo;
