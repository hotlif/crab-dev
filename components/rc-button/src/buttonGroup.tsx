import { css, cx } from '@crab-dev/css';
import { useConfig } from '@crab-dev/rc-config-provider';
import token from './token.js';
import ButtonGroupContext from './buttonGroupContext.js';
import type { ButtonGroupProps } from './types.js';

const groupLargeStyle  = css`gap: ${token.size.large.gap};`;
const groupMiddleStyle = css`gap: ${token.size.middle.gap};`;
const groupSmallStyle  = css`gap: ${token.size.small.gap};`;

const groupBaseStyle = css`
    display: inline-flex;
    align-items: center;
    flex-wrap: wrap;
`;

const connectedStyle = css`
    gap: ${token.group.gap};
    > :is(button, a) { border-radius: ${token.root['border-radius-active']}; }
    > :first-child { border-start-start-radius: calc(${token.root.height} / 2); border-end-start-radius: calc(${token.root.height} / 2); }
    > :last-child { border-start-end-radius: calc(${token.root.height} / 2); border-end-end-radius: calc(${token.root.height} / 2); }
    > [aria-pressed='true'] { border-radius: calc(${token.root.height} / 2); }
    > :active:not(:disabled):not([aria-disabled='true']) { border-radius: ${token.root['border-radius-active']}; }
`;

const sizeGapMap = {
    large:  groupLargeStyle,
    middle: groupMiddleStyle,
    small:  groupSmallStyle,
    xs: groupSmallStyle,
    s: groupMiddleStyle,
    m: groupLargeStyle,
    l: groupLargeStyle,
    xl: groupLargeStyle,
} as const;

function ButtonGroup({ children, size, appearance, danger, variant = 'standard', className }: ButtonGroupProps) {
    const config = useConfig();
    const resolvedSize = size ?? config.size;
    return (
        <ButtonGroupContext value={{ size, appearance, danger }}>
            <div data-variant={variant} className={cx(groupBaseStyle, sizeGapMap[resolvedSize], variant === 'connected' ? connectedStyle : null, className)}>
                {children}
            </div>
        </ButtonGroupContext>
    );
}

export default ButtonGroup;
