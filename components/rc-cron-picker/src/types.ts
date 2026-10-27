import type { Ref, SyntheticEvent } from 'react';
import type { LineEditProps } from '@crab-dev/rc-line-edit';
import type { CronFieldKind } from './cron.js';
import type { ControlledValueProps, ControlledOpenProps } from '@crab-dev/rc-hooks';
import type { DropdownOpenChangeDetails } from '@crab-dev/rc-dropdown-container';

export interface CronPickerChangeDetails {
    reason: 'input' | 'field';
    field?: CronFieldKind;
    /** 触发提交的实际事件；下层控件没有提供事件时省略。 */
    event?: SyntheticEvent | Event;
}

export type CronPickerFieldProps = Pick<LineEditProps,
    'id' | 'name' | 'required' | 'readOnly' | 'label' | 'supportingText' | 'errorText' | 'appearance'
    | 'aria-labelledby' | 'aria-describedby' | 'aria-invalid' | 'aria-busy'
    | 'onChange' | 'onInput' | 'onFocus' | 'onBlur'>;

export type CronPickerProps = CronPickerFieldProps & ControlledValueProps<string, CronPickerChangeDetails> & ControlledOpenProps<DropdownOpenChangeDetails> & {
    /** 控件尺寸,默认 medium */
    size?: 'large' | 'medium' | 'small';

    /** 是否禁用 */
    disabled?: boolean;

    /** 外部校验状态,影响边框颜色;输入了非法表达式时组件会自行显示 error 态 */
    status?: 'error' | 'warning';

    /** 占位提示,默认 `* * * * *` */
    placeholder?: string;

    /** 弹层内"接下来执行时间"预览条数,传 0 关闭预览,默认 5 */
    previewCount?: number;

    /** 输入框元素的 ref */
    ref?: Ref<HTMLInputElement>;

    /** 自定义类名,作用于触发器容器 */
    className?: string;

    /** 无障碍名称,默认 "Cron 表达式" */
    'aria-label'?: string;
};
