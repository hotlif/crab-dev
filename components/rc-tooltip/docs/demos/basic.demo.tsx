/**
 * title = "基础用法"
 * description = "最简单的用法，鼠标悬浮时展示提示文字。"
 */

import Tooltip from "../../src/index.js";

const BasicDemo = () => {
    return (
        <div style={{ display: 'flex', gap: '16px', padding: '40px' }}>
            <Tooltip title="提示文字">
                <button>鼠标悬浮</button>
            </Tooltip>
        </div>
    );
};

export default BasicDemo;
