export const meta = {
    title: "基础用法",
    description: "点击输入框打开可视化面板;也可直接手输表达式,回车提交(非法输入会以 error 边框提示并在失焦时回退)",
};

import { useState } from 'react';
import CronPicker, { describeCron, parseCron } from '../../src/index.js';

const BasicDemo = () => {
    const [expression, setExpression] = useState('30 9 * * 1-5');
    const parsed = parseCron(expression);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 360 }}>
            <CronPicker defaultValue="30 9 * * 1-5" onChange={setExpression} />
            <div style={{ fontSize: 13, color: '#666' }}>
                当前值:<code>{expression}</code>
                {parsed ? ` —— ${describeCron(parsed)}` : null}
            </div>
        </div>
    );
};

export default BasicDemo;
