import { css, cx } from '@crab-dev/css';
import { type ReactNode } from 'react';
import token from './token.js';
import ButtonGroupContext, { type ButtonGroupContextValue } from './buttonGroupContext.js';

export interface ButtonGroupProps extends ButtonGroupContextValue {
    children: ReactNode;
    className?: string;
}

const groupLargeStyle  = css`gap: ${token.size.large.gap};`;
const groupMiddleStyle = css`gap: ${token.size.middle.gap};`;
const groupSmallStyle  = css`gap: ${token.size.small.gap};`;

const groupBaseStyle = css`
    display: inline-flex;
    align-items: center;
`;

const sizeGapMap = {
    large:  groupLargeStyle,
    middle: groupMiddleStyle,
    small:  groupSmallStyle,
} as const;

function ButtonGroup({ children, size, appearance, className }: ButtonGroupProps) {
    const resolvedSize = size ?? 'middle';
    return (
        <ButtonGroupContext value={{ size, appearance }}>
            <div className={cx(groupBaseStyle, sizeGapMap[resolvedSize], className)}>
                {children}
            </div>
        </ButtonGroupContext>
    );
}

export default ButtonGroup;
