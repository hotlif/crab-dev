/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import { css } from "@linaria/core";
import RcLive from "../../../src/index";



const paddingTop = css`
	padding-top: 1rem;
`

const SimpleFrame = () => {

	return (
		<RcLive
			source={`export default () => (<input type="text" />)`}
			scopes={{
			}}
		/>
	)
};

export default SimpleFrame;
