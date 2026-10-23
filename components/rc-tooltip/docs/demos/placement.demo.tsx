export const meta = {
    title: "位置",
    description: "支持 12 个弹出方位；窄屏中按钮随容器收缩，提示会根据可用空间自动翻转。",
};

import { css } from "@crab-dev/css";
import Button from "@crab-dev/rc-button";
import token from "@crab-dev/rc-token-semantic";
import Tooltip from "../../src/index.js";

const gridStyle = css`
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: ${token.space["component-gap"]};
    box-sizing: border-box;
    width: 100%;
    max-width: calc(${token.size[64]} * 6);
    margin-inline: auto;
    padding: ${token.space["section-gap"]};
`;

const PlacementDemo = () => {
    return (
        <div className={gridStyle}>
            {/* 第 1 行 */}
            <Tooltip title="top-start" placement="top-start">
                <Button size="small" shouldFitContainer>上左</Button>
            </Tooltip>
            <Tooltip title="top" placement="top">
                <Button size="small" shouldFitContainer>上方</Button>
            </Tooltip>
            <Tooltip title="top-end" placement="top-end">
                <Button size="small" shouldFitContainer>上右</Button>
            </Tooltip>

            {/* 第 2 行 */}
            <Tooltip title="left-start" placement="left-start">
                <Button size="small" shouldFitContainer>左上</Button>
            </Tooltip>
            <span aria-hidden="true" />
            <Tooltip title="right-start" placement="right-start">
                <Button size="small" shouldFitContainer>右上</Button>
            </Tooltip>

            {/* 第 3 行 */}
            <Tooltip title="left" placement="left">
                <Button size="small" shouldFitContainer>左侧</Button>
            </Tooltip>
            <span aria-hidden="true" />
            <Tooltip title="right" placement="right">
                <Button size="small" shouldFitContainer>右侧</Button>
            </Tooltip>

            {/* 第 4 行 */}
            <Tooltip title="left-end" placement="left-end">
                <Button size="small" shouldFitContainer>左下</Button>
            </Tooltip>
            <span aria-hidden="true" />
            <Tooltip title="right-end" placement="right-end">
                <Button size="small" shouldFitContainer>右下</Button>
            </Tooltip>

            {/* 第 5 行 */}
            <Tooltip title="bottom-start" placement="bottom-start">
                <Button size="small" shouldFitContainer>下左</Button>
            </Tooltip>
            <Tooltip title="bottom" placement="bottom">
                <Button size="small" shouldFitContainer>下方</Button>
            </Tooltip>
            <Tooltip title="bottom-end" placement="bottom-end">
                <Button size="small" shouldFitContainer>下右</Button>
            </Tooltip>
        </div>
    );
};

export default PlacementDemo;
