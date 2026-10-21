export const meta = {
    title: "useDragResize 拖拽调整尺寸",
    description: "把 handleProps 铺到分隔条上即可；edge 决定把手在目标的哪一缘（方向系数），dragging 可用于拖拽期间关闭过渡动画",
};

import { useDragResize } from '../../src/index.js';

const UseDragResizeDemo = () => {
    const { size, dragging, handleProps } = useDragResize({
        defaultSize: 180,
        min: 100,
        max: 320,
        edge: 'end',
    });

    return (
        <div className="crab-hooks-drag-resize">
            <div
                className="crab-hooks-drag-resize__pane crab-hooks-drag-resize__resizable"
                data-dragging={dragging}
                style={{ width: size }}
            >
                {Math.round(size)}px
            </div>
            <div
                {...handleProps}
                className="crab-hooks-drag-resize__handle"
                title="拖拽调整宽度"
            />
            <div className="crab-hooks-drag-resize__pane crab-hooks-drag-resize__remainder">flex 填充</div>
        </div>
    );
};

export default UseDragResizeDemo;
