export const meta = {
    title: "useDragResize 拖拽调整尺寸",
    description: "把 handleProps 铺到分隔条上即可；edge 决定把手在目标的哪一缘（方向系数），dragging 可用于拖拽期间关闭过渡动画",
};

import type { CSSProperties } from 'react';
import { useDragResize } from '../../src/index.js';

const paneStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    color: '#666',
};

const UseDragResizeDemo = () => {
    const { size, dragging, handleProps } = useDragResize({
        defaultSize: 180,
        min: 100,
        max: 320,
        edge: 'end',
    });

    return (
        <div style={{ display: 'flex', height: 140, border: '1px solid #eee', borderRadius: 8, overflow: 'hidden' }}>
            <div style={{ ...paneStyle, width: size, flexShrink: 0, background: dragging ? '#eef2ff' : '#fafafa' }}>
                {Math.round(size)}px
            </div>
            <div
                {...handleProps}
                style={{ width: 7, cursor: 'col-resize', touchAction: 'none', background: '#e2e8f0', flexShrink: 0 }}
                title="拖拽调整宽度"
            />
            <div style={{ ...paneStyle, flex: 1 }}>flex 填充</div>
        </div>
    );
};

export default UseDragResizeDemo;
