import { css } from "@linaria/core";
import { type ComponentType, useRef, useState, type FC, type HTMLAttributes } from "react";
import { DndContext } from '@dnd-kit/core';
import Konva from "konva";

import Canvas from "./canvas";
import ResourcePanel from "./panels/resource";
import PropertyPanel from "./panels/property";

import type { PageSettings, RenderWidgetParam, ResourceWidget, Widget } from "./types";

interface EditorProps extends Omit<HTMLAttributes<HTMLDivElement>, "children"> {
    pageSettings: PageSettings
    resources: ResourceWidget[]
    CustomizeWidget: ComponentType<RenderWidgetParam>
}

const Editor: FC<EditorProps> = ({
    className,
    resources,
    CustomizeWidget,
    pageSettings,
    ...props
}) => {
    const [widgets, setWidgets] = useState<Widget[]>([]);

    const stageRef = useRef<Konva.Stage>(null);
    const [selectedWidgetId, setSelectedWidgetId] = useState<string[]>([]);

    const getResource = (type: string) => {
        return resources.find(element => element.type === type)
    }

    return (
        <DndContext
            onDragEnd={(event) => {
                const pointerPos = stageRef.current?.getRelativePointerPosition();
                if (!pointerPos) return;    
                if (event.over) {
                    const finalX = pointerPos.x; 
                    const finalY = pointerPos.y;
    
                    const uuid = crypto.randomUUID();
                    const type = event.active.data.current?.type;
                    const resource = getResource(type);
    
                    const customProps: Record<string, any> = {};
                    const props: any = {};
    
                    resource?.property?.forEach(element => {
                        props[element.name] = element.value;
                    })
    
                    resource?.customProperty?.forEach(element => {
                        customProps[element.name] = element.value;
                    })
    
                    widgets.push({
                        id: uuid,
                        type: event.active.data.current?.type,
                        props: {
                            ...props,
                            x: finalX,
                            y: finalY
                        },
                        customProps
                    })
                    setWidgets([...widgets]);
                }

            }}
        >
            <div
                className={css`
                    display: flex;
                    height: 100%;
                    background-color: #fff;
                `}
                {...props}
            >
                <aside
                    className={css`
                        width: 250px;
                        border-right: 1px solid #eaeaea;
                        height: 100%;
                    `}
                >
                    <ResourcePanel resourceWidgets={resources} />
                </aside>
                <main
                    className={css`
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        flex: 1;
                        height: 100%;
                        background-color: #eee;
                    `}
                >
                    <Canvas
                        stageRef={stageRef}
                        width={pageSettings.width}
                        height={pageSettings.height}
                        widgets={widgets}
                        onWidgetsChange={setWidgets}
                        CustomizeWidget={CustomizeWidget}
                        onClick={() => {
                            setSelectedWidgetId([])
                        }}
                        selectedWidgetId={selectedWidgetId}
                        onSelectedWidgetIdChange={setSelectedWidgetId}
                    />
                </main>
                <aside
                    className={css`
                        width: 250px;
                        border-left: 1px solid #eaeaea; 
                    `}
                >
                    <PropertyPanel />
                </aside>
            </div>
        </DndContext>
    )
}

export default Editor;