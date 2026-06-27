/**
 * useEdgeCrossings —— 计算边与边之间的交叉点，驱动 FlowEdge 的跨越桥（line hop）效果。
 *
 * 两条边交叉时，edgeId 字典序较小的"跨越"（完整绘制），字典序较大的"让路"
 * （在交叉点处留缺口）。将返回值中的 `crossings[edgeId]` 直接传给对应
 * `<FlowEdge crossings={...} />` 即可呈现跨越效果。
 */

import { useMemo } from 'react';
import type { Pt } from '@crab-dev/rc-canvas';
import type { EdgeRoutes } from './useEdgeRouting.js';

/** 计算线段 P1-P2 与 P3-P4 的严格内部交点（端点重合不算）。 */
function segIntersect(p1: Pt, p2: Pt, p3: Pt, p4: Pt): Pt | null {
    const d1x = p2.x - p1.x, d1y = p2.y - p1.y;
    const d2x = p4.x - p3.x, d2y = p4.y - p3.y;
    const denom = d1x * d2y - d1y * d2x;
    if (Math.abs(denom) < 1e-10) return null;
    const dx = p3.x - p1.x, dy = p3.y - p1.y;
    const t = (dx * d2y - dy * d2x) / denom;
    const u = (dx * d1y - dy * d1x) / denom;
    const eps = 1e-6;
    if (t > eps && t < 1 - eps && u > eps && u < 1 - eps) {
        return { x: p1.x + t * d1x, y: p1.y + t * d1y };
    }
    return null;
}

/**
 * 计算所有边之间的交叉点，返回每条边需要"让路"的位置。
 *
 * 昂贵的 O(n²·m²) 计算，面向库消费方稳定化（消费方不一定启用 React Compiler），
 * 手写 useMemo + 内容签名是正当例外。
 */
export function useEdgeCrossings(routes: EdgeRoutes): Record<string, Pt[]> {
    const sig = JSON.stringify(routes);
    return useMemo(() => {
        const ids = Object.keys(routes);
        const result: Record<string, Pt[]> = {};
        for (const id of ids) result[id] = [];

        for (let i = 0; i < ids.length; i++) {
            for (let j = i + 1; j < ids.length; j++) {
                const idA = ids[i];
                const idB = ids[j];
                const ptsA = routes[idA]?.points ?? [];
                const ptsB = routes[idB]?.points ?? [];
                for (let a = 0; a < ptsA.length - 1; a++) {
                    for (let b = 0; b < ptsB.length - 1; b++) {
                        const pt = segIntersect(ptsA[a], ptsA[a + 1], ptsB[b], ptsB[b + 1]);
                        if (pt) {
                            // 字典序较大的 id 让路（留缺口）
                            if (idA < idB) {
                                result[idB].push(pt);
                            } else {
                                result[idA].push(pt);
                            }
                        }
                    }
                }
            }
        }
        return result;
    }, [sig]);
}

export default useEdgeCrossings;
