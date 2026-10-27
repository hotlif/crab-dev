import DatePicker from '../datePicker/datePicker.js';
import DateTimePicker from '../dateTimePicker/dateTimePicker.js';
import TimePicker from '../timePicker/timePicker.js';

export function checkPickerTypes() {
    const field = <DatePicker value={null} name='birthday' onFocus={e => e.currentTarget.select()} panelProps={{ id: 'calendar' }} />;
    // @ts-expect-error 面板草稿不属于选择器公开属性。
    const invalid = <DatePicker value={null} selectValues={[]} />;
    // @ts-expect-error 不允许通过 panelProps 覆盖内部面板实例。
    const invalidPanel = <DatePicker value={null} panelProps={{ instance: { current: null } }} />;
    const initial = <DatePicker defaultValue={null} defaultOpen onValueChange={(_next, details) => { const reason: 'choose' | 'clear' | 'confirm' = details.reason; return reason; }} />;
    // @ts-expect-error 受控值与初始值互斥。
    const conflictingValue = <DatePicker value={null} defaultValue={null} />;
    // @ts-expect-error 受控开关与初始开关互斥。
    const conflictingOpen = <DatePicker open defaultOpen />;
    // @ts-expect-error hasValue 是内部输入框状态，不属于公开选择器属性。
    const privateDateState = <DatePicker hasValue />;
    // @ts-expect-error hasValue 是内部输入框状态，不属于公开选择器属性。
    const privateDateTimeState = <DateTimePicker hasValue />;
    // @ts-expect-error hasValue 是内部输入框状态，不属于公开选择器属性。
    const privateTimeState = <TimePicker hasValue />;
    return { field, invalid, invalidPanel, initial, conflictingValue, conflictingOpen, privateDateState, privateDateTimeState, privateTimeState };
}
