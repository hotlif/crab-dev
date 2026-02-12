import type { ResourceWidget, Property, RenderWidgetParam } from "../../types";
import { WidgetType } from "./types";
import components from "./components";
import Unknown from "./components/Unknown";

const CommonProperty: Property[] = [{
    name: "x",
    title: "X",
    type: "number",
    description: "横坐标",
    value: 0
},  {
    name: "y",
    title: "Y",
    type: "number",
    description: "纵坐标",
    value: 0
}, {
    name: "width",
    title: "宽度",
    type: "number",
    description: "宽度",
    value: 120
}, {
    name: "height",
    title: "高度",
    type: "number",
    description: "高度",
    value: 16
}, {
    name: "rotation",
    title: "旋转",
    description: "旋转角度",
    type: "number",
    value: 0
}]

const TextResourceWidget: ResourceWidget = {
    id: "Text",
    title: "Text",
    description: "文本",
    type: WidgetType.Text,
    property: CommonProperty,
    customProperty: [{
        name: "font",
        title: "字体",
        description: "字体名",
        type: "string",
        value: ""
    }, {
        name: "mx",
        title: "X 倍数",
        description: "横向放大倍数",
         type: "number",
        value: 1
    }, {
        name: "my",
        title: "Y 倍数",
        description: "纵向放大倍数",
        type: "number",
        value: 1
    }, {
        name: "content",
        title: "内容",
        description: "在此输入对应的内容信息",
        type: "string",
        value: "请输入内容"
    }]
}


const BarcodeResourceWidget: ResourceWidget = {
    id: "Barcode",
    title: "Barcode",
    description: "条形码",
    type: WidgetType.Barcode,
    property: CommonProperty,
    customProperty: [{
        name: "content",
        title: "内容",
        description: "条形码内容",
        type: "string",
        value: "10000"
    }, {
        name: "narrowBarWidth",
        title: "线条宽度",
        description: "单根线条的宽度",
        type: "number",
        value: 2
    }]
}

const TSPLWidget: ResourceWidget[] = [
    TextResourceWidget,
    BarcodeResourceWidget
]

export const CustomizeWidget = (params: RenderWidgetParam) => {
    const widget = components.find(element => element.name === params.widget.type)
    if (widget) {
        return <widget.component {...params} />
    }
    return <Unknown {...params} />;
}

export default TSPLWidget;