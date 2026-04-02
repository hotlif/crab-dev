import { type ReactNode, type InputHTMLAttributes, type ChangeEvent } from 'react';

interface BaseRadioProps extends Omit<
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
     * 单选框的大小, 默认为 middle
     */
    size?: 'large' | 'middle' | 'small';

    /**
     * 值变化时的回调
     */
    onChange?: (checked: boolean, event: ChangeEvent<HTMLInputElement>) => void;

    /**
     * Radio 的值, 在 RadioGroup 中使用
     */
    value?: string | number;
}

export type RadioProps = BaseRadioProps &
    ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

export interface RadioGroupProps {
    /**
     * 当前选中的值（受控）
     */
    value?: string | number;

    /**
     * 默认选中的值（非受控）
     */
    defaultValue?: string | number;

    /**
     * 值变化时的回调
     */
    onChange?: (value: string | number) => void;

    /**
     * 是否禁用所有单选框
     */
    disabled?: boolean;

    /**
     * 单选框组的大小, 默认为 middle
     */
    size?: 'large' | 'middle' | 'small';

    /**
     * Radio name 属性, 用于原生表单分组
     */
    name?: string;

    /**
     * 子元素
     */
    children: ReactNode;

    /**
     * 自定义类名
     */
    className?: string;
}

export interface RadioGroupContextValue {
    value: string | number | undefined;
    disabled: boolean;
    size?: 'large' | 'middle' | 'small';
    name?: string;
    selectValue: (val: string | number) => void;
}
