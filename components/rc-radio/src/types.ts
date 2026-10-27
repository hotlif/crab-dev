import type { ControlledCheckedProps, ControlledValueProps } from '@crab-dev/rc-hooks';
import { type ReactNode, type InputHTMLAttributes, type ChangeEvent, type HTMLAttributes } from 'react';

interface BaseRadioProps extends Omit<
    InputHTMLAttributes<HTMLInputElement>,
    'type' | 'value' | 'checked' | 'defaultChecked' | 'size'
> {
    /**
     * 单选框的大小, 默认为 medium
     */
    size?: 'large' | 'medium' | 'small';

    /**
     * Radio 的值, 在 RadioGroup 中使用
     */
    value?: string | number;
}

export interface RadioChangeDetails { reason: 'toggle'; event: ChangeEvent<HTMLInputElement>; }

export type RadioProps = BaseRadioProps & ControlledCheckedProps<RadioChangeDetails> &
    ({ children: ReactNode; 'aria-label'?: string } | { children?: never; 'aria-label': string });

interface BaseRadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'defaultValue'> {
    /**
     * 是否禁用所有单选框
     */
    disabled?: boolean;

    /**
     * 单选框组的大小, 默认为 medium
     */
    size?: 'large' | 'medium' | 'small';

    /**
     * Radio name 属性，用于原生分组与表单字段；未指定或为空时自动生成组内唯一名称。
     * 通过 FormData 提交时应显式指定稳定的业务字段名。
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
    size?: 'large' | 'medium' | 'small';
    name?: string;
    selectValue: (val: string | number, event: ChangeEvent<HTMLInputElement>) => void;
}

export interface RadioGroupChangeDetails { reason: 'select'; event?: ChangeEvent<HTMLInputElement>; }
export type RadioGroupProps = BaseRadioGroupProps & ControlledValueProps<string | number, RadioGroupChangeDetails>;
