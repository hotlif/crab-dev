/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import ScanCode from "../../../src/index";
import { useState } from "react";


const paddingTop = css`
	padding-top: 1rem;
`

const SimpleFrame = () => {
	const [isShow, setIsShow] = useState<boolean>(false);
	return (
		<>
			<button
				onClick={() => {
					setIsShow(!isShow);
				}}
			>
				关闭状态
			</button>

			{isShow ? (
				<ScanCode
					style={{
						height: 600,
						width: 600
					}}
					onScanCode={(result) => {
						alert(result)
						console.log(result)
					}}
				/>
			) : null}
		</>

	)
};

export default SimpleFrame;
