import { useState } from "react";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import Divider from "@crab-dev/rc-divider";
import LineEdit from "@crab-dev/rc-line-edit";
import { LayoutPrototype } from "./layoutPrototype.js";

const notes = {
    md3: "MD3 使用低对比实线配合留白建立分区。带标题的分隔线用于侧重清晰的信息层级。",
    macos: "macOS 紧凑横向工具栏使用细竖线，列表行分隔保持安静，留白随操作密度收紧。",
    shadcn: "shadcn/ui 用中性细线组织同一表面下的内容，文字和控件承担核心视觉层级。",
};

export default function DividerPrototype() {
    const { designSystem } = useConfig();
    const [spaced, setSpaced] = useState(false);
    const [reviewed, setReviewed] = useState(false);
    const [flagged, setFlagged] = useState(false);
    const spacing = spaced ? "large" : "small";
    const size = designSystem === "macos" ? "small" : "medium";
    return <LayoutPrototype route="divider" title="Divider 分隔线" scene="巡检工作区分隔"
        description="比较工具栏、状态列表和设置分区，观察留白、语义和强制颜色表现。"
        note={notes[designSystem]} rules={[
            ["竖向", "工具栏用短线分隔处理动作和标记动作。已有组名时用装饰分隔。"],
            ["横向", "紧凑列表用小间距细线。相邻设置区采用更宽留白与可读标题。"],
            ["语义", "信息边界需要语义时使用 separator。仅加强已有分组时用装饰线，读屏按原内容顺序浏览。"],
            ["强制颜色", "线色使用系统边界颜色，仍可通过留白、标题与状态文字识别各组。"],
        ]}>
        <Button appearance="outlined" size="s" aria-pressed={spaced}
            onClick={() => setSpaced(!spaced)}>扩大分隔留白</Button>
        <section className="crab-layout-detail" aria-label="工具栏分隔">
            <h3>记录工具栏</h3>
            <div className="crab-layout-actions" role="group" aria-label="处理与标记">
                <Button size="s" appearance={reviewed ? "tonal" : "text"} aria-pressed={reviewed}
                    onClick={() => setReviewed(!reviewed)}>已复核</Button>
                <Divider direction="vertical" decorative spacing={spaced ? "medium" : "small"} />
                <Button size="s" appearance={flagged ? "tonal" : "text"} aria-pressed={flagged}
                    onClick={() => setFlagged(!flagged)}>待跟进</Button>
            </div>
        </section>
        <section className="crab-layout-detail" aria-label="列表分隔">
            <h3>设备状态</h3>
            <p>北区输水泵 · {reviewed ? "已复核" : "待复核"}</p>
            <Divider decorative spacing={spacing} />
            <p>进水调节阀 · {flagged ? "待跟进" : "运行正常"}</p>
        </section>
        <section className="crab-layout-detail" aria-label="配置分区">
            <h3>运行配置</h3>
            <LineEdit label="采样编号" appearance="outlined" size={size} value="P-104" readOnly />
            <Divider aria-label="采样设置和审计备注之间的分隔" spacing={spacing} />
            <LineEdit label="审计备注" appearance="outlined" size={size} defaultValue="下一班复查入口压差" />
            <Divider textAlign="start" spacing={spacing} variant={designSystem === "shadcn" ? "dashed" : "solid"}>更多运行信息</Divider>
            <p>设备记录保留本季度的巡检历史。</p>
        </section>
    </LayoutPrototype>;
}
