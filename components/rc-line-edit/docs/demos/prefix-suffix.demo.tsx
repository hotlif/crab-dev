export const meta = {
    title: "前缀和后缀",
    description: "通过 `prefix` 和 `suffix` 属性设置前缀/后缀图标",
};

import { css } from "@crab-dev/css";
import { Search, X } from "lucide-react";
import LineEdit from "../../src/index.js";

const PrefixSuffixDemo = () => {
    return (
        <div
            className={css`
				display: flex;
				flex-direction: column;
				align-items: flex-start;
				gap: 1rem;
				padding: 1rem;
			`}
        >
            <LineEdit prefix={<Search size={16} />} placeholder="搜索" />
            <LineEdit suffix={<X size={16} />} placeholder="可清除" />
            <LineEdit
                prefix={<Search size={16} />}
                suffix={<X size={16} />}
                placeholder="前缀和后缀"
            />
        </div>
    );
};

export default PrefixSuffixDemo;
