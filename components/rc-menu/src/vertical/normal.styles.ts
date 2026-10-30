import { css } from "@crab-dev/css";
import token from "../token.js";

export const itemStyle = css`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    cursor: pointer;
    user-select: none;
`

export const ulStyle = css`
    list-style-type: none;
    width: 100%;
    padding: 0px;
    margin: 0px;
    overflow: hidden;
`

export const collapseStyle = css`
    display: grid;
    width: 100%;
    grid-template-rows: 1fr;
    transition: grid-template-rows ${token.motion.expand.transition};
    &[data-state="closed"] { grid-template-rows: 0fr; }

    @starting-style { grid-template-rows: 0fr; }
    & > div { min-height: 0; overflow: hidden; }
    @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const ulChildrenItemGroupStyle = css`
    overflow: hidden;
`

export const stateIconStyle = css`
    font-size: 1rem;
    margin-inline-start: ${token.vertical.item.icon["margin-right"]};
`

export const menuItemIcon = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    color: ${token.vertical.item.icon.color};
    width: ${token.vertical.item.icon.width};
    height: ${token.vertical.item.icon.width};
    margin-inline-end: ${token.vertical.item.icon["margin-right"]};
    line-height: 1;

    & > svg,
    & > img {
        width: 100%;
        height: 100%;
        display: block;
    }
`
