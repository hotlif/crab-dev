import { useEffect, useEffectEvent, useRef, type KeyboardEvent, type ReactNode, type SyntheticEvent } from 'react';

/** 短暂提交只拦截修改，不改变字段外观、焦点或滚动位置。 */
export default function BusyRegion({ busy, className, children }: { busy: boolean; className?: string; children: ReactNode }) {
    // 可变实例状态：在浏览器写入输入内容前拦截输入法、粘贴等原生编辑事件。
    const root = useRef<HTMLDivElement>(null);
    const beforeInput = useEffectEvent((event: Event) => {
        if (busy) { event.preventDefault(); event.stopPropagation(); }
    });
    useEffect(() => {
        const node = root.current;
        if (!node) return;
        const onBeforeInput = (event: Event) => beforeInput(event);
        node.addEventListener('beforeinput', onBeforeInput, true);
        return () => {
            node.removeEventListener('beforeinput', onBeforeInput, true);
        };
    }, []);
    function guard(event: SyntheticEvent) {
        if (busy) { event.preventDefault(); event.stopPropagation(); }
    }
    function pointer(event: SyntheticEvent) {
        // 滚动槽不是编辑控件；等待期间仍允许拖动面板滚动条。
        if (event.target instanceof Element && event.target.closest('input, textarea, button, [role="combobox"], [role="treeitem"], [role="option"], [role="slider"], [role="checkbox"]')) guard(event);
    }
    function keyDown(event: KeyboardEvent) {
        // 等待期间仍可切换焦点和复制内容，其余按键不能触发字段或对象修改。
        const textInput = event.target instanceof HTMLInputElement || event.target instanceof HTMLTextAreaElement;
        if (event.key === 'Tab' || textInput && (event.ctrlKey || event.metaKey) && ['a', 'c'].includes(event.key.toLowerCase())) return;
        guard(event);
    }
    return <div ref={root} className={className} aria-busy={busy}
        onPointerDownCapture={pointer} onPointerUpCapture={pointer} onClickCapture={guard}
        onWheelCapture={event => { if (busy) event.stopPropagation(); }}
        onKeyDownCapture={keyDown} onBeforeInputCapture={guard} onInputCapture={guard} onChangeCapture={guard}>
        {children}
    </div>;
}
