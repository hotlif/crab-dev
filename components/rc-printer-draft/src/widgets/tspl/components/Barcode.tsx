import type { RenderWidgetParam } from "../../../types";
import { Image as KonvaImage } from 'react-konva';
import JsBarcode from 'jsbarcode';
import { useEffect, useState } from "react";

const Barcode = ({
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
    const [image, setImage] = useState<HTMLCanvasElement | null>(null);
    useEffect(() => {
        const canvas = document.createElement('canvas');
        JsBarcode(canvas, widget.customProps.content, {
            format: "CODE128",
            width: widget.customProps.narrowBarWidth,
            height: widget.props.height,
            displayValue: true,
            fontSize: 20,
            margin: 10
        });
        setImage(canvas);
        return () => {
            canvas.remove();
        }
    }, [widget]);

    if (image) {
        return (
            <KonvaImage
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
                image={image!}            
            />
        )
    }
    return null;
}

export default Barcode;