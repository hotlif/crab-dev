import { css } from "@crab-dev/css";
import token from "./token.js";

export const iconArrayBase = css`
    position: relative;
    display: inline-block;
    flex-shrink: 0;
    width: 10px;
    height: 10px;
    vertical-align: middle;
    &::before, &::after{
        content: "";
        position: absolute;
        top: 4px;
        left: 0;
        right: auto;
        height: 1.5px;
        width: 6px;
        transform-origin: center;
        transition: transform ${token.motion.arrow.transition};
        background-color: currentColor;
        border-radius: 6px;
    }
    @media (prefers-reduced-motion: reduce) {
        &::before, &::after { transition: none; }
    }
    @media (forced-colors: active) {
        /* Forced colors replaces background paint with Canvas. A real border
           retains a system foreground stroke without opting the menu out. */
        &::before, &::after {
            background: none;
            box-sizing: border-box;
            border-top: 1.5px solid currentColor;
        }
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
        left: 2px;
        transform-origin: right center;
    }
    &::before {
        transform: rotate(45deg);
    }
    &::after {
        transform: rotate(-45deg);
    }
`
