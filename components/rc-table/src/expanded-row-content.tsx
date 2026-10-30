import { type ReactNode, useEffect, useRef } from "react";

import { expandContentStyle } from "./table.styles.js";

export default function ExpandedRowContent({ width, colSpan, direction, children }: { width: number; colSpan: number; direction: 'ltr' | 'rtl'; children: ReactNode }) {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = ref.current;
        /* istanbul ignore if -- ref 挂载后必有值 */
        if (!el) return;
        const onWheel = (e: WheelEvent) => {
            // 按住 Shift 表示横向滚动意图，始终交给表格（面板随表格一起横向滚动）
            if (e.shiftKey) return;
            if (el.scrollHeight <= el.clientHeight) return;
            const atTop = el.scrollTop <= 0;
            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
            if ((e.deltaY < 0 && !atTop) || (e.deltaY > 0 && !atBottom)) {
                e.stopPropagation();
            }
        };
        el.addEventListener("wheel", onWheel, { passive: false });
        return () => el.removeEventListener("wheel", onWheel);
    }, []);
    return (
        <div ref={ref} dir={direction} className={expandContentStyle} style={{ width }} role="gridcell" aria-colspan={colSpan}>
            {children}
        </div>
    );
}

