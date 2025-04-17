import { RefObject, useEffect, useRef, type FC, type HTMLAttributes } from "react";
import { css, cx } from "@linaria/core";


export interface PopoverProps extends Omit<HTMLAttributes<HTMLDivElement>, ""> {

    /**
     * 锚点元素
     */
    anchorElement: RefObject<HTMLElement>


    /**
     * 借助此属性，您可以相对于各自的锚点放置锚定定位的元素，并且适用于以锚定元素为中心的 9 个单元格的网格。
     */
    positionArea?: "TopCenter" | "TopSpanLeft" | "TopSpanRight" | "Top" | 
                   "LeftCenter" | "LeftSpanTop" | "LeftSpanBottom" | "Left" |
                   "BottomCenter" | "BottomSpanLeft" | "BottomSpanRight" | "Bottom" |
                   "RightCenter" | "RightSpanTop" | "RightSpanBottom" | "Right" | 
                   "TopLeft" | "TopRight" | "BottomLeft" | "BottomRight"
}


let popoverId: number = 0;

/**
 * 使用 CSS Anchor Positioning API 来实现, 可以使用 [Oddbird](https://github.com/oddbird/css-anchor-positioning ) 的 CSS 锚点定位 polyfill 
 *  - https://developer.chrome.com/blog/anchor-positioning-api?hl=zh-cn
 *  - 需要 Chrome 129 以上
 */
const Popover: FC<PopoverProps> = ({
    className,
    anchorElement,
    children,
    style = {},
    ...restProps
}) => {
    const divRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (anchorElement.current && divRef.current) {
            const id = `--id-${popoverId}`;
            anchorElement.current.style.setProperty("anchor-name", id);
            divRef.current.style.setProperty("position-anchor", id)
        }
    }, [])

    return (
        <div
            className={cx(css`
                position: fixed;
            `, className)}
            style={{
                ...style,
            }}
            ref={divRef}
            {...restProps}
        >
            {children}
        </div>
    )
}

export default Popover;
