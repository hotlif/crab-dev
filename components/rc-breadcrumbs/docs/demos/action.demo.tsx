import { useState } from 'react';
import Breadcrumbs from '../../src/index.js';

export const meta = {
    title: '按钮式路径操作',
    description: '不提供 href 时，上级路径使用原生按钮语义，支持键盘激活。',
};

export default function ActionDemo() {
    const [count, setCount] = useState(0);
    return (
        <div>
            <Breadcrumbs items={[
                { title: '返回项目', onClick: () => setCount(count + 1) },
                { title: '不可用路径', disabled: true, onClick: () => setCount(count + 1) },
                { title: '当前页面' },
            ]} />
            <p role="status">返回次数：{count}</p>
        </div>
    );
}
