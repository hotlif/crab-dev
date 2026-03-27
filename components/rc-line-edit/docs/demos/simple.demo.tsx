/**
 * title = "基础用法"
 * description = "一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import { Lollipop } from "lucide-react";
import LineEdit from "../../src/index";

const paddingTop = css`
	padding-top: 1rem;
`;

const SimpleDemo = () => {
	return (
		<>
			<div className={paddingTop}>
				<label> large </label>
				<LineEdit prefix={<Lollipop />} size="large" />
			</div>
			<div className={paddingTop}>
				<label> middle </label>
				<LineEdit prefix={<Lollipop />} size="middle" />
			</div>
			<div className={paddingTop}>
				<label> small </label>
				<LineEdit prefix={<Lollipop />} size="small" />
			</div>
		</>
	);
};

export default SimpleDemo;
