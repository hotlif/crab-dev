import { useState } from "react";
import Preview from "@crab-dev/rc-component-preview";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-component-preview/css/index.css";
import "@crab-dev/rc-button/css/index.css";
const snippet =
    "const [count, setCount] = useState(0);\n<Button onClick={() => setCount(value => value + 1)}>已点击 {count} 次</Button>";
export default function Example() {
    const [count, setCount] = useState(0);
    return (
        <Preview
            title="计数示例"
            description="点击按钮会让数量加一。"
            sourceCode={snippet}
            defaultExpanded
        >
            <Button onClick={() => setCount((value) => value + 1)}>已点击 {count} 次</Button>
        </Preview>
    );
}
