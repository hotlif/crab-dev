/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import Form, { Item, useForm } from "../../../src/index";


const Input = ({
	value,
	onChange
}: any) => {
	return (
		<input
			value={value}
			style={{
				width: "100%"
			}}
			onChange={(e) => {
				onChange?.(e.target.value)
			}}
		/>
	)
}

interface UserInfo {
	username: string,
	password: string
}

const SimpleFrame = () => {
	const [form] = useForm<UserInfo>();
	return (
		<Form
			className={css`
				gap: 4px;
			`}
			form={form}
			onFieldValueChange={async (changed, allValues) => {
				console.log("--------onFieldValueChange Start -------")
				console.log("[changed]: ", changed);
				console.log("[allValues]: ", allValues)
				console.log("--------onFieldValueChange End -------")
			}}
		>
			<Item
				label="用户名"
				name="username"
				required
			>
				<Input />
			</Item>
			<Item
				label="密码"
				name="password"
				required
			>
				<Input />
			</Item>
			<button
				onClick={() => {
					const values = form.getFieldsValue();
					console.log("getFieldsValue", values)
				}}
			>
				getFieldsValue
			</button>
			<button
				onClick={() => {
					const username = form.getFieldValue("username");
					const password = form.getFieldValue("password");
					console.log("getFieldsValue:", "username = " + username, "password = " + password)
				}}
			>
				getFieldValue
			</button>
		</Form>
	)
};

export default SimpleFrame;
