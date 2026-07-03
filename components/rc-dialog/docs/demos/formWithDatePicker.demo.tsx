
/**
 * title = "表单 + 日期选择器"
 * description = "在对话框中嵌入 rc-form 表单与 rc-date-picker 日期选择器，用对话框的「确定」按钮触发表单校验：校验通过才关闭，失败则保持打开。"
 */

import { css } from "@linaria/core";
import { useState, type FC } from "react";

import Button from "@crab-dev/rc-button";
import LineEdit from "@crab-dev/rc-line-edit";
import { DatePicker } from "@crab-dev/rc-date-picker";
import Form, { Item, useForm } from "@crab-dev/rc-form";
import type { FormItemEditor } from "@crab-dev/rc-form";

import Dialog from "../../src/index.js";

// rc-date-picker 基于 Temporal，直接复用其全局 Temporal 类型。
interface AppointmentForm extends Record<string, unknown> {
    name: string;
    date: Temporal.ZonedDateTime | null;
}

// ---------- 适配器：把 crab-dev 组件包装成 FormItemEditor ----------

const LineEditField: FC<FormItemEditor<string> & { placeholder?: string }> = ({
    value,
    onChange,
    placeholder,
}) => (
    <LineEdit
        value={value ?? ""}
        className={css`width: 100%;`}
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
    />
);

const DatePickerField: FC<FormItemEditor<Temporal.ZonedDateTime | null>> = ({ value, onChange }) => (
    <DatePicker
        value={value ?? null}
        renderDisplayString={(current) => (current ? current.toPlainDate().toString() : "请选择日期")}
        onValueChange={(next) => onChange?.(next)}
    />
);

// ---------- 样式 ----------

const formStyle = css`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 320px;
`;

const FormWithDatePickerDemo = () => {
    const [open, setOpen] = useState(false);
    const [form] = useForm<AppointmentForm>();

    return (
        <>
            <Dialog
                title="预约信息"
                open={open}
                onOpenChange={setOpen}
                onConfirm={async () => {
                    try {
                        const values = await form.validateFields();
                        console.log("[submit:success]", values);
                        return true; // 校验通过 → 关闭对话框
                    } catch (error) {
                        console.warn("[submit:failed]", error);
                        return false; // 校验失败 → 保持打开
                    }
                }}
            >
                <Form
                    className={formStyle}
                    form={form}
                    defaultValue={{ name: "", date: null }}
                >
                    <Item label="姓名" name="name" required>
                        <LineEditField placeholder="请输入姓名" />
                    </Item>
                    <Item label="预约日期" name="date" required>
                        <DatePickerField />
                    </Item>
                </Form>
            </Dialog>
            <Button onClick={() => setOpen(true)}>打开预约对话框</Button>
        </>
    );
};

export default FormWithDatePickerDemo;
