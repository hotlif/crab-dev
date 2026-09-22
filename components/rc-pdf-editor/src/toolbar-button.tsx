import Button, { type ButtonProps } from '@crab-dev/rc-button';
import Tooltip from '@crab-dev/rc-tooltip';
import { cx } from '@crab-dev/css';
import type { ReactElement } from 'react';
import PdfIcon, { type PdfIconName } from './icon.js';
import { iconStyle, toolbarButtonStyle } from './styles.js';

interface ToolbarButtonProps extends Pick<ButtonProps, 'id' | 'aria-controls' | 'aria-expanded'> {
    label: string;
    icon: PdfIconName | ReactElement;
    disabled?: boolean;
    danger?: boolean;
    className?: string;
    appearance?: 'text' | 'primary' | 'tonal';
    selected?: boolean;
    selectedIcon?: PdfIconName;
    tooltip?: string;
    tooltipPlacement?: 'top' | 'bottom';
    onClick: ButtonProps['onClick'];
}

export default function ToolbarButton({ label, icon, disabled, danger, className, appearance = 'text', selected, selectedIcon, tooltip, tooltipPlacement = 'bottom', onClick, ...attributes }: ToolbarButtonProps) {
    const displayedIcon = selected && selectedIcon ? selectedIcon : icon;
    return <Tooltip title={tooltip ?? label} placement={tooltipPlacement} arrow={false}>
        <Button {...attributes} aria-label={label} aria-pressed={selected} isSelected={appearance === 'tonal' ? selected : undefined}
            shape="circle" size="s" appearance={selected ? 'tonal' : appearance} icon={typeof displayedIcon === 'string' ? <PdfIcon name={displayedIcon} /> : <span className={iconStyle} aria-hidden="true">{displayedIcon}</span>}
            className={cx(toolbarButtonStyle, className)} disabled={disabled} danger={danger} onClick={onClick} />
    </Tooltip>;
}
