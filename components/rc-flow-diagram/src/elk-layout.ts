// Keep ELK's implementation types behind the library's layout data contract.
import ELK from 'elkjs/lib/elk.bundled.js';
import type { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk-api.js';
import type { ElkLayoutNode, ElkLayoutEdge, ElkLayoutResult } from './hooks/useElkLayout.js';

let elkInstance: InstanceType<typeof ELK> | null = null;

export async function computeElkLayout(nodes: ElkLayoutNode[], edges: ElkLayoutEdge[], options?: Record<string, string>): Promise<ElkLayoutResult | null> {
    if (typeof window === 'undefined') return null;
    elkInstance ??= new ELK();
    const graph: ElkNode = {
        id: '__elk_root__',
        layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.direction': 'RIGHT',
            'elk.spacing.nodeNode': '40',
            'elk.layered.spacing.nodeNodeBetweenLayers': '60',
            ...options,
        },
        children: nodes.map(node => ({ id: node.id, width: node.width, height: node.height, ...(node.layoutOptions ? { layoutOptions: node.layoutOptions } : {}) })),
        edges: edges.map(edge => ({ id: edge.id, sources: [edge.source], targets: [edge.target], ...(edge.layoutOptions ? { layoutOptions: edge.layoutOptions } : {}) })) satisfies ElkExtendedEdge[],
    };
    const result = await elkInstance.layout(graph);
    const nodeMap: ElkLayoutResult['nodes'] = {};
    for (const child of result.children ?? []) {
        nodeMap[child.id] = { x: child.x ?? 0, y: child.y ?? 0, width: child.width ?? 0, height: child.height ?? 0 };
    }
    const edgeMap: ElkLayoutResult['edges'] = {};
    for (const edge of result.edges ?? []) {
        const points: Array<{ x: number; y: number }> = [];
        for (const section of edge.sections ?? []) {
            points.push(section.startPoint);
            points.push(...section.bendPoints ?? []);
            points.push(section.endPoint);
        }
        edgeMap[edge.id] = { points };
    }
    return { nodes: nodeMap, edges: edgeMap };
}
