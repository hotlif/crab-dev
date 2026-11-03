import { useEffect, useRef, useState } from 'react';
import Dialog from '@crab-dev/rc-dialog';
import Button from '@crab-dev/rc-button';

export const meta = { title: '连续开关与草稿保留', description: '在退出过程中重新打开，检查画面、草稿和焦点是否连续。系统减少动画时直接呈现状态。' };

export default function MotionDemo() {
    const [open, setOpen] = useState(false);
    const [draft, setDraft] = useState('保留这份草稿');
    // Mutable instance: cancel the demonstration's pending reopen on unmount.
    const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
    useEffect(() => () => clearTimeout(timer.current), []);
    return <>
        <Button onClick={() => setOpen(true)}>打开连续性演示</Button>
        <Dialog title="动效连续性" open={open} onOpenChange={setOpen} shouldResetContent={false}>
            <label>草稿 <input aria-label="连续性草稿" value={draft} onChange={event => setDraft(event.target.value)} /></label>
            <p>点击下方按钮，面板会在关闭后 80ms 重新打开。</p>
            <Button onClick={() => {
                clearTimeout(timer.current);
                setOpen(false);
                timer.current = setTimeout(() => setOpen(true), 80);
            }}>关闭后立即重开</Button>
        </Dialog>
    </>;
}
