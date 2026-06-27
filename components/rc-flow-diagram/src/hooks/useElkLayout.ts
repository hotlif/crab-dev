import { useEffect, useState } from 'react';
// elk-api.js 是纯 API 层，不含布局算法，依赖 Worker 运行；
// elk-worker.min.js 包含完整算法，由 Webpack 5 打包为独立 chunk 在 Worker 线程执行
import ELK from 'elkjs/lib/elk-api.js';
import type { ElkNode, ElkExtendedEdge } from 'elkjs/lib/elk-api.js';

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

// 面向库消费方的稳定化（例外白名单）：单例，避免重复创建 Worker
let elkInstance: InstanceType<typeof ELK> | null = null;

function getElk(): InstanceType<typeof ELK> | null {
    if (elkInstance) return elkInstance;
    // Worker 仅在浏览器中可用；Jest / SSR 环境返回 null，hook 以空结果 early-exit
    if (typeof Worker === 'undefined') return null;
    elkInstance = new ELK({
        // Webpack 5 静态分析 new URL(..., import.meta.url) 并将 elk-worker.min.js
        // 打包为独立 chunk，运行时提供正确 URL；workerFactory 参数 _url 被忽略
        workerFactory: () => new Worker(
            new URL('elkjs/lib/elk-worker.min.js', import.meta.url),
        ),
    });
    return elkInstance;
}

/**
 * 使用 ELK.js 在 Web Worker 中自动计算节点图布局（不阻塞主线程）。
 *
 * - 节点/边数据变化时自动重新布局（以 JSON 序列化内容作为依赖 key）。
 * - 布局结果在 Worker 线程异步计算；计算中 loading 为 true，layout 保留上次结果。
 * - 默认采用 `layered` 算法、从左到右方向；可通过 options 覆盖任意 ELK 参数。
 * - SSR / Jest 环境（无 Worker）返回空 layout，不报错。
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
): { layout: ElkLayoutResult | null; loading: boolean; error: Error | null } {
    const [layout, setLayout] = useState<ElkLayoutResult | null>(null);
    const [loading, setLoading] = useState(nodes.length > 0);
    const [error, setError] = useState<Error | null>(null);

    // JSON 序列化作为 dep key：内容不变则不重新布局
    const key = JSON.stringify({ nodes, edges, options });

    useEffect(() => {
        const elk = getElk();

        if (!elk || nodes.length === 0) {
            setLayout({ nodes: {}, edges: {} });
            setLoading(false);
            setError(null);
            return;
        }

        let cancelled = false;
        setLoading(true);
        setError(null);

        const graph: ElkNode = {
            id: '__elk_root__',
            layoutOptions: {
                'elk.algorithm': 'layered',
                'elk.direction': 'RIGHT',
                'elk.spacing.nodeNode': '40',
                'elk.layered.spacing.nodeNodeBetweenLayers': '60',
                ...options,
            },
            children: nodes.map(n => ({
                id: n.id,
                width: n.width,
                height: n.height,
                ...(n.layoutOptions ? { layoutOptions: n.layoutOptions } : {}),
            })),
            edges: edges.map(e => ({
                id: e.id,
                sources: [e.source],
                targets: [e.target],
                ...(e.layoutOptions ? { layoutOptions: e.layoutOptions } : {}),
            })) as ElkExtendedEdge[],
        };

        elk.layout(graph).then((result: ElkNode) => {
            if (cancelled) return;

            const nodeMap: ElkLayoutResult['nodes'] = {};
            for (const child of result.children ?? []) {
                nodeMap[child.id] = {
                    x: child.x ?? 0,
                    y: child.y ?? 0,
                    width: child.width ?? 0,
                    height: child.height ?? 0,
                };
            }

            const edgeMap: ElkLayoutResult['edges'] = {};
            for (const edge of (result.edges ?? []) as ElkExtendedEdge[]) {
                const points: Array<{ x: number; y: number }> = [];
                for (const section of edge.sections ?? []) {
                    points.push(section.startPoint);
                    for (const bp of section.bendPoints ?? []) {
                        points.push(bp);
                    }
                    points.push(section.endPoint);
                }
                edgeMap[edge.id] = { points };
            }

            setLayout({ nodes: nodeMap, edges: edgeMap });
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
