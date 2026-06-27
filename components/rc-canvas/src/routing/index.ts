/**
 * 图边正交路由工具集（纯函数，无 React）。
 *
 * 分层：geometry（几何原语）→ orthogonal（折线构造）→ obstacle-avoidance（A* 避让）
 * + ports（端口分配）。坐标 / 矩形与 `ElkLayoutResult` 对齐，可直接配合 useElkLayout。
 */

export type { Pt, Rect, Side, EdgeAnchor } from './geometry.js';
export {
    ROUTE_EPS,
    isHorizontalSide,
    dominantSide,
    rectCenter,
    anchorPoint,
    nearestSideAnchor,
    inflateRect,
    segmentIntersectsRect,
    segmentHitsAny,
    polylineClearOf,
    simplifyOrthogonal,
    uniqueSorted,
} from './geometry.js';

export { routeOrthogonal, connectThroughWaypoints, withTerminalStubs } from './orthogonal.js';

export type { AvoidOptions } from './obstacle-avoidance.js';
export { routeAvoidingObstacles, routeEdge } from './obstacle-avoidance.js';

export type { RoutableEdge } from './ports.js';
export { assignPorts } from './ports.js';
