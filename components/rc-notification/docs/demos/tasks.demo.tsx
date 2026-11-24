import { css } from '@crab-dev/css';
import { useEffect, useRef } from 'react';
import Button from '@crab-dev/rc-button';
import { useNotification } from '../../src/index.js';

export const meta = {
    title: '后台任务与焦点',
    description: '启动后台任务，保留当前任务的焦点，也可在列表中切换、重试或查看结果。',
};

const actions = css`display: flex; flex-wrap: wrap; gap: 0.5rem;`;
const names = ['索引同步', '导出清单', '仪表刷新', '巡检日志'];

export default function TaskNotifications() {
    const [notice, holder] = useNotification({ mode: 'tasks' });
    const delayed = useRef<ReturnType<typeof setTimeout>>(undefined);
    useEffect(() => () => clearTimeout(delayed.current), []);
    const open = (index: number, complete = false) => notice.open({
        taskKey: String(index),
        title: names[index],
        direction: 'bottomRight',
        description: complete ? '任务已完成' : <Button size="s" appearance="text"
            onClick={() => { open(index, true); }}>{index === 0 ? '重试同步' : '查看结果'}</Button>,
    });
    return <div className={actions}>
        <Button onClick={() => { open(0); }}>启动索引同步</Button>
        <Button appearance="outlined" onClick={() => {
            clearTimeout(delayed.current);
            delayed.current = setTimeout(() => { open(1); open(2); open(3); }, 500);
        }}>加载其他任务</Button>
        {holder}
    </div>;
}
