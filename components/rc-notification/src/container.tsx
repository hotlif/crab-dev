import { css, cx } from "@crab-dev/css";
import {
    useEffect,
    useRef,
} from "react";
import type { FC, HTMLAttributes } from "react";

import { AnimatePresence } from "motion/react"
import { type Direction } from "./types.js";

export interface ContainerProps extends Omit<HTMLAttributes<HTMLDivElement>, "title"> {

    /**
     * 容器的位置偏移量
     */
    offset?: [number, number]

    /**
     * 容器显示的位置
     */
    direction?: Direction
}


const getDirectionStyle = (direction: ContainerProps["direction"]) => {
    if (direction === "top") {
        return css`
            inset: 0 auto auto 50%;
            transform: translate(-50% , 0);
        `
    } else if (direction === "topLeft") {
        return css`
            inset: 0 auto auto 0%;
            transform: translate(0, 0);
        `
    } else if (direction === "topRight") {
        return css`
            inset: 0 0 auto auto;
            transform: translate(0, 0);
        `
    } else if (direction === "bottom") {
        return css`
            inset: auto auto 0 50%;
            transform: translate(-50%, 0);
        `
    } else if (direction === "bottomLeft") {
        return css`
            inset: auto auto 0 0;
            transform: translate(0, 0);
        `
    } else if (direction === "bottomRight") {
        return css`
            inset: auto 0 0 auto;
            transform: translate(0, 0);
        `
    } else {
        return null;
    }
}

const Container: FC<ContainerProps> = ({
    children,
    offset: _offset,
    direction = "topRight",
    className,
    ...restProps
}) => {
    const divRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        divRef.current?.showPopover()
    }, [])

    return (
        <div
            className={cx(
                css`
                    display: grid;
                    grid-template-columns: 1fr;
                    align-items: end;
                    justify-items: end;
                    border: unset;
                    padding: unset;
                    margin: unset;
                    overflow: visible;
                    background: unset;
                `,
                getDirectionStyle(direction),
                className
            )}
            popover="manual"
            ref={divRef}
            {...restProps}
        >
            <AnimatePresence>
                {children}
            </AnimatePresence>
        </div>
    )
}

export default Container;
