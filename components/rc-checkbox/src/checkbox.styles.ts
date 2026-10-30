import { css } from '@crab-dev/css';
import token from './token.js';

export const wrapperStyle = css`
    position: relative;
    display: inline-flex;
    /* Icon transitions must not change the component's inline alignment. */
    vertical-align: middle;
    align-items: center;
    max-width: 100%;
    gap: ${token.label.gap};
    cursor: pointer;
    color: ${token.label.color};
    line-height: ${token.root['line-height']};
    font-family: ${token.root['font-family']};
    user-select: none;

    &:not([data-disabled]):hover > input + span::before {
        opacity: ${token['state-layer']['opacity-hover']};
    }
    &:not([data-disabled]):hover [data-checkbox-part='box'] {
        border-color: ${token.control['border-color-hover']};
    }
    > input:focus-visible + span {
        outline: ${token.root['outline-width-focus']} solid ${token.root['outline-color-focus']};
        outline-offset: ${token.root['outline-offset-focus']};
    }
    > input:focus-visible + span::before {
        opacity: ${token['state-layer']['opacity-focus']};
    }
    &:not([data-disabled]):active > input + span::before,
    > input:not(:disabled):active + span::before {
        opacity: ${token['state-layer']['opacity-active']};
    }

    &:is([data-state='checked'], [data-state='indeterminate']) {
        > input + span::before {
            background-color: ${token['state-layer']['color-selected']};
        }
        [data-checkbox-part='box'] {
            background-color: ${token.control.checked['background-color']};
            border-color: ${token.control.checked['border-color']};
        }
        &:not([data-disabled]):hover [data-checkbox-part='box'] {
            background-color: ${token.control.checked['background-color-hover']};
            border-color: ${token.control.checked['border-color']};
        }
    }
    &[data-state='checked'] [data-checkbox-part='checkmark'],
    &[data-state='indeterminate'] [data-checkbox-part='indeterminate'] {
        opacity: 1;
        scale: ${token.icon.scale};
    }
    &[data-state='indeterminate'] [data-checkbox-part='box'] {
        background-color: ${token.control.indeterminate['background-color']};
        border-color: ${token.control.indeterminate['border-color']};
    }

    &:not([data-disabled]):has(> input[aria-invalid='true']) {
        > input + span::before { background-color: ${token['state-layer']['color-error']}; }
        [data-checkbox-part='box'] { border-color: ${token.control['border-color-error']}; }
        > input:focus-visible + span { outline-color: ${token.control['border-color-error']}; }
        &:is([data-state='checked'], [data-state='indeterminate']) {
            [data-checkbox-part='box'] { background-color: ${token.control['background-color-error']}; }
            [data-checkbox-part='checkmark'] { color: ${token.icon['color-error']}; }
            [data-checkbox-part='indeterminate'] { background-color: ${token.icon['color-error']}; }
        }
    }

    &[data-disabled] {
        cursor: not-allowed;
        color: ${token.label['color-disabled']};
        opacity: ${token.root['opacity-disabled']};
        > input + span { pointer-events: none; }
        > input + span::before { opacity: 0; }
        [data-checkbox-part='box'] {
            background-color: ${token.control['background-color-disabled']};
            border-color: ${token.control['border-color-disabled']};
            transition: none;
        }
        &:is([data-state='checked'], [data-state='indeterminate']) [data-checkbox-part='box'] {
            background-color: ${token.control.selection['background-color-disabled']};
        }
        [data-checkbox-part='checkmark'] { color: ${token.icon['color-disabled']}; transition: none; }
        [data-checkbox-part='indeterminate'] { background-color: ${token.icon['color-disabled']}; transition: none; }
    }

    @media (prefers-reduced-motion: reduce) {
        [data-checkbox-part], > input + span::before { transition: none; }
    }
    @media (forced-colors: active) {
        color: CanvasText !important;
        > input + span::before { display: none; }
        > input:focus-visible + span { outline-color: Highlight !important; }
        &[data-state] [data-checkbox-part='box'] {
            forced-color-adjust: none;
            background-color: Canvas !important;
            border-color: CanvasText !important;
        }
        &:is([data-state='checked'], [data-state='indeterminate']) [data-checkbox-part='box'] {
            background-color: Highlight !important;
            border-color: Highlight !important;
        }
        &[data-state] [data-checkbox-part='checkmark'] { color: HighlightText !important; }
        &[data-state] [data-checkbox-part='indeterminate'] { background-color: HighlightText !important; }
        &[data-disabled] {
            opacity: 1;
            color: GrayText !important;
            &[data-state] [data-checkbox-part='box'] { border-color: GrayText !important; }
            &:is([data-state='checked'], [data-state='indeterminate']) [data-checkbox-part='box'] { background-color: GrayText !important; }
            [data-checkbox-part='checkmark'] { color: Canvas !important; }
            [data-checkbox-part='indeterminate'] { background-color: Canvas !important; }
        }
    }
`;

export const hiddenInputStyle = css`
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
`;

export const controlStyle = css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    width: ${token.control.target.width};
    height: ${token.control.target.width};
    border-radius: ${token.control['border-radius-focus']};

    &::before {
        content: '';
        position: absolute;
        width: ${token['state-layer'].width};
        height: ${token['state-layer'].width};
        border-radius: ${token['state-layer']['border-radius']};
        background-color: ${token['state-layer'].color};
        opacity: 0;
        pointer-events: none;
        transition: ${token['state-layer'].transition};
    }
    @media (pointer: coarse) {
        min-width: ${token.root.touch['min-width']};
        min-height: ${token.root.touch['min-height']};
    }
`;

export const boxStyle = css`
    position: relative;
    box-sizing: border-box;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex: none;
    border: ${token.control['border-width']} ${token.control['border-style']} ${token.control['border-color']};
    background-color: ${token.control['background-color']};
    box-shadow: ${token.control['box-shadow']};
    transition: ${token.control.transition};
`;

export const iconStyle = css`
    position: absolute;
    opacity: 0;
    scale: ${token.icon['scale-hidden']};
    pointer-events: none;
    transition: ${token.icon.transition};
`;

export const checkIconStyle = css`
    color: ${token.icon.checked.color};
    stroke-width: ${token.icon['stroke-width']};
`;

export const indeterminateIconStyle = css`
    background-color: ${token.icon.indeterminate.color};
`;

export const labelStyle = css`
    min-width: 0;
    overflow-wrap: anywhere;
`;
