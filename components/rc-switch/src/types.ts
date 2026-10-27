import type { ControlledCheckedProps } from '@crab-dev/rc-hooks';
import { type ReactNode, type ButtonHTMLAttributes, type MouseEvent } from 'react';

interface BaseSwitchProps extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'role' | 'type' | 'value'
> {
    /**
     * 按钮的大小, 默认为 medium
     */
    size?: 'large' | 'medium' | 'small';

}

export interface SwitchChangeDetails { reason: 'toggle'; event: MouseEvent<HTMLButtonElement>; }

export type SwitchProps = BaseSwitchProps & ControlledCheckedProps<SwitchChangeDetails> &
    ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });
