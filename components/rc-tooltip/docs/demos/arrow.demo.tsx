/**
 * title = "箭头"
 * description = "通过 arrow 属性控制是否显示箭头。"
 */

import Tooltip from "../../src/index.js";

const ArrowDemo = () => {
    return (
        <div style={{ display: 'flex', gap: '16px', padding: '40px' }}>
            <Tooltip title="带箭头">
                <button>默认（带箭头）</button>
            </Tooltip>
            <Tooltip title="无箭头" arrow={false}>
                <button>无箭头</button>
            </Tooltip>
        </div>
    );
};

export default ArrowDemo;
