import { useCanvasControls } from '@crab-dev/rc-canvas';
import type { CanvasControls } from '@crab-dev/rc-canvas';
import type { FlowNodeRect } from '../flow-diagram.js';

export interface FlowDiagramControls extends CanvasControls {
    /** 将节点居中，保留当前缩放；节点不存在时返回 false。 */
    focusNode: (nodeId: string) => boolean;
}

/**
 * 在 FlowDiagram children render prop 内部调用，获取视口控制能力。
 *
 * @example
 * <FlowDiagram ...>
 *   {({ controls }) => {
 *     // 直接用 controls，或挂到按钮上
 *     return <MyToolbar onFitView={controls.fitView} />;
 *   }}
 * </FlowDiagram>
 *
 * 如果需要在 children 外部的组件里调用，可在 FlowDiagram children 内放一个辅助组件：
 *
 * function FitButton() {
 *   const { fitView } = useFlowDiagramControls();
 *   return <button onClick={() => fitView(40)}>适应视图</button>;
 * }
 */
export function useFlowDiagramControls(nodeRects?: Record<string, FlowNodeRect>): FlowDiagramControls {
    const controls = useCanvasControls();
    return {
        ...controls,
        focusNode(nodeId) {
            const rect = nodeRects?.[nodeId];
            if (!rect) return false;
            controls.centerOn({ x: rect.x + rect.width / 2, y: rect.y + rect.height / 2 });
            return true;
        },
    };
}
