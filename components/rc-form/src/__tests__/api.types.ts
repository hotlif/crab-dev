import type { FieldChange, FormInstance } from '../types.js';
import type { FormItemProps } from '../item.js';
import type { FieldAdapter } from '../field-adapters.js';

type AmountEditor = { amount?: number; onAmountChange?: (next: { amount: number }) => void };
export const amountAdapter: FieldAdapter<number, AmountEditor, [{ amount: number }]> = {
    valueProp: 'amount', changeProp: 'onAmountChange',
    getValue: next => next.amount,
    getValueProps: amount => ({ amount }),
};
export const customAdapterItem: FormItemProps = { name: 'amount', adapter: amountAdapter };
export const invalidAdapter: FieldAdapter<number, AmountEditor> = {
    // @ts-expect-error A custom adapter must name a real editor property.
    valueProp: 'missing',
    // @ts-expect-error Callback argument types must match the editor's handler.
    changeProp: 'onAmountChange',
    getValue: () => 0, getValueProps: amount => ({ amount }),
};
export const invalidChangeProp: FieldAdapter<number, AmountEditor, [{ amount: number }]> = {
    valueProp: 'amount',
    // @ts-expect-error A value property cannot be used as a callback property.
    changeProp: 'amount',
    getValue: next => next.amount, getValueProps: amount => ({ amount }),
};
export const wrongValueAdapter: FieldAdapter<string, AmountEditor, [{ amount: number }]> = {
    // @ts-expect-error The editor's amount property cannot receive string values.
    valueProp: 'amount', changeProp: 'onAmountChange',
    getValue: next => String(next.amount), getValueProps: () => ({}),
};

export const groupLabelItem: FormItemProps = { name: 'skills', labelPlacement: 'external', labelTarget: 'group', label: '技能' };
// @ts-expect-error 组语义必须显式选择 external，不能依赖默认布局。
export const groupWithoutPlacement: FormItemProps = { name: 'skills', labelTarget: 'group', label: '技能' };
// @ts-expect-error 控件自身标签布局不接受外部组标题语义。
export const groupWithControlPlacement: FormItemProps = { name: 'skills', labelPlacement: 'control', labelTarget: 'group', label: '技能' };
export const controlLabelItem: FormItemProps = { name: 'name', labelPlacement: 'control', label: '姓名' };
// @ts-expect-error 字段组件模式要求可关联的文本标签。
export const missingControlLabelItem: FormItemProps = { name: 'name', labelPlacement: 'control' };

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
