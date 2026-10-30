import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import ConfigProvider, { useConfig } from '@crab-dev/rc-config-provider';
import token from '@crab-dev/rc-token-semantic';
import { useState } from 'react';
import Notification from '@crab-dev/rc-notification';
import { useNotification, type NotificationHandle } from '@crab-dev/rc-notification';

export const meta = { title: '三体系展示与状态矩阵', description: '公开组件、真实交互与自然动画；包内视觉规格是矩阵轴的来源。' };
const frameStyle = css`
    box-sizing: border-box;
    display: grid;
    gap: ${token.space['group-gap']};
    padding: calc(${token.space['group-gap']} * 2);
    min-width: 0;
    color: ${token.color.text.primary};
    background-color: ${token.color.background.surface};
`;
const rowStyle = css`display: flex; flex-wrap: wrap; gap: ${token.space['component-gap']}; align-items: center; min-width: 0;`;
const sceneStyle = css`display: grid; min-width: 0; gap: ${token.space['stack-gap']};`;


export default function VisualMatrixDemo() {
    const { locale } = useConfig();
    const [longContent, setLongContent] = useState(false);
    const copy = (zh: string, en: string) => (locale === 'en-US' ? en : zh) + (longContent ? ' · abcdefghijklmnopqrstuvwxyz0123456789 · 长内容需要保留含义并适应可用宽度' : '');
    const [size, setSize] = useState('medium');
    const [density, setDensity] = useState<'compact' | 'standard' | 'comfortable'>('standard');
    const [state, setState] = useState('default');
    const [visible, setVisible] = useState(true);
    const [draft, setDraft] = useState('保留这份草稿');
    const [notification, contextHolder] = useNotification();
    const [handle, setHandle] = useState<NotificationHandle | null>(null);
    return <div>
        <div className={rowStyle}>
            <label>验收尺寸<select aria-label="验收尺寸" value={size} onChange={event => setSize(event.currentTarget.value)}><option>medium</option></select></label>
            <label>验收密度<select aria-label="验收密度" value={density} onChange={event => setDensity(event.currentTarget.value as typeof density)}><option>standard</option></select></label>
            <label>验收状态<select aria-label="验收状态" value={state} onChange={event => { const next = event.currentTarget.value; setState(next); setVisible(true); }}><option value="default">default</option><option value="hover">hover</option><option value="focus-visible">focus-visible</option><option value="pressed">pressed</option><option value="updated">updated</option><option value="closed">closed</option><option value="top">top</option><option value="topLeft">topLeft</option><option value="bottom">bottom</option><option value="bottomLeft">bottomLeft</option><option value="bottomRight">bottomRight</option></select></label>
            <Button onClick={() => setVisible(false)}>关闭展示</Button>
            <Button onClick={() => setHandle(notification.open({title: copy('浮层通知', 'Portal notification'), description: copy('持久展示，明确关闭。', 'Persistent until explicitly closed.'), duration: 0}))}>打开浮层</Button><Button onClick={() => handle?.update({description: copy('浮层已更新', 'Portal updated')})}>更新浮层</Button><Button onClick={() => handle?.close()}>关闭浮层</Button>{contextHolder}
        </div>
        <label><input type="checkbox" aria-label="长文本" checked={longContent} onChange={event => setLongContent(event.currentTarget.checked)} />长文本</label>
        <label>配置切换草稿<input aria-label="配置切换草稿" value={draft} onChange={event => setDraft(event.currentTarget.value)} /></label>
        <ConfigProvider size={size === 'small' || size === 'large' ? size : 'medium'} density={density}>
            <section className={frameStyle} aria-label="Notification visual matrix" data-visual-frame>
                <div className={sceneStyle} data-visual-scene data-size={size} data-density={density} data-state={state}>
                    <Notification data-visual-target open={visible} onOpenChange={setVisible} title={copy('工作区同步完成', 'Workspace synchronized')} duration={0} showProgress={false} direction={['top','topLeft','bottom','bottomLeft','bottomRight'].includes(state) ? state as 'top' | 'topLeft' | 'bottom' | 'bottomLeft' | 'bottomRight' : 'topRight'}>{state === 'updated' ? copy('记录已更新，草稿仍然保留。', 'Record updated; the draft is retained.') : copy('所有更改均已保存。可以继续处理下一组记录。', 'All changes are saved. Continue with the next group of records.')}</Notification>
                    
                </div>
            </section>
        </ConfigProvider>
    </div>;
}
