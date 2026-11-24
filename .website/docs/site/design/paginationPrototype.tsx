import { useEffect, useRef, useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Pagination from "@crab-dev/rc-pagination";
import { NavigationPrototype } from "./navigationPrototype.js";

const initialPage = { page: 1, pageSize: 10, count: 91 };
const pageSizes = [10, 20, 50];
const devices = ["北区输水泵", "西区流量计", "进水调节阀", "循环泵监测终端"];
const entries = Array.from({ length: initialPage.count }, (_, index) => ({
    id: `R-${String(index + 1).padStart(3, "0")}`,
    name: devices[index % devices.length],
}));
const notes = {
    md3: "MD3 用着色圆形标出当前页，保留稳定的页码触达区域和结果反馈位置。",
    macos: "macOS 使用紧凑的箭头与页数选择器，分页区与巡检结果在同一表面上对齐。",
    shadcn: "shadcn/ui 用中性描边突出页码，加载反馈与结果数保持连续可见。",
};

export default function PaginationPrototype() {
    const { designSystem } = useConfig();
    const [request, setRequest] = useState(initialPage);
    const [current, setCurrent] = useState(initialPage);
    const status = useRef<HTMLParagraphElement>(null);
    const busy = request !== current;
    const lastPage = Math.max(1, Math.ceil(request.count / request.pageSize));
    const start = (current.page - 1) * current.pageSize;
    const rows = entries.slice(start, Math.min(current.count, start + current.pageSize));

    useEffect(() => {
        if (!busy) return;
        const timer = window.setTimeout(() => setCurrent(request), 650);
        return () => window.clearTimeout(timer);
    }, [busy, request]);

    return <NavigationPrototype route="pagination" title="Pagination 分页" scene="巡检结果列表"
        description="切换页码和每页条数，删除末页记录并核对页码修正。"
        note={notes[designSystem]} rules={[
            ["页码边界", "超过可见页位时折叠中间页码。首页和末页分别限制向前与向后操作。"],
            ["改变页大小", "从当前页第一条结果推算新页位置，减少重新定位的成本。"],
            ["加载与焦点", "加载中保留已有结果并给出提示。新的请求覆盖旧请求，分页操作保持键盘可用。"],
            ["末页删除", "删除最后一条导致当前页不存在时，切到最后一个有效页，并在提示区报告新的结果范围。"],
        ]}>
        <div className="crab-navigation-heading">
            <h3>泵站巡检</h3>
            <Button size="s" appearance="text" danger disabled={busy || request.page !== lastPage || request.count === 0}
                onClick={() => {
                    const count = request.count - 1;
                    status.current?.focus();
                    setRequest({ ...request, count, page: Math.min(request.page, Math.max(1, Math.ceil(count / request.pageSize))) });
                }}>删除末条记录</Button>
        </div>
        <p role="status" aria-atomic="true" ref={status} tabIndex={-1} className="crab-navigation-status" data-pagination-result>
            {busy ? "正在读取巡检结果…" : rows.length === 0 ? "没有巡检结果。" :
                `共 ${current.count} 条。第 ${current.page} 页，显示 ${start + 1}–${start + rows.length} 条。`}
        </p>
        <ul role="list" className="crab-navigation-list crab-navigation-results" aria-label="当前页结果" aria-busy={busy}>
            {rows.map(row => <li key={row.id}><span>{row.id}</span><strong>{row.name}</strong></li>)}
        </ul>
        <Pagination value={request.page} total={request.count} pageSize={request.pageSize}
            size={designSystem === "macos" ? "small" : "medium"} pageLabel={page => `第 ${page} 页`}
            showSizeChanger pageSizeOptions={pageSizes}
            onValueChange={(page, { pageSize, reason }) => {
                const desired = reason === "page-size" ? Math.floor(((request.page - 1) * request.pageSize) / pageSize) + 1 : page;
                const next = Math.min(desired, Math.max(1, Math.ceil(request.count / pageSize)));
                if (next !== request.page || pageSize !== request.pageSize) setRequest({ ...request, page: next, pageSize });
            }} />
    </NavigationPrototype>;
}
