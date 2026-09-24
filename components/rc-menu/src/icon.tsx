import { css } from "@crab-dev/css"
import token from "./token.js";

export const iconArrayBase = css`
    position: relative;
    margin-right: 0.5rem;
    &::before, &::after{
        content: "";
        position: absolute;
        height: 1.5px;
        width: 6px;
        transition: transform ${token.motion.arrow.transition};
        background-color: currentColor;
        border-radius: 6px;
    }
    @media (prefers-reduced-motion: reduce) {
        &::before, &::after { transition: none; }
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
