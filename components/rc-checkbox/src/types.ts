import type { ControlledCheckedProps, ControlledValueProps } from '@crab-dev/rc-hooks';
import { type ReactNode, type InputHTMLAttributes, type ChangeEvent, type HTMLAttributes } from 'react';

interface BaseCheckboxProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'checked' | 'defaultChecked' | 'size'
> {
    /**
     * 是否半选状态
     */
    indeterminate?: boolean;

    /**
     * 复选框的大小, 默认为 medium
     */
    size?: 'large' | 'medium' | 'small';

    /**
     * Checkbox 的值, 在 CheckboxGroup 中使用
     */
    value?: string | number;
}

export interface CheckboxChangeDetails {
    reason: 'toggle';
    event: ChangeEvent<HTMLInputElement>;
}

export type CheckboxProps = BaseCheckboxProps & ControlledCheckedProps<CheckboxChangeDetails> &
    ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

interface BaseCheckboxGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
    /**
     * 是否禁用所有复选框
     */
    disabled?: boolean;

    /**
     * 复选框组的大小, 默认为 medium
     */
    size?: 'large' | 'medium' | 'small';

    /**
     * 子元素
     */
    children: ReactNode;

    /**
     * 自定义类名
     */
    className?: string;
}

export interface CheckboxGroupContextValue {
    value: Array<string | number>;
    disabled: boolean;
    size?: 'large' | 'medium' | 'small';
    toggleValue: (val: string | number, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface CheckboxGroupChangeDetails {
    reason: 'select' | 'deselect';
    event?: ChangeEvent<HTMLInputElement>;
}

export type CheckboxGroupProps = BaseCheckboxGroupProps & ControlledValueProps<Array<string | number>, CheckboxGroupChangeDetails>;
