export const meta = {
    title: "撑满容器",
    description: "设置 `block` 让控制器铺满父容器, 各选项等宽分布。",
};

import { css } from '@crab-dev/css';
import Segmented from '../../src/index.js';

const containerStyle = css`
    width: 360px;
`;

const BlockDemo = () => {
    return (
        <div className={containerStyle}>
            <Segmented
                block
                options={[
                    { label: '全部', value: 'all' },
                    { label: '进行中', value: 'active' },
                    { label: '已完成', value: 'done' },
                ]}
            />
        </div>
    );
};

export default BlockDemo;
