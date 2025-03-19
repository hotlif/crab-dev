/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import { AiOutlineLock  } from "react-icons/ai";
import LineEdit from "../../../src/index";


const paddingTop = css`
	padding-top: 1rem;
`

const SimpleFrame = () => {
	return (
		<>
			<div
				className={paddingTop}
			>
				<label> large </label>
				<LineEdit prefix={<AiOutlineLock />} size="large" />
			</div>
			<div
				className={paddingTop}
			>
				<label> middle </label>
				<LineEdit prefix={<AiOutlineLock />} size="middle" />
			</div>
			<div
				className={paddingTop}
			>
				<label> small </label>
				<LineEdit prefix={<AiOutlineLock />} size="small" />
			</div>
		</>
	)
};

export default SimpleFrame;
