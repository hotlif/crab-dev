/* global HTMLOrSVGElement */
import { type FC, type HTMLAttributes } from "react"

export const GripVertical: FC<HTMLAttributes<HTMLOrSVGElement>> = ({
    ...restProps
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 16 16"
            fill="currentColor"
            {...restProps}
        >
            <circle cx="5" cy="4" r="1.5" />
            <circle cx="11" cy="4" r="1.5" />
            <circle cx="5" cy="8" r="1.5" />
            <circle cx="11" cy="8" r="1.5" />
            <circle cx="5" cy="12" r="1.5" />
            <circle cx="11" cy="12" r="1.5" />
        </svg>
    )
}

export const ChevronRight: FC<HTMLAttributes<HTMLOrSVGElement>> = ({
    ...restProps
}) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="1em"
            height="1em"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...restProps}
        >
            <polyline points="9 18 15 12 9 6" />
        </svg>
    )
}
