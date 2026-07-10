/**
 * title = "三档尺寸"
 * description = "size 同步缩放内边距 / 圆角 / 标题字号, 与其他组件的尺寸档位对齐。"
 */

import { css } from '@linaria/core';
import Card from '../../src/index.js';

const rowStyle = css`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 16px;

    & > * {
        flex: 1 1 200px;
    }
`;

const SizeDemo = () => {
    return (
        <div className={rowStyle}>
            <Card size="small" variant="outlined" title="Small">
                紧凑列表场景。
            </Card>
            <Card size="middle" variant="outlined" title="Middle">
                默认档位, 适合常规信息卡。
            </Card>
            <Card size="large" variant="outlined" title="Large">
                页面级重点区块。
            </Card>
        </div>
    );
};

export default SizeDemo;
