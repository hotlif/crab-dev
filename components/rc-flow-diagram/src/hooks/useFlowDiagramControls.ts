import { useCanvasControls } from '@crab-dev/rc-canvas';
import type { CanvasControls } from '@crab-dev/rc-canvas';

export type FlowDiagramControls = Pick<CanvasControls, 'fitView' | 'exportPNG' | 'zoomIn' | 'zoomOut'>;

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
export function useFlowDiagramControls(): FlowDiagramControls {
    return useCanvasControls();
}
