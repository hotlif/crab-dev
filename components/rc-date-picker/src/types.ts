import type { LineEditProps } from '@crab-dev/rc-line-edit';

/** 选择器输入框属性；值、清除和弹层交互由选择器管理。 */
export type PickerFieldProps = Omit<
    LineEditProps,
    'value' | 'defaultValue' | 'onChange' | 'onValueChange' | 'type' | 'readOnly' | 'suffix' |
    'allowClear' | 'onClear' | 'containerRef'
>;

import type { SyntheticEvent } from 'react';
import type { DropdownOpenChangeDetails } from '@crab-dev/rc-dropdown-container';
import type { ControlledValueProps, ControlledOpenProps } from '@crab-dev/rc-hooks';

export interface PickerValueChangeDetails {
    reason: 'choose' | 'clear' | 'confirm';
    event?: SyntheticEvent | Event;
}

export type PickerValueProps<T> = ControlledValueProps<T | null, PickerValueChangeDetails>;

export type PickerOpenProps = ControlledOpenProps<DropdownOpenChangeDetails>;
