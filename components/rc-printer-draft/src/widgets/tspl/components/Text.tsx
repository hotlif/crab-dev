import Konva from "konva";
import { useRef } from "react";
import type { RenderWidgetParam } from "../../../types";
import { Text as KonvaText } from "react-konva";

const Text = (params: RenderWidgetParam) => {
    const { widget, selectedWidgetId, onSelectedWidgetIdChange } = params;
    const textRef = useRef<Konva.Text | null>(null);
    return (
        <KonvaText
            draggable={params.draggable}
            ref={textRef}
            text={widget.customProps?.content}
            rotation={widget.props.rotation ?? 0}
            scaleX={widget.customProps?.mx ?? 1}
            scaleY={widget.customProps?.my ?? 1}
            id={widget.id}
            x={widget.props.x}
            y={widget.props.y}
            
            width={widget.props.width}
            height={widget.props.height}
            dragBoundFunc={params.dragBoundFunc}
            onClick={(e) => {
                e.cancelBubble = true;
                if (selectedWidgetId.includes(widget.id)) {
                    onSelectedWidgetIdChange(selectedWidgetId.filter(element => element !== widget.id))
                } else {
                    onSelectedWidgetIdChange([widget.id])
                }
            }}
            onTransform={params.onTransform}
            onDragEnd={params.onDragEnd}
            onDragStart={params.onDragStart}
            onDragMove={params.onDragMove}
        />
    )
}

export default Text;