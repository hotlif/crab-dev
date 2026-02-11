import { useDroppable } from "@dnd-kit/core";
import { type FC, type RefObject, type ComponentType, useRef, useEffect, type Dispatch} from "react";
import { Stage, type StageProps, Layer, Transformer } from "react-konva";
import Konva from "konva"
import type { RenderWidgetParam, Widget } from "./types";
import { css } from "@linaria/core";

interface CanvasProps extends StageProps {
    stageRef: RefObject<Konva.Stage | null>
    CustomizeWidget: ComponentType<RenderWidgetParam>
    widgets: Widget[]
    onWidgetsChange: Dispatch<React.SetStateAction<Widget[]>>
    selectedWidgetId: string[], 
    onSelectedWidgetIdChange: Dispatch<React.SetStateAction<string[]>>
}

const Canvas: FC<CanvasProps> = ({
    stageRef,
    widgets,
    CustomizeWidget,
    selectedWidgetId,
    onSelectedWidgetIdChange,
    onWidgetsChange,
    ...restProps
}) => {
    const {
        setNodeRef,
    } = useDroppable({
        id: 'react-konva-droppable',
    });

    const transformerRef = useRef<Konva.Transformer | null>(null);
    const layerRef = useRef<Konva.Layer | null>(null);

    useEffect(() => {
        const tr = transformerRef.current;
        const layer = layerRef.current;
        
        if (!tr || !layer) return;
        const nodes = selectedWidgetId.map((id) => layer.findOne('#' + id)).filter((node) => node !== undefined);
        tr.nodes(nodes);
        tr?.getLayer?.()?.batchDraw();
    }, [selectedWidgetId]);


    const deleteSelectedWidgets = () => {
        onWidgetsChange(widgets.filter(element => !selectedWidgetId.includes(element.id)));
        onSelectedWidgetIdChange([]);
    };

    return (
        <div
            tabIndex={-1}
            className={css`
                margin: 0px 3rem;
                background-color: #fff;
                box-shadow: rgba(9, 30, 66, 0.25) 0px 4px 8px -2px, rgba(9, 30, 66, 0.08) 0px 0px 0px 1px;
            `}
            ref={setNodeRef}
            onKeyDown={(e) => {
                if (e.key == "Delete") {
                    deleteSelectedWidgets();
                }
            }}
        >
            <Stage ref={stageRef} {...restProps}>
                <Layer
                    ref={layerRef}
                >
                    {widgets.map(widget => (
                        <CustomizeWidget
                            widget={widget}
                            key={widget.id}
                            draggable={true}
                            selectedWidgetId={selectedWidgetId}
                            onSelectedWidgetIdChange={onSelectedWidgetIdChange}
                            onTransform={(event) => {
                                const node = event.target; 
                                const scaleX = node.scaleX();
                                const scaleY = node.scaleY();
                                node.width(Math.max(10, node.width() * scaleX));
                                node.height(Math.max(10, node.height() * scaleY));
                                node.scaleX(1);
                                node.scaleY(1);
                                widget.props.height = node.height();
                                widget.props.width = node.width();
                                widget.props.x = node.x() - node.offsetX();
                                widget.props.y = node.y() - node.offsetY();
                            }}
                            onDragMove={(e) => {
                                const node = e.target;
                                widget.props.x = node.x() - node.offsetX();
                                widget.props.y = node.y() - node.offsetY();
                            }}
                            dragBoundFunc={function({
                                x,
                                y
                            }) {
                                const stage = this.getStage();
                                let newX = x;
                                let newY = y;
                                if (stage) {
                                    const {
                                        width,
                                        height
                                    } = stage.getSize();
                                    const widgetWidth = this.width();
                                    const widgetHeight = this.height();
                                    const offsetX = this.offsetX();
                                    const offsetY = this.offsetY();
                                    if (x - offsetX <= 0) {
                                        newX = offsetX;
                                    }
                                    if (y - offsetY <= 0) {
                                        newY = offsetY;
                                    }

                                    if (x - offsetX + widgetWidth >= width) {
                                        newX = width - widgetWidth + offsetX;
                                    }
                                    if (y - offsetY + widgetHeight >= height) {
                                        newY = height - widgetHeight + offsetY;
                                    }
                                }
                                return {
                                    x: newX,
                                    y: newY
                                }
                        }}
                    />
                ) )}

                    <Transformer
                        ref={transformerRef}
                    />
                </Layer>
            </Stage>
        </div>
    )
}

export default Canvas;