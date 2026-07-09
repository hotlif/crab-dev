/**
 * title = "受控模式"
 * description = "传入 value 与 onChange 由外部状态托管选中值。原始值可作为 options 简写。"
 */

import { useState } from 'react';
import Segmented, { type SegmentedValue } from '../../src/index.js';

const ControlledDemo = () => {
    const [value, setValue] = useState<SegmentedValue>('列表');

    return (
        <div>
            <Segmented options={['列表', '看板', '日历']} value={value} onChange={setValue} />
            <p>当前视图: {value}</p>
        </div>
    );
};

export default ControlledDemo;
