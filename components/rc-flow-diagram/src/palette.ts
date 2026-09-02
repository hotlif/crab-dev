import token from './token.js';

export interface FlowDiagramPalette {
    grid: string;
    nodeFill: string;
    nodeStroke: string;
    nodeLabel: string;
    edge: string;
}

/** 与既有硬编码逐项一致；不传 palette 时保持原视觉。 */
export const DEFAULT_FLOW_DIAGRAM_PALETTE: FlowDiagramPalette = {
    grid: '#eceef3',
    nodeFill: 'oklch(0.60 0.14 256)',
    nodeStroke: 'transparent',
    nodeLabel: '#ffffff',
    edge: '#6b7280',
};

/** 通过 FlowDiagram 的 L3 token 对接当前语义主题。 */
export const SEMANTIC_FLOW_DIAGRAM_PALETTE: FlowDiagramPalette = {
    grid: token.palette.grid.color,
    nodeFill: token.palette.node['background-color'],
    nodeStroke: token.palette.node['border-color'],
    nodeLabel: token.palette.node.label.color,
    edge: token.palette.edge.color,
};

export function mergeFlowDiagramPalette(
    palette?: Partial<FlowDiagramPalette>,
): FlowDiagramPalette {
    return palette
        ? { ...DEFAULT_FLOW_DIAGRAM_PALETTE, ...palette }
        : DEFAULT_FLOW_DIAGRAM_PALETTE;
}
