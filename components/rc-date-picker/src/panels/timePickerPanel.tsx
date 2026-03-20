import { css, cx } from "@linaria/core";
import { useEffect, useRef, type FC, type HTMLAttributes } from "react";
import token from "../token";
import { selectStyle } from "./universal.style";


interface TimePickerValue {
    hour: number
    minute: number
    second: number
}

export interface TimePickerPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, ''> {
    value?: TimePickerValue | null,
    onValueChange?: (value: TimePickerValue) => void
}


const containerStyle = css`
    display: flex;
    flex-direction: column;
`

const mainStyle = css`
    height: 224px;
    display: flex;
    line-height: ${token.dimension['cell-content-size']};
    font-size: ${token.typography['cell-font-size']};
    font-weight: ${token.typography['cell-font-weight']};
`

const ulStyle = css`
    flex: 1;
    overflow-y: hidden;
    overflow-x: hidden;
    list-style: none; 
    padding: 0; 
    margin: 0;
    scrollbar-gutter: stable;
    scrollbar-width: thin;
    scroll-behavior: smooth;
    padding: 4px;
    &:hover {
        overflow-y: auto;
    }

    &::after {
        display: block;
        height: calc(100% - 24px);
        content: "";
    }
    > li {
        cursor: pointer;
        padding-inline-start: 14px;
        padding-inline-end: 8px;
        border-radius: ${token.dimension['cell-border-radius']};
        transition: ${token.motion['cell-transition']};
        user-select: none;
        &:hover {
            background-color: ${token.color['cell-hover-background']};
            color: ${token.color['cell-hover-text']};
        }
    }
`

const TimePickerPanel: FC<TimePickerPanelProps> = ({
    className,
    value = {
        hour: Temporal.Now.zonedDateTimeISO().hour,
        minute: Temporal.Now.zonedDateTimeISO().minute,
        second: Temporal.Now.zonedDateTimeISO().second
    },
    onValueChange,
    ...restProps
}) => {
    const hourRef = useRef<HTMLUListElement>(null);
    const minuteRef = useRef<HTMLUListElement>(null);
    const secondRef = useRef<HTMLUListElement>(null);

    useEffect(() => {
        hourRef.current?.scrollTo({
            top: (value?.hour ?? 0) * (hourRef.current?.children[0] as HTMLElement)?.offsetHeight || 0,
            behavior: "smooth"
        });
    }, [value?.hour])

    useEffect(() => {
        minuteRef.current?.scrollTo({
            top: (value?.minute ?? 0) * (minuteRef.current?.children[0] as HTMLElement)?.offsetHeight || 0,
            behavior: "smooth"
        });
    }, [value?.minute])

    
    useEffect(() => {
        secondRef.current?.scrollTo({
            top: (value?.second ?? 0) * (secondRef.current?.children[0] as HTMLElement)?.offsetHeight || 0,
            behavior: "smooth"
        });
    }, [value?.second])

    return (
        <div
            className={cx(containerStyle, className)}
            {...restProps}
        >
            <div
                className={css`
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: ${token.dimension['header-padding']};
                `}
            >
                <div
                    className={css`
                        font-weight: bold;
                    `}
                >
                    {value?.hour.toString().padStart(2, '0')}:{value?.minute.toString().padStart(2, '0')}:{value?.second.toString().padStart(2, '0')}
                </div>
            </div>
            <div
                className={mainStyle}
            >
                <ul
                    className={ulStyle}
                    ref={hourRef}
                >
                    {
                        Array.from({ length: 24 }).map((_, index) => (
                            <li
                                key={index}
                                className={cx(index === value?.hour ? selectStyle : undefined)}
                                onClick={() => {
                                    onValueChange?.({
                                        hour: index,
                                        minute: value?.minute ?? 0,
                                        second: value?.second ?? 0
                                    });

                                }}
                            >
                                {index.toString().padStart(2, '0')}
                            </li>
                        ))
                    }
                </ul>
                <ul
                    className={ulStyle}
                    ref={minuteRef}
                >
                    {
                        Array.from({ length: 60 }).map((_, index) => (
                            <li
                                key={index}
                                className={cx(index === value?.minute ? selectStyle : undefined)}
                                onClick={() => {
                                    onValueChange?.({
                                        hour: value?.hour ?? 0,
                                        minute: index,
                                        second: value?.second ?? 0
                                    });
                                }}
                            >
                                {index.toString().padStart(2, '0')}
                            </li>
                        ))
                    }
                </ul>
                <ul
                    className={ulStyle}
                    ref={secondRef}
                >
                    {
                        Array.from({ length: 60 }).map((_, index) => (
                            <li
                                className={cx(index === value?.second ? selectStyle : undefined)}
                                key={index}
                                onClick={() => {
                                    onValueChange?.({
                                        hour: value?.hour ?? 0,
                                        minute: value?.minute ?? 0,
                                        second: index
                                    });
                                }}
                            >
                                {index.toString().padStart(2, '0')}
                            </li>
                        ))
                    }
                </ul>
            </div>
        </div>
    )
}

export default TimePickerPanel;