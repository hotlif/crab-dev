import { useConfig } from "@crab-dev/rc-config-provider";
import { Box, Check, Label, Line } from "./shapes.js";

// Noninteractive catalog illustrations, not component implementations. These
// silhouettes explain the active design; live behavior is shown on the page.
export default function DesignPreview({ name }: { readonly name: string }) {
    const { designSystem } = useConfig();
    const material = designSystem === "md3";
    const desktop = designSystem === "macos";
    if (name === "rc-slider") return <>
        <Box x={32} y={material ? 71 : 76} w={material ? 98 : 106} h={material ? 16 : 6} r={3} tone="brand" />
        <Box x={material ? 146 : 138} y={material ? 71 : 76} w={material ? 62 : 70} h={material ? 16 : 6} r={3} tone="soft" />
        {material ? <Box x={136} y={57} w={4} h={44} r={2} tone="brand" />
            : desktop ? <Box x={132} y={67} w={12} h={24} r={6} />
                : <circle cx={138} cy={79} r={9} className="cc-surface cc-stroke cc-border" />}
        <Label x={138} y={48} tone="brand">60%</Label><Label x={32} y={112}>0</Label><Label x={204} y={112}>100</Label>
    </>;
    if (name === "rc-switch") return <>{[true, false].map((checked, index) => {
        const y = 33 + index * 55;
        const height = material ? 32 : 24;
        const width = material ? 52 : 42;
        const radius = material ? checked ? 12 : 8 : 9;
        return <g key={index}>
            <Box x={54} y={y} w={width} h={height} r={height / 2} tone={checked ? "brand" : "soft"} />
            <circle cx={54 + (checked ? width - height / 2 : height / 2)} cy={y + height / 2} r={radius} className={checked ? "cc-on-brand" : "cc-muted"} />
            {material && checked && <Check x={84} y={y + height / 2} tone="brand" />}
            <Label x={121} y={y + height / 2 + 5} anchor="start">{checked ? "已开启" : "已关闭"}</Label>
        </g>;
    })}</>;
    if (name === "rc-segmented") return <>
        <Box x={24} y={57} w={192} h={40} r={material ? 20 : 7} tone={material ? "surface" : "soft"} />
        <Box x={material ? 25 : 28} y={material ? 58 : 61} w={62} h={material ? 38 : 32} r={material ? 19 : 5} tone={material ? "soft" : "surface"} />
        {material && <Check x={34} y={77} tone="text" />}
        {["列表", "看板", "日历"].map((label, i) => <Label key={label} x={62 + i * 61} y={82}>{label}</Label>)}
    </>;
    if (name === "rc-tabs") return <>
        <Box x={29} y={32} w={182} h={97} />
        {!material && <><Box x={33} y={36} w={174} h={30} tone="soft" r={6} /><Box x={37} y={39} w={54} h={24} r={4} /></>}
        <Label x={64} y={56} tone={material ? "brand" : "text"}>概览</Label><Label x={120} y={56}>成员</Label><Label x={176} y={56}>设置</Label>
        {material && <><path d="M29 66h182" className="cc-stroke cc-border" /><path d="M45 66h38" className="cc-stroke cc-brand cc-thick" /></>}
        <Line x={48} y={87} w={136} /><Line x={48} y={104} w={98} />
    </>;
    return null;
}
