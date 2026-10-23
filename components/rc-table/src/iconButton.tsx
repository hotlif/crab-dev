import Button, { TokenVars as buttonVars, type ButtonNativeProps } from '@crab-dev/rc-button';
import { css, cx } from '@crab-dev/css';
import type { ReactNode } from 'react';
import token from './token.js';

interface TableIconButtonProps extends Omit<ButtonNativeProps, 'children' | 'appearance' | 'shape' | 'size'> {
    'aria-label': string;
    icon: ReactNode;
}

const buttonStyle = css`
    flex-shrink: 0;
    ${buttonVars['icon.width']}: ${token.tree.chevron.width};
    ${buttonVars['text.color']}: ${token.tree.chevron.color};
    ${buttonVars['text.background-color-hover']}: ${token.tree.button['background-color-hover']};
    ${buttonVars['text.background-color-focus']}: ${token.tree.button['background-color-focus']};
    ${buttonVars['text.background-color-active']}: ${token.tree.button['background-color-pressed']};
    /* The row owns density. Keep the target inside explicitly sized rows. */
    ${buttonVars['root.touch.min-width']}: ${token.tree.button['min-width']};
    ${buttonVars['root.touch.min-height']}: ${token.tree.button['min-height']};
    && { width: ${token.tree.button.width}; height: min(100%, ${token.tree.button.height}); }
    @media (pointer: coarse) {
        && { width: ${token.tree.button.touch.width}; height: min(100%, ${token.tree.button.touch.height}); }
    }
`;

export default function TableIconButton({ className, ...props }: TableIconButtonProps) {
    return <Button {...props} appearance="text" shape="circle" size="xs" title={props.title ?? props['aria-label']} className={cx(buttonStyle, className)} />;
}
