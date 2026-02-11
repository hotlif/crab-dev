import { Group, Rect, Text } from "react-konva";
import type { ResourceWidget, Widget, RenderWidgetParam } from "../types";
import { useRef } from "react";
import Konva from "konva";

enum WidgetType {
    Text = "Text"
}

const CommonProperty = [{
    name: "x",
    title: "X",
    description: "横坐标",
    value: 0
},  {
    name: "y",
    title: "Y",
    description: "纵坐标",
    value: 0
}, {
    name: "width",
    title: "宽度",
    description: "宽度",
    value: 120
}, {
    name: "height",
    title: "高度",
    description: "高度",
    value: 16
}]

const TextResourceWidget: ResourceWidget = {
    id: "Text",
    title: "Text",
    description: "文本",
    type: WidgetType.Text,
    property: CommonProperty,
    customProperty: [{
        name: "font",
        title: "字体名",
        description: "字体名",
        value: ""
    }, {
        name: "rot",
        title: "旋转角度",
        description: "旋转角度",
        value: 0
    }, {
        name: "mx",
        title: "横向放大倍数",
        description: "横向放大倍数",
        value: 1
    }, {
        name: "my",
        title: "纵向放大倍数",
        description: "纵向放大倍数",
        value: 1
    }, {
        name: "content",
        title: "内容",
        description: "在此输入对应的内容信息",
        value: "请输入内容"
    }]
}

const TSPLWidget: ResourceWidget[] = [
    TextResourceWidget
]

export const CustomizeWidget = (params: RenderWidgetParam) => {
    const { widget, selectedWidgetId, onSelectedWidgetIdChange } = params;
    const textRef = useRef<Konva.Text | null>(null);
    if (widget.type === WidgetType.Text) {
        return (
            <Text
                draggable={params.draggable}
                ref={textRef}
                text={widget.customProps?.content}
                rotation={widget.customProps?.rot}
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
    return null;
}

export default TSPLWidget;