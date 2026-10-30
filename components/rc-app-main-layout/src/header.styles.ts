import { css } from "@crab-dev/css";
import { TokenVars as avatarVars } from "@crab-dev/rc-avatar";
import { TokenVars as buttonVars } from "@crab-dev/rc-button";
import token from "./token.js";

export const headerStyle = css`
    display: flex;
    flex-direction: column;
    box-shadow: ${token.header["box-shadow"]};
    z-index: ${token.header['z-index']};
    box-sizing: border-box;
    flex-shrink: 0;
`;

export const tabStripStyle = css`
    display: flex;
    align-items: flex-end;
    background-color: ${token.tab.strip["background-color"]};
    padding: ${token.tab.strip.padding};
    min-height: ${token.tab.strip.height};
    box-sizing: border-box;
    min-width: 0;
    &[hidden] { display: none; }
`;

export const toolbarStyle = css`
    display: flex;
    align-items: center;
    gap: ${token.header.toolbar.gap};
    height: ${token.header.toolbar.height};
    padding: ${token.header.toolbar.padding};
    background-color: ${token.header.toolbar["background-color"]};
    box-sizing: border-box;

    @media (max-width: 767px) {
        gap: 4px;
        padding-inline: 8px;
    }
`;

export const toolbarSpacerStyle = css`
    flex: 1;
    min-width: 0;
`;

export const breadcrumbsStyle = css`
    min-width: 0;
    flex: 0 1 auto;
    overflow: hidden;

    @media (max-width: 767px) {
        display: none;
    }
`;

export const mobileTitleStyle = css`
    display: none;

    @media (max-width: 767px) {
        display: block;
        min-width: 0;
        flex: 1;
        font-size: ${token.header.user.name["font-size"]};
        font-weight: 600;
        color: ${token.header.user.name.color};
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
`;

export const navBtnStyle = css`
    && {
        ${buttonVars['text.color']}: ${token.header['nav-btn'].color};
        ${buttonVars['text.background-color-hover']}: ${token.header['nav-btn']['background-color-hover']};
        ${buttonVars['text.background-color-focus']}: ${token.header['nav-btn']['background-color-hover']};
        ${buttonVars['text.background-color-active']}: ${token.header['nav-btn']['background-color-active']};
        ${buttonVars['icon.width']}: ${token.header['nav-btn'].icon.width};
        ${buttonVars['root.border-radius-active']}: ${token.header['nav-btn']['border-radius']};
        width: ${token.header['nav-btn'].width};
        min-width: ${token.header['nav-btn'].width};
        height: ${token.header['nav-btn'].width};
        border-radius: ${token.header['nav-btn']['border-radius']};
        padding: 0;
        gap: 0;
        flex-shrink: 0;
        &:hover { color: ${token.header['nav-btn']['color-hover']}; }
        /* Reserve the full hit area so neighboring actions never overlap. */
        margin-inline: calc((${token.header['nav-btn'].touch.width} - ${token.header['nav-btn'].width}) / 2);
        & > span:first-child {
            inset: auto;
            top: 50%;
            left: 50%;
            width: ${token.header['nav-btn'].touch.width};
            height: ${token.header['nav-btn'].touch.width};
            transform: translate(-50%, -50%);
        }
    }
`;

export const notificationDotStyle = css`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${token.header['nav-btn'].dot["background-color"]};
    box-shadow: 0 0 0 2px ${token.header.toolbar["background-color"]};
    pointer-events: none;
`;

export const userPillStyle = css`
    && {
        ${buttonVars['root.border-radius-active']}: ${token.header.user.pill['border-radius']};
        ${buttonVars['text.color']}: ${token.header.user.name.color};
        ${buttonVars['text.background-color-hover']}: ${token.header.user.pill['background-color-hover']};
        ${buttonVars['text.background-color-focus']}: ${token.header.user.pill['background-color-hover']};
        ${buttonVars['text.background-color-active']}: ${token.header['nav-btn']['background-color-active']};
        min-width: ${token.header.user.pill.height};
        max-width: 100%;
        height: ${token.header.user.pill.height};
        padding: ${token.header.user.pill.padding};
        border-radius: ${token.header.user.pill['border-radius']};
        flex-shrink: 1;
        > span:last-child { display: inline-flex; min-width: 0; max-width: 100%; }
    }
`;

export const userPillContentStyle = css`
    display: inline-flex;
    align-items: center;
    gap: ${token.header.user.pill.gap};
    min-width: 0;
    max-width: 100%;
`;

export const userMenuWrapStyle = css`
    position: relative;
    display: inline-flex;
    min-width: 0;
    max-width: ${token.header.user.pill['max-width']};
    flex: 0 1 auto;
`;

export const userMenuStyle = css`
    width: ${token.header.user.menu['min-width']};
    min-width: ${token.header.user.menu['min-width']};
    padding: ${token.header.user.menu.padding};
    background-color: ${token.header.user.menu['background-color']};
    border: 0;
    border-radius: ${token.header.user.menu['border-radius']};
    box-shadow: ${token.header.user.menu['box-shadow']};
    z-index: ${token.tab['context-menu']['z-index']};
    box-sizing: border-box;
    transform-origin: top right;
    opacity: 1;
    translate: 0 0;
    transition: opacity ${token.motion.interaction.transition}, translate ${token.motion.spatial.transition};
    @starting-style { opacity: 0; translate: 0 ${token.motion.offset.translate}; }
    &[data-state="closed"] { opacity: 0; translate: 0 ${token.motion.offset.translate}; }

    /* Keep the hover path continuous across the visual gap below the trigger. */
    &::before {
        content: '';
        position: absolute;
        bottom: 100%;
        inset-inline: 0;
        height: ${token.header.user.menu.gap};
    }
    @media (forced-colors: active) { outline: 1px solid CanvasText; box-shadow: none; }

    @media (prefers-reduced-motion: reduce) { transition: none; }
`;

export const userMenuItemStyle = css`
    && {
        ${buttonVars['root.border-radius-active']}: ${token.header.user.menu.item['border-radius']};
        ${buttonVars['text.color']}: ${token.tab['context-menu'].item.color};
        ${buttonVars['text.background-color-hover']}: ${token.header['nav-btn']['background-color-hover']};
        ${buttonVars['text.background-color-focus']}: ${token.header['nav-btn']['background-color-hover']};
        ${buttonVars['text.background-color-active']}: ${token.header['nav-btn']['background-color-active']};
        justify-content: flex-start;
        gap: ${token.header.user.menu.item.gap};
        width: 100%;
        height: ${token.header.user.menu.item.height};
        padding: ${token.header.user.menu.item.padding};
        border-radius: ${token.header.user.menu.item['border-radius']};
        font-size: ${token.header.user.menu.item['font-size']};
        font-weight: ${token.header.user.menu.item['font-weight']};
        line-height: ${token.header.user.menu.item['line-height']};
        text-align: start;
        &:focus-visible { outline-offset: ${token.tab.item['outline-offset-focus']}; }
        @media (pointer: coarse) { height: ${token.header.user.pill.height}; }
    }
`;

export const userMenuItemIconStyle = css`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: ${token.header.user.menu.item.icon.width};
    height: ${token.header.user.menu.item.icon.width};
    color: ${token.tab['context-menu'].item.icon.color};

    & > svg {
        width: 100%;
        height: 100%;
    }
`;

export const usernameStyle = css`
    font-size: ${token.header.user.name["font-size"]};
    color: ${token.header.user.name.color};
    font-weight: ${token.header.user.name["font-weight"]};
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;

    @media (max-width: 640px) {
        display: none;
    }
`;

export const userInfoStyle = css`
    display: inline-flex;
    flex-direction: column;
    align-items: flex-end;
    min-width: 0;
    flex: 1 1 auto;
    line-height: 1.15;

    @media (max-width: 640px) {
        display: none;
    }
`;

export const userRoleStyle = css`
    margin-top: 2px;
    font-size: calc(${token.tab["font-size"]} - 2px);
    color: ${token.header['nav-btn'].color};
    white-space: nowrap;
    max-width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
`;

export const userInfoSkeletonStyle = css`
    display: inline-flex;
    flex-direction: column;
    gap: 4px;
    width: 76px;

    @media (max-width: 640px) {
        display: none;
    }
`;

export const avatarStyle = css`
    flex-shrink: 0;
    ${avatarVars['size.small.width']}: ${token.header.user.avatar.width};
    ${avatarVars['size.small.font-size']}: ${token.header.user.avatar['font-size']};
    ${avatarVars['icon.small.font-size']}: ${token.header.user.avatar.icon.width};
    ${avatarVars['default.background-color']}: ${token.header.user.avatar['background-color']};
    ${avatarVars['default.color']}: ${token.header.user.avatar.color};
    & > span:has(> img), & img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
`;
