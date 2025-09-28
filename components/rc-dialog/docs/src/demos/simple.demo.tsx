/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import { useState } from "react"
import Dialog from "../../../src/index";



const paddingTop = css`
	padding-top: 1rem;
`;

const SimpleFrame = () => {
	const [open, setOpen] = useState(false);
	return (
		<>
			<button
				onClick={() => {
					setOpen(!open);
				}}
			>
				打开对话框
			</button>
			<Dialog
				open={open}
				title="标题"
				onOpenChange={setOpen}
			>
				这是一个弹出框的内容
			</Dialog>
		</>
	)
}

export default SimpleFrame;
