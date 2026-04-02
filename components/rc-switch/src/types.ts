import { type ReactNode, type ButtonHTMLAttributes, type MouseEvent, type KeyboardEvent } from 'react';

interface BaseSwitchProps extends Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    'onChange' | 'role' | 'type' | 'value'
> {
    /**
     * 是否选中（受控）
     */
    checked?: boolean;

    /**
     * 默认是否选中（非受控）
     */
    defaultChecked?: boolean;

    /**
     * 开关大小
     */
    size?: 'default' | 'small';

    /**
     * 值变化时的回调
     */
    onChange?: (checked: boolean, event: MouseEvent<HTMLButtonElement> | KeyboardEvent<HTMLButtonElement>) => void;
}

export type SwitchProps = BaseSwitchProps &
    ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });
