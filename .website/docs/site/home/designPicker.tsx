import { use, useId } from "react";
import Segmented from "@crab-dev/rc-segmented";
import { DocumentDesignContext, isSiteDesign, SITE_DESIGNS } from "../siteContext.js";

const labels = { md3: "MD3", macos: "macOS", shadcn: "shadcn" };
const descriptions = {
    md3: "色调层次，灵动形状。",
    macos: "细腻层次，自然反馈。",
    shadcn: "清晰描边，简洁表达。",
};

export default function HomeDesignPicker() {
    const { design, setDesign } = use(DocumentDesignContext);
    const id = useId();
    return <div className="crab-home-design-picker">
        <span className="crab-home-design-label" id={id}>选择文档主题</span>
        <Segmented size="small" aria-label="首页设计体系" aria-describedby={id}
            options={SITE_DESIGNS.map(value => ({ value, label: labels[value] }))}
            value={design} onValueChange={value => { if (isSiteDesign(value)) setDesign(value); }} />
        <p className="crab-home-design-description" aria-live="polite">{descriptions[design]}</p>
    </div>;
}
