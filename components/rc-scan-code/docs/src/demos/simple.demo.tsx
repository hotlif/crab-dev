/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import ScanCode from "../../../src/index";


const paddingTop = css`
	padding-top: 1rem;
`

const SimpleFrame = () => {
	return (
		<>
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
		</>

	)
};

export default SimpleFrame;
