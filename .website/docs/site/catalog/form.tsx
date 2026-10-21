import { Box, Label, RequiredLabel } from "./shapes.js";

// Both static layouts use the same field roles as the live form. Coordinates
// describe a 320 × 208 illustration, scaled together by the SVG viewBox.
export default function FormPreview() {
    return <>
        <g className="cc-form-inline">
            <RequiredLabel x={24} y={50}>项目名称</RequiredLabel>
            <rect x={112} y={28} width={192} height={36} className="cc-form-field" />
            <text x={124} y={51} className="cc-label cc-form-value">Crab Design</text>
            <RequiredLabel x={24} y={102}>负责人</RequiredLabel>
            <rect x={112} y={80} width={192} height={36} className="cc-form-field" />
            <text x={124} y={103} className="cc-label cc-form-value">张林</text>
            <g className="cc-button-shape">
                <Box x={112} y={136} w={64} h={36} tone="brand" />
                <Label x={144} y={159} tone="on-brand">保存</Label>
            </g>
        </g>
        <g className="cc-form-outlined">
            <rect x={16} y={12} width={288} height={56} className="cc-form-field-background" />
            <path d="M28 12H20a4 4 0 0 0-4 4v48a4 4 0 0 0 4 4h280a4 4 0 0 0 4-4V16a4 4 0 0 0-4-4H96" className="cc-form-outline" />
            <RequiredLabel x={38} y={16}>项目名称</RequiredLabel>
            <text x={32} y={46} className="cc-label cc-form-value">Crab Design</text>
            <rect x={16} y={84} width={288} height={56} className="cc-form-field-background" />
            <path d="M28 84H20a4 4 0 0 0-4 4v48a4 4 0 0 0 4 4h280a4 4 0 0 0 4-4V88a4 4 0 0 0-4-4H84" className="cc-form-outline" />
            <RequiredLabel x={38} y={88}>负责人</RequiredLabel>
            <text x={32} y={118} className="cc-label cc-form-value">张林</text>
            <g className="cc-button-shape">
                <Box x={16} y={156} w={64} h={40} tone="brand" />
                <Label x={48} y={181} tone="on-brand">保存</Label>
            </g>
        </g>
    </>;
}
