/**
 * title="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { AiOutlineLock  } from "react-icons/ai";
import LineEdit from "@crab/rc-line-edit";


const LineEditDemo = () => {
	return (
		<>
			<div
                style={{
                    marginTop: "1rem",
                }}
			>
				<label style={{ display: "inline-block", width: 60 }} > large </label>
				<LineEdit prefix={<AiOutlineLock />} size="large" />
			</div>
			<div
                style={{
                    marginTop: "1rem",
                }}
			>
				<label style={{ display: "inline-block", width: 60 }}> middle </label>
				<LineEdit prefix={<AiOutlineLock />} size="middle" />
			</div>
			<div
                style={{
                    marginTop: "1rem",
                }}
			>
				<label style={{ display: "inline-block", width: 60 }}> small </label>
				<LineEdit prefix={<AiOutlineLock />} size="small" />
			</div>
		</>
	)
};

export default LineEditDemo;
