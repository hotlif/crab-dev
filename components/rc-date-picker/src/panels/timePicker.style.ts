import { css } from '@crab-dev/css';
import { TokenVars as buttonVars } from '@crab-dev/rc-button';
import token from '../token.js';

export const timePanelStyle = css`
    display: grid;
    width: max-content;
    max-width: 100%;
    gap: ${token.time.section.gap};
    color: ${token.time.input.color};
`;
export const timeTitleStyle = css`
    margin: 0;
    color: ${token.time.title.color};
    font-size: ${token.time.title['font-size']};
    font-weight: ${token.time.title['font-weight']};
    line-height: ${token.time.title['line-height']};
`;
export const timeFieldsStyle = css`
    display: flex;
    align-items: flex-start;
    justify-content: center;
    flex-wrap: wrap;
    row-gap: ${token.time.input.gap};
    direction: ltr;
    &[data-mode='dial'][data-hour-cycle='24'] [data-time-field] { width: ${token.time.dial.field.width}; }
    &[data-mode='dial'] [data-time-field], &[data-mode='dial'] [data-period] { height: ${token.time.dial.field.height}; }
    &[data-mode='dial'] [data-time-field] { font-size: ${token.time.dial['font-size']}; line-height: ${token.time.dial['line-height']}; }
    &[data-mode='dial'] > div > [aria-hidden='true'] { height: ${token.time.dial.field.height}; }
    @media (pointer: coarse), (max-width: 359px) {
        &[data-hour-cycle='12'] { width: ${token.time.dial.width}; max-width: 100%; }
        &[data-mode] [data-period] { height: ${token.time.action.width}; }
    }
`;
export const timePairStyle = css`display: flex; align-items: flex-start;`;
export const timeFieldStyle = css`
    && {
        box-sizing: border-box;
        width: ${token.time.input.width};
        min-width: 0;
        height: ${token.time.input.height};
        padding: 0;
        border: 0;
        border-radius: ${token.time.input['border-radius']};
        background: ${token.time.input.background};
        color: ${token.time.input.color};
        font-size: ${token.time.input['font-size']};
        font-weight: ${token.time.input['font-weight']};
        line-height: ${token.time.input['line-height']};
    }
    & input {
        height: 100%;
        width: 100%;
        padding: 0;
        font: inherit;
        text-align: center;
        color: inherit;
        caret-color: ${token.time.input['outline-color']};
    }
    &:focus-within, &[aria-pressed='true'] {
        background: ${token.time.input['background-selected']};
        color: ${token.time.input['color-selected']};
    }
    &:has(input:focus-visible) {
        outline: ${token.time.input['outline-width']} solid ${token.time.input['outline-color']};
        outline-offset: calc(${token.time.input['outline-width']} * -1);
    }
    &:has(input[aria-invalid='true']) { outline: ${token.time.input['outline-width']} solid ${token.time.input['color-error']}; }
    ${buttonVars['text.color']}: inherit;
    ${buttonVars['text.background-color-hover']}: color-mix(in srgb, currentColor calc(${token.time['opacity-hover']} * 100%), ${token.time.input.background});
    ${buttonVars['text.background-color-focus']}: ${token.time.input['background-selected']};
    ${buttonVars['text.background-color-active']}: color-mix(in srgb, currentColor calc(${token.time.pressed.opacity} * 100%), ${token.time.input.background});
    &[aria-pressed='true'] {
        ${buttonVars['text.background-color-hover']}: color-mix(in srgb, ${token.time.input['color-selected']} calc(${token.time['opacity-hover']} * 100%), ${token.time.input['background-selected']});
        ${buttonVars['text.background-color-active']}: color-mix(in srgb, ${token.time.input['color-selected']} calc(${token.time.pressed.opacity} * 100%), ${token.time.input['background-selected']});
    }
`;
export const timeSupportStyle = css`
    display: block;
    margin-top: ${token.time.support.gap};
    color: ${token.time.support.color};
    font-size: ${token.time.support['font-size']};
    line-height: ${token.time.support['line-height']};
`;
export const timeErrorStyle = css`
    margin: 0;
    color: ${token.time.input['color-error']};
    font-size: ${token.time.support['font-size']};
    line-height: ${token.time.support['line-height']};
`;
export const timeSeparatorStyle = css`
    display: grid;
    place-items: center;
    flex: 0 0 ${token.time.separator.width};
    height: ${token.time.input.height};
    font-size: ${token.time.dial['font-size']};
    line-height: ${token.time.dial['line-height']};
    font-weight: ${token.time.input['font-weight']};
`;
export const timePeriodStyle = css`
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    width: ${token.time.period.width};
    height: ${token.time.input.height};
    margin-inline-start: ${token.time.input.gap};
    border: ${token.time.period['outline-width']} solid ${token.time.period['outline-color']};
    border-radius: ${token.time.input['border-radius']};
    & button {
        flex: 1;
        width: 100%;
        min-height: 0;
        height: auto;
        padding: 0;
        border-radius: 0;
        font-size: ${token.time.period['font-size']};
        font-weight: ${token.time.period['font-weight']};
        color: ${token.time.period.color};
        ${buttonVars['text.color']}: ${token.time.period.color};
        ${buttonVars['root.touch.min-height']}: 100%;
        ${buttonVars['text.background-color-hover']}: color-mix(in srgb, currentColor calc(${token.time['opacity-hover']} * 100%), transparent);
        ${buttonVars['text.background-color-focus']}: color-mix(in srgb, currentColor calc(${token.time.pressed.opacity} * 100%), transparent);
        ${buttonVars['text.background-color-active']}: color-mix(in srgb, currentColor calc(${token.time.pressed.opacity} * 100%), transparent);
    }
    & button:first-child { border-start-start-radius: inherit; border-start-end-radius: inherit; border-bottom: ${token.time.period['outline-width']} solid ${token.time.period['outline-color']}; }
    & button:last-child { border-end-start-radius: inherit; border-end-end-radius: inherit; }
    & button[aria-checked='true'] {
        color: ${token.time.period['color-selected']};
        background: ${token.time.period['background-selected']};
        ${buttonVars['text.background-color-hover']}: color-mix(in srgb, currentColor calc(${token.time['opacity-hover']} * 100%), ${token.time.period['background-selected']});
        ${buttonVars['text.background-color-focus']}: ${token.time.period['background-selected']};
        ${buttonVars['text.background-color-active']}: color-mix(in srgb, currentColor calc(${token.time.pressed.opacity} * 100%), ${token.time.period['background-selected']});
    }
    @media (pointer: coarse), (max-width: 359px) {
        flex-direction: row;
        width: calc(${token.time.input.width} * 2 + ${token.time.separator.width});
        min-height: ${token.time.action.width};
        margin-inline-start: 0;
        & button:first-child { border-radius: 0; border-start-start-radius: inherit; border-end-start-radius: inherit; border-bottom: 0; border-inline-end: ${token.time.period['outline-width']} solid ${token.time.period['outline-color']}; }
        & button:last-child { border-radius: 0; border-start-end-radius: inherit; border-end-end-radius: inherit; }
    }
`;
export const timeActionsStyle = css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${token.time.input.gap};
    & > [data-mode-toggle] { margin-inline-end: auto; }
`;
export const timeModeButtonStyle = css`
    && { width: ${token.time.action.width}; height: ${token.time.action.width}; padding: 0; color: ${token.time.support.color}; }
    && svg { width: ${token.field.icon.width}; height: ${token.field.icon.width}; }
`;
export const timeClockStyle = css`
    display: block;
    width: ${token.time.dial.width};
    height: ${token.time.dial.width};
    margin-inline: auto;
    touch-action: none;
    user-select: none;
    border-radius: ${token.panel['border-radius']};
    & [data-clock-face] { fill: ${token.time.input.background}; }
    & [data-clock-hand] { fill: ${token.time.dial['background-selected']}; stroke: ${token.time.dial['background-selected']}; stroke-width: ${token.time.dial.track.width}; }
    & [data-clock-dot] { fill: ${token.time.dial['color-selected']}; }
    @media (forced-colors: active) {
        & [data-clock-face] { fill: Canvas; stroke: CanvasText; }
        & [data-clock-hand] { fill: Highlight; stroke: Highlight; }
    }
`;
export const timeClockButtonStyle = css`
    && {
        width: ${token.time.dial.handle.width}; height: ${token.time.dial.handle.width};
        padding: 0; border-radius: 50%;
        color: ${token.time.input.color};
        font-size: ${token.time.dial.label['font-size']};
        font-weight: ${token.time.input['font-weight']};
        ${buttonVars['text.color']}: inherit;
        ${buttonVars['text.background-color-hover']}: color-mix(in srgb, currentColor calc(${token.time['opacity-hover']} * 100%), transparent);
        ${buttonVars['text.background-color-focus']}: transparent;
        ${buttonVars['text.background-color-active']}: transparent;
    }
    &[aria-pressed='true'] { color: ${token.time.dial['color-selected']}; }
`;
