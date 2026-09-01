export const meta = {
    title: "禁用状态",
    description: "整体 `disabled` 或对单个选项设 `disabled`, 键盘方向键会自动跳过禁用项。",
};

import { css } from '@crab-dev/css';
import Segmented from '../../src/index.js';

const stackStyle = css`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
`;

const DisabledDemo = () => {
    return (
        <div className={stackStyle}>
            <Segmented
                options={[
                    { label: '日', value: 'day' },
                    { label: '周', value: 'week', disabled: true },
                    { label: '月', value: 'month' },
                ]}
            />
            <Segmented disabled options={['日', '周', '月']} defaultValue="周" />
        </div>
    );
};

export default DisabledDemo;
