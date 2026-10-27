import { useEffect, useState } from 'react';
import { computeElkLayout } from '../elk-layout.js';

/** 传入节点描述：必须提供稳定的 id 与明确的宽高（world px）。 */
export interface ElkLayoutNode {
    id: string;
    width: number;
    height: number;
    /** 节点级 ELK 布局选项，会覆盖全局 options */
    layoutOptions?: Record<string, string>;
}

/** 传入边描述：source / target 对应节点 id。 */
export interface ElkLayoutEdge {
    id: string;
    source: string;
    target: string;
    /** 边级 ELK 布局选项 */
    layoutOptions?: Record<string, string>;
}

/** useElkLayout 返回的计算结果。 */
export interface ElkLayoutResult {
    /** 每个节点的坐标与尺寸，key 为节点 id */
    nodes: Record<string, { x: number; y: number; width: number; height: number }>;
    /**
     * 每个边的路由折点序列（含起点和终点），key 为边 id。
     * 坐标相对于根图（world 坐标）。
     *
     * 使用示例：
     *   const pts = layout.edges['e1'].points;
     *   <Edge x1={pts[0].x} y1={pts[0].y} x2={pts.at(-1)!.x} y2={pts.at(-1)!.y} />
     */
    edges: Record<string, { points: Array<{ x: number; y: number }> }>;
}

export interface UseElkLayoutResult {
    layout: ElkLayoutResult | null;
    loading: boolean;
    error: Error | null;
}

/**
 * 使用 ELK.js 异步计算节点图布局。
 *
 * - 节点/边数据变化时自动重新布局（以 JSON 序列化内容作为依赖 key）。
 * - 布局结果异步计算；计算中 loading 为 true，layout 保留上次结果。
 * - 默认采用 `layered` 算法、从左到右方向；可通过 options 覆盖任意 ELK 参数。
 * - SSR / DOM 测试环境（无 window）返回空 layout，不报错。
 *
 * @example
 * const { layout, loading } = useElkLayout(nodes, edges, {
 *     'elk.algorithm': 'layered',
 *     'elk.direction': 'DOWN',
 * });
 * if (!loading && layout) {
 *     const { x, y } = layout.nodes['n1'];
 * }
 */
export function useElkLayout(
    nodes: ElkLayoutNode[],
    edges: ElkLayoutEdge[],
    options?: Record<string, string>,
): UseElkLayoutResult {
    const [layout, setLayout] = useState<ElkLayoutResult | null>(null);
    const [loading, setLoading] = useState(nodes.length > 0);
    const [error, setError] = useState<Error | null>(null);

    // JSON 序列化作为 dep key：内容不变则不重新布局
    const key = JSON.stringify({ nodes, edges, options });

    useEffect(() => {
        if (nodes.length === 0) {
            setLayout({ nodes: {}, edges: {} });
            setLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        computeElkLayout(nodes, edges, options).then(result => {
            if (cancelled) return;
            setLayout(result ?? { nodes: {}, edges: {} });
            setLoading(false);
        }).catch((err: unknown) => {
            if (cancelled) return;
            setError(err instanceof Error ? err : new Error(String(err)));
            setLoading(false);
        });

        return () => { cancelled = true; };
    }, [key]);

    return { layout, loading, error };
}
