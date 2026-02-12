
import { Group, Rect, Text } from "react-konva";
import { RenderWidgetParam } from "../../../types"

const Unknown = ({
    draggable,
    widget,
    selectedWidgetId,
    onSelectedWidgetIdChange,
    dragBoundFunc,
    onTransform,
    onDragEnd,
    onDragStart,
    onDragMove,
}: RenderWidgetParam) => {
    return (
        <Group
            draggable={draggable}
            rotation={widget.props.rotation ?? 0}
            scaleX={widget.customProps?.mx ?? 1}
            scaleY={widget.customProps?.my ?? 1}
            id={widget.id}
            x={widget.props.x}
            y={widget.props.y}
            width={widget.props.width}
            height={widget.props.height}
            dragBoundFunc={dragBoundFunc}
            onClick={(e) => {
                e.cancelBubble = true;
                if (selectedWidgetId.includes(widget.id)) {
                    onSelectedWidgetIdChange(selectedWidgetId.filter(element => element !== widget.id))
                } else {
                    onSelectedWidgetIdChange([widget.id])
                }
            }}
            onTransform={onTransform}
            onDragEnd={onDragEnd}
            onDragStart={onDragStart}
            onDragMove={onDragMove}
        >
            <Rect
                width={widget.props.width}
                height={widget.props.height}
                fill="gray"
            />
            <Text
                text="未知组件"
                width={widget.props.width}
                height={widget.props.height}
                align="center"
                verticalAlign="middle"
                fill="white"
            />
        </Group>
    )
}

export default Unknown;