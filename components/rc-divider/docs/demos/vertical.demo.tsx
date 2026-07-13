/**
 * title = "竖向分割线"
 * description = "direction=vertical 用于行内切分: 按钮组、状态栏、面包屑。高度跟随当前字号。"
 */

import { css } from '@linaria/core';
import Button from '@crab-dev/rc-button';
import Divider from '../../src/index.js';

const rowStyle = css`
    display: flex;
    align-items: center;
`;

const linkRowStyle = css`
    display: flex;
    align-items: center;
    margin-top: 16px;
    color: oklch(0.44 0.01 286);
    font-size: 14px;
`;

const VerticalDemo = () => {
    return (
        <div>
            <div className={rowStyle}>
                <Button appearance="subtle">编辑</Button>
                <Divider direction="vertical" spacing="small" />
                <Button appearance="subtle">复制</Button>
                <Divider direction="vertical" spacing="small" />
                <Button appearance="subtle">删除</Button>
            </div>

            <div className={linkRowStyle}>
                <span>已完成 12 项</span>
                <Divider direction="vertical" spacing="small" />
                <span>进行中 3 项</span>
                <Divider direction="vertical" spacing="small" />
                <span>失败 1 项</span>
            </div>
        </div>
    );
};

export default VerticalDemo;
