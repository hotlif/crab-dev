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
			value={value ?? ""}
			style={{
				width: "100%",
				height: 32
			}}
			onChange={(e) => {
				onChange?.(e.target.value)
			}}
		/>
	)
}

interface UserInfo {
	user: {
		username: string,
		password: string
	}
}

const SimpleFrame = () => {
	const [form] = useForm<UserInfo>();
	return (
		<Form
			className={css`
				gap: 4px;
			`}

			defaultValue={{
				user: {
					username: "你好",
					password: "password"
				}
			}}
			form={form}
			onFieldValueChange={async (changed, allValues) => {
				console.log("--------onFieldValueChange Start -------")
				console.log("[changed]: ", changed);
				console.log("[allValues]: ", allValues)
				console.log("--------onFieldValueChange End -------")
			}}
			onSubmitSuccess={async (result) => {
				console.log("this is onSubmitSuccess", result)
			}}
			onSubmitFailed={async (result) => {
				console.log("this is onSubmitFailed", result)
			}}
		>
			<Item
				label="用户"
				name={["user", "username"]}
				required
			>
				<Input />
			</Item>
			<Item
				label="密码"
				name={["user", "password"]}
				required
			>
				<Input />
			</Item>
			<button
				type="button"
				onClick={() => {
					const values = form.getFieldsValue();
					console.log("getFieldsValue", values)
				}}
			>
				getFieldsValue
			</button>
			<button
				type="button"
				onClick={() => {
					const username = form.getFieldValue(["user", "name"]);
					const password = form.getFieldValue(["user", "password"]);
					console.log("getFieldsValue:", "username = " + username, "password = " + password)
				}}
			>
				getFieldValue
			</button>
			<button
				type="button"
				onClick={() => {
					form.setFieldsValue({
						user: {
							username: `username - ${crypto.randomUUID()}`,
							password: `password - ${crypto.randomUUID()}`
						}
					})
				}}
			>
				setFieldsValue
			</button>
			<button
				type="button"
				onClick={() => {
					form.setFieldValue(["user", "username"], crypto.randomUUID())
				}}
			>
				setFieldValue
			</button>

			<button
				type="button"
				onClick={() => {
					form.resetFields()
				}}
			>
				resetFields
			</button>
			
			
			<button
				type="submit"
				onClick={() => {
				}}
			>
				submit
			</button>
		</Form>
	)
};

export default SimpleFrame;
