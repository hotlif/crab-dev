export const meta = {
    title: "基础用法",
    description: "一个简单的单行文本编辑器",
};

import { useId } from "react";
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
    const fieldId = useId();
    return (
        <div className={wrapperStyle}>
            <div>
                <label htmlFor={`${fieldId}-large`}>大尺寸输入</label>
                <LineEdit id={`${fieldId}-large`} prefix={<Lollipop aria-hidden="true" />} size="large" />
            </div>
            <div>
                <label htmlFor={`${fieldId}-middle`}>中尺寸输入</label>
                <LineEdit id={`${fieldId}-middle`} prefix={<Lollipop aria-hidden="true" />} size="middle" />
            </div>
            <div>
                <label htmlFor={`${fieldId}-small`}>小尺寸输入</label>
                <LineEdit id={`${fieldId}-small`} prefix={<Lollipop aria-hidden="true" />} size="small" />
            </div>
        </div>
    );
};

export default SimpleDemo;
