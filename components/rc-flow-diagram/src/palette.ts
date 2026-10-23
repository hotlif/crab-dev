import token from './token.js';

export interface FlowDiagramPalette {
    grid: string;
    nodeFill: string;
    nodeStroke: string;
    nodeLabel: string;
    edge: string;
}

/** 旧版固定配色；显式传入可保留原视觉。默认渲染使用语义主题。 */
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
        ? { ...SEMANTIC_FLOW_DIAGRAM_PALETTE, ...palette }
        : SEMANTIC_FLOW_DIAGRAM_PALETTE;
}
