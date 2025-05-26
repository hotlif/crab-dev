/**
 * label="基础用法"
 * description="一个简单的单行文本编辑器"
 */

import RcLive from "../../../src/index";

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
