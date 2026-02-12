import { css } from "@linaria/core";
import type { FC, HTMLAttributes } from "react";
import Button from "@crab-dev/rc-button";
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

import type { ResourceWidget } from "../types";

const ResourcePanelItem: FC<{ widget: ResourceWidget }> = ({
    widget
}) => {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: widget.id,
        data: widget
    });

    return (
        <div
            ref={setNodeRef}
            style={{
                transform: CSS.Translate.toString(transform)
            }}
            {...listeners}
            {...attributes}
        >
            <Button
                appearance="dashed"
            >
                {widget.title}
            </Button>
        </div>
    )
}


interface ResourcePanelProps extends HTMLAttributes<HTMLDivElement> {
    resourceWidgets: ResourceWidget[]
}

const ResourcePanel: FC<ResourcePanelProps> = ({
    resourceWidgets
}) => {
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
            `}
        >
            <div
                className={css`
                    padding: 8px 12px;
                    border-bottom: 1px solid #d9d9d9;
                `}
            >
                组件
            </div>
            <div
                className={css`
                    display: flex;
                    gap: 8px;
                    padding: 8px 12px;
                `}
            >
                {resourceWidgets.map((widget) => (
                    <ResourcePanelItem key={widget.id} widget={widget} />
                ))}
            </div>
        </div>
    )
}

export default ResourcePanel;