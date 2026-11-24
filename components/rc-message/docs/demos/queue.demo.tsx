import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import { useMessage } from '../../src/index.js';

export const meta = {
    title: '顺序队列与合并反馈',
    description: '先保存，接着复制，再保存。重复保存合并次数，复制反馈等保存关闭后显示。',
};

const actions = css`display: flex; flex-wrap: wrap; gap: 0.5rem; padding-block-start: 5rem;`;

export default function MessageQueueDemo() {
    const [message, holder] = useMessage({ mode: 'queue' });
    return <div className={actions}>
        <Button onClick={() => { message.open({ type: 'success', content: '巡检记录已保存', duration: 4500, mergeKey: 'save' }); }}>保存巡检记录</Button>
        <Button appearance="outlined" onClick={() => { message.info('记录编号已复制', 2400); }}>复制编号</Button>
        {holder}
    </div>;
}
