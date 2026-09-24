import DatePicker from '../datePicker/datePicker.js';

export function checkPickerTypes() {
    const field = <DatePicker value={null} name='birthday' onFocus={e => e.currentTarget.select()} panelProps={{ id: 'calendar' }} />;
    // @ts-expect-error 面板草稿不属于选择器公开属性。
    const invalid = <DatePicker value={null} selectValues={[]} />;
    // @ts-expect-error 不允许通过 panelProps 覆盖内部面板实例。
    const invalidPanel = <DatePicker value={null} panelProps={{ instance: { current: null } }} />;
    return { field, invalid, invalidPanel };
}
