export const meta = {
    title: "基础用法",
    description: "点击输入框打开可视化面板;也可直接手输表达式,回车提交(非法输入会以 error 边框提示并在失焦时回退)",
};

import { useState } from 'react';
import { css } from '@crab-dev/css';
import token from '@crab-dev/rc-token-semantic';
import CronPicker, { describeCron, parseCron } from '../../src/index.js';

const layout = css`
    display: flex;
    flex-direction: column;
    gap: ${token.space['component-gap']};
    max-width: 360px;
`;
const description = css`
    font-size: ${token.typography.body.medium['font-size']};
    color: ${token.color.text.secondary};
`;

const BasicDemo = () => {
    const [expression, setExpression] = useState('30 9 * * 1-5');
    const parsed = parseCron(expression);

    return (
        <div className={layout}>
            <CronPicker label="执行计划" supportingText="输入五段式表达式，或在面板中设置执行时间。" defaultValue="30 9 * * 1-5" onChange={setExpression} />
            <div className={description}>
                当前值:<code>{expression}</code>
                {parsed ? ` —— ${describeCron(parsed)}` : null}
            </div>
        </div>
    );
};

export default BasicDemo;
