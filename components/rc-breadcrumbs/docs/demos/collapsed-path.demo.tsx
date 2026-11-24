import { useState } from 'react';
import Breadcrumbs, { type BreadcrumbsItem } from '../../src/index.js';

export const meta = {
    title: '展开折叠路径',
    description: '在只保留两个位置时，通过省略项访问其他层级。用键盘试试展开、选择和返回。',
};

const paths = ['工程目录', '北区泵站', '进水系统', '长路径连续设备记录分组P104监测与交接', '巡检记录'];

export default function CollapsedPathDemo() {
    const [selected, setSelected] = useState(paths.at(-1));
    const items: BreadcrumbsItem[] = paths.map((title, index) => ({
        title,
        disabled: index === 2,
        ...(index === 0 ? { href: '#project' } : {}),
        onClick: event => {
            if (index === 0) event.preventDefault();
            setSelected(title);
        },
    }));
    return <>
        <Breadcrumbs aria-label="巡检路径" separator="/" ellipsis="…" maxCount={2} expandCollapsed items={items} />
        <p role="status">已访问 {selected}</p>
        <button type="button" onClick={() => setSelected(paths.at(-1))}>重置访问记录</button>
    </>;
}
