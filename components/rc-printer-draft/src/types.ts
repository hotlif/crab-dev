import Konva from "konva"

interface WidgetCommonProps {
    x: number
    y: number
    width: number
    height: number
}

export interface Widget<T = any> {
    /**
     * 唯一 id 方便检索和修改
     */
    id: string

    /**
     * 类型
     */
    type: string

    /**
     * 公用组件属性
     */
    props: WidgetCommonProps
    
    /**
     * 自定义属性
     */
    customProps?: T
}


interface Property {
    /**
     * 标题
     */
    title: string

    /**
     * 名称
     */
    name: string

    /**
     * 描述
     */
    description: string

    /**
     * 值信息
     */
    value: any
}

export interface ResourceWidget {

    /**
     * 唯一 id
     */
    id: string

    /**
     * 标题信息
     */
    title: string

    /**
     * 描述
     */
    description: string

    /**
     * 类型
     */
    type: string

    /**
     * 组件信息
     */
    property: Property[]

    /**
     * 自定义组件信息
     */
    customProperty?: Property[]
}

export interface PageSettings {
    width: number
    height: number
}


export interface RenderWidgetParam {
    widget: Widget,
    selectedWidgetId: string[]
    draggable?: boolean
    onSelectedWidgetIdChange: React.Dispatch<React.SetStateAction<string[]>>
    onTransform: (event: Konva.KonvaEventObject<Event>) => void
    onDragMove?: (event: Konva.KonvaEventObject<Event>) => void
    onDragStart?: (event: Konva.KonvaEventObject<Event>) => void
    onDragEnd?: (event: Konva.KonvaEventObject<Event>) => void
    dragBoundFunc?: (this: Konva.Node, pos: Konva.Vector2d) => Konva.Vector2d
}