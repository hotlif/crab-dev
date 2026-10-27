import { useState } from 'react';
import { css } from '@crab-dev/css';
import Button from '@crab-dev/rc-button';
import LineEdit from '@crab-dev/rc-line-edit';
import Form, { Item, useForm, type FieldAdapter } from '@crab-dev/rc-form';
import token from '@crab-dev/rc-token-semantic';

export const meta = {
    title: '字段状态与显式适配',
    description: '对照禁用、只读、原生值、原生勾选和类型化自定义协议；原生字段保留浏览器外观。',
};

const layout = css`
    display: grid;
    gap: ${token.space['section-gap']};
    max-width: calc(${token.size['40']} * 14);
    min-width: 0;
`;

interface PayloadEditorProps {
    content?: string;
    onCommit?: (payload: { text: string }) => void;
    id?: string;
    name?: string;
    disabled?: boolean;
    readOnly?: boolean;
    'aria-invalid'?: boolean;
    'aria-describedby'?: string;
    'aria-busy'?: boolean;
}

const payloadAdapter: FieldAdapter<string, PayloadEditorProps, [{ text: string }]> = {
    valueProp: 'content',
    changeProp: 'onCommit',
    getValue: payload => payload.text,
    getValueProps: content => ({ content: content ?? '' }),
};

function PayloadEditor({ content, onCommit, ...field }: PayloadEditorProps) {
    return <LineEdit {...field} value={content} onValueChange={text => onCommit?.({ text })} />;
}

interface ExampleValues {
    disabledName: string;
    readonlyName: string;
    nativeName: string;
    nativeAccepted: boolean;
    customName: string;
}

export default function VisualStatesDemo() {
    const [form] = useForm<ExampleValues>();
    const [lastChange, setLastChange] = useState('尚未修改字段。');

    return <section className={layout} aria-label="表单状态与适配器">
        <Form form={form} defaultValue={{
            disabledName: '锁定工作区',
            readonlyName: '归档工作区',
            nativeName: '原生文本字段',
            nativeAccepted: true,
            customName: '自定义协议字段',
        }} onFieldValueChange={change => setLastChange(JSON.stringify(change))}>
            <Item name="disabledName" label="禁用工作区" labelPlacement="control" disabled data-demo-state="disabled">
                <LineEdit />
            </Item>
            <Item name="readonlyName" label="只读工作区" labelPlacement="control" readOnly supportingText="只读内容仍可选择和复制。" data-demo-state="readonly">
                <LineEdit />
            </Item>
            <Item name="nativeName" label="原生名称" adapter="native" data-demo-state="native">
                <input type="text" />
            </Item>
            <Item name="nativeAccepted" label="接收原生通知" adapter="nativeChecked" data-demo-state="native-checked">
                <input type="checkbox" />
            </Item>
            <Item name="customName" label="自定义名称" adapter={payloadAdapter} data-demo-state="custom-adapter">
                <PayloadEditor />
            </Item>
        </Form>
        <Button type="button" onClick={async () => {
            await form.resetFields();
            setLastChange('字段已重置。');
        }}>重置字段</Button>
        <output aria-live="polite">{lastChange}</output>
    </section>;
}
