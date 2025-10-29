/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import { useState } from "react"
import Dialog, { useConfirm } from "../../../src/index";



const paddingTop = css`
	padding-top: 1rem;
`;

const SimpleFrame = () => {
	const [open, setOpen] = useState(false);
	const [shouldResetContent, setShouldResetContent] = useState(true);
	const [dom, confirm] = useConfirm();
	
	return (
		<>
			<button
				onClick={() => {
					setOpen(!open);
				}}
			>
				打开对话框
			</button>
			<button
				onClick={() => {
					confirm({
						title: "系统消息",
						content: "当前用户名不能为空",
						onConfirm: async () => {
							console.log("用户点击了确定")
							return true;
						},
						onCancel: async () => {
							console.log("用户点击了取消")
							return true;
						}
					})
				}}
			>
				打开确认对话框
			</button>
			<div>
				<input
					type="checkbox"
					checked={shouldResetContent}
					onChange={(e) => {
						setShouldResetContent(e.target.checked)
					}}
				/>
				shouldResetContent (关闭对话框时，是否重置内容)
			</div>
			<Dialog
				open={open}
				title="标题"
				onOpenChange={setOpen}
				shouldResetContent={shouldResetContent}
				style={{
					width: 520
				}}
			>
				<div
					style={{
					}}
				>
					<input type="text"  />
				</div>
			</Dialog>
			{dom}
		</>
	)
}

export default SimpleFrame;
