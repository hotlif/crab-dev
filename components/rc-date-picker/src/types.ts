import type { LineEditProps } from '@crab-dev/rc-line-edit';

/** 选择器输入框属性；值、清除和弹层交互由选择器管理。 */
export type PickerFieldProps = Omit<
    LineEditProps,
    'value' | 'defaultValue' | 'onChange' | 'type' | 'readOnly' | 'suffix' |
    'allowClear' | 'onClear' | 'containerRef'
>;
