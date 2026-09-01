export const meta = {
    title: "基础用法",
    description: "一个简单的单行文本编辑器",
};

import { css } from "@crab-dev/css";
import { Lollipop } from "lucide-react";
import LineEdit from "../../src/index.js";

const wrapperStyle = css`
	padding: 1rem;
	display: flex;
	flex-direction: column;
	gap: 1rem;
`;

const SimpleDemo = () => {
    return (
        <div className={wrapperStyle}>
            <div>
                <label> large </label>
                <LineEdit prefix={<Lollipop />} size="large" />
            </div>
            <div>
                <label> middle </label>
                <LineEdit prefix={<Lollipop />} size="middle" />
            </div>
            <div>
                <label> small </label>
                <LineEdit prefix={<Lollipop />} size="small" />
            </div>
        </div>
    );
};

export default SimpleDemo;
