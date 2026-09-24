import type { FieldChange, FormInstance } from '../types.js';

export function checkFormTypes(form: FormInstance<{ profile: { age: number }; name: string }>, change: FieldChange<{ name: string; age: number }>) {
    form.setFieldValue(['profile', 'age'], 18);
    const age: number | undefined = form.getFieldValue(['profile', 'age']);
    // @ts-expect-error 嵌套字段类型必须与路径匹配。
    form.setFieldValue(['profile', 'age'], '18');
    // @ts-expect-error 不存在的字段不能通过 setter 写入。
    form.setFieldValue('missing', true);
    if (change.name === 'age') {
        const changedAge: number = change.value;
        return changedAge;
    }
    return age;
}
