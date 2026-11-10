import type { ElkLayoutNode, ElkLayoutEdge, ElkLayoutResult } from './hooks/useElkLayout.js';

/** 显式计算布局，不改变视口。ELK 实现与第三方声明均留在公共契约后方。 */
export async function computeFlowLayout(nodes: ElkLayoutNode[], edges: ElkLayoutEdge[], options?: Record<string, string>): Promise<ElkLayoutResult | null> {
    const { computeElkLayout } = await import('./elk-layout.js');
    return computeElkLayout(nodes, edges, options);
}
