import { type ReactNode, type InputHTMLAttributes, type ChangeEvent } from 'react';

interface BaseCheckboxProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'onChange' | 'type' | 'value' | 'checked' | 'defaultChecked' | 'size'
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
     * 是否半选状态
     */
    indeterminate?: boolean;

    /**
     * 复选框的大小, 默认为 middle
     */
    size?: 'large' | 'middle' | 'small';

    /**
     * 值变化时的回调
     */
    onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;

    /**
     * Checkbox 的值, 在 CheckboxGroup 中使用
     */
    value?: string | number;
}

export type CheckboxProps = BaseCheckboxProps &
    ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

export interface CheckboxGroupProps {
    /**
     * 当前选中的值（受控）
     */
    value?: Array<string | number>;

    /**
     * 默认选中的值（非受控）
     */
    defaultValue?: Array<string | number>;

    /**
     * 值变化时的回调
     */
    onChange?: (value: Array<string | number>) => void;

    /**
     * 是否禁用所有复选框
     */
    disabled?: boolean;

    /**
     * 复选框组的大小, 默认为 middle
     */
    size?: 'large' | 'middle' | 'small';

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
    size?: 'large' | 'middle' | 'small';
    toggleValue: (val: string | number) => void;
}
