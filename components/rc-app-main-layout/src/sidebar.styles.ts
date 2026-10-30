import { css } from "@crab-dev/css";
import token from "./token.js";

export const sidebarStyle = css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: ${token.sidebar.width};
    padding: ${token.sidebar.padding};
    gap: ${token.sidebar.gap};
    background-color: ${token.sidebar["background-color"]};
    border-inline-end: 1px solid ${token.sidebar["border-color"]};
    box-sizing: border-box;
    flex-shrink: 0;
    overflow: hidden auto;
    transition:
        width 300ms cubic-bezier(0, 0, 0.2, 1),
        padding 300ms cubic-bezier(0, 0, 0.2, 1);

    &[data-collapsed="true"] {
        width: ${token.sidebar.collapsed.width};
        padding: ${token.sidebar.collapsed.padding};
    }

    @media (prefers-reduced-motion: reduce) {
        transition: none;
    }
`;

export const logoRowStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.sidebar.logo.gap};
    padding: ${token.sidebar.logo.padding};
    user-select: none;
    min-width: 0;
`;

export const logoActionStyle = css`
    && {
        justify-content: flex-start;
        min-height: ${token.sidebar.logo.touch['min-height']};
        height: auto;
        padding: 0;
        border: 0;
        min-width: 0;
        width: 100%;
    }
`;

export const logoRowCollapsedStyle = css`
    justify-content: center;
    gap: 0;
    padding-inline: 0;
`;

export const logoStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.sidebar.logo.width};
    height: ${token.sidebar.logo.width};
    border-radius: ${token.sidebar.logo["border-radius"]};
    background-color: ${token.sidebar.logo["background-color"]};
    color: ${token.sidebar.logo.color};
    flex-shrink: 0;

    & > svg {
        width: 60%;
        height: 60%;
    }

    & > img {
        width: 100%;
        height: 100%;
        object-fit: contain;
    }
`;

export const logoTitleStyle = css`
    font-size: ${token.sidebar.logo.title["font-size"]};
    color: ${token.sidebar.logo.title.color};
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const menuWrapStyle = css`
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
`;

export const menuSkeletonWrapStyle = css`
    display: inline-flex;
    flex-direction: column;
    gap: 8px;
    padding: 8px;
`;

export const menuSkeletonItemStyle = css`
    display: inline-flex;
`;
