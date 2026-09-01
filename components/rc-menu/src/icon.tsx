import { css } from "@crab-dev/css"

export const iconArrayBase = css`
    position: relative;
    margin-right: 0.5rem;
    &::before, &::after{
        content: "";
        position: absolute;
        height: 1.5px;
        width: 6px;
        transition: transform 300ms cubic-bezier(0.645, 0.045, 0.355, 1);
        background-color: currentColor;
        border-radius: 6px;
    }
`

export const iconArrayDown = css`
    &::before {
        left: 4px;
        transform: rotate(-45deg);
    }
    &::after {
        transform: rotate(45deg);
    }
`

export const iconArrayUp = css`
    &::before {
        left: 4px;
        transform: rotate(45deg);
    }
    &::after {
        transform: rotate(-45deg);
    }
`

export const iconArrayRight = css`
    &::before, &::after{
        transform-origin: right center;
    }
    &::before {
        transform: rotate(45deg);
    }
    &::after {
        transform: rotate(-45deg);
    }
`