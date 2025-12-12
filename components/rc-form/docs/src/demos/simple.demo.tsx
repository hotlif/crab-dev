/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import Form, { Item, useForm } from "../../../src/index";
import { type FC, useRef } from "react";


const Input = ({
	value,
	onFormItemValueChange
}: any) => {
	return (
		<input
			value={value}
			style={{
				width: "100%"
			}}
			onChange={(e) => {
				onFormItemValueChange?.(e.target.value)
			}}
		/>
	)
}

const SimpleFrame = () => {
	const [form] = useForm();
	return (
		<Form
			className={css`
				gap: 4px;
			`}
			form={form}
		>
			<Item
				name="username"
			>
				<Input />
			</Item>

			<button
				onClick={() => {
					form.setFieldValue("username", crypto.randomUUID());
				}}
			>
				设置 username 值为 test0001
			</button>
		</Form>
	)
};

export default SimpleFrame;
