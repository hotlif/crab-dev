/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import Form, { DefaultValidations, type ItemEditor, type FormInstance, FieldType, ItemEditorState } from "../../../src/index";
import { type FC, useRef } from "react";


const Input:FC<ItemEditor<string>> = ({
	state,
	value,
	onChangeValue
}) => {
	return (
		<input
			value={value}
			style={{
				width: '100%',
			}}
			onChange={(e) => {
				onChangeValue?.(e.target.value)
			}}
		/>
	)
}

const SimpleFrame = () => {
	const form = useRef<FormInstance>(null);
	return (
		<Form
			className={css`
				gap: 4px;
			`}
			form={form}
			labelClassName={css`
				width: 80px;
				text-align: right;
			`}
			entity={{
				fields: [{
					name: "username",
					label: "用户名",
					type: FieldType.String,
					validation: ["required"]
				}, {
					name: "password",
					label: "密码",
					type: FieldType.String
				}]
			}}
			editors={{
				[FieldType.String]: <Input />
			}}
			validations={DefaultValidations}
			onSubmit={async (param) => {
				console.log("onSubmit", param)
			}}
		>
			<button
				type="button"
				onClick={() => {
					form.current?.setFieldValue("username", "test")
				}}
			>
				点击设置 用户名为 test
			</button>
			<button
				type="button"
				onClick={() => {
					form.current?.setFieldsValue({
						username: `utest [${crypto.randomUUID()}]`,
						password: `ptest [${crypto.randomUUID()}]`
					})
				}}
			>
				点击设置 用户名为 utest, 设置密码为 ptest
			</button>

			<button
				type="submit"
			>
				提交数据
			</button>
		</Form>
	)
};

export default SimpleFrame;
