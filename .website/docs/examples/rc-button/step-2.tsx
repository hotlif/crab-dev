import { useState } from "react";
import Button from "@crab-dev/rc-button";
import "@crab-dev/rc-button/css/index.css";

export default function Example() {
    const [count, setCount] = useState(0);
    const [primary, setPrimary] = useState(true);
    return (
        <>
            <Button
                appearance={primary ? "primary" : "subtle"}
                onClick={() => setCount((value) => value + 1)}
            >
                保存资料
            </Button>
            <p>
                <output aria-live="polite">已保存 {count} 次</output>
            </p>
            <Button onClick={() => setPrimary((value) => !value)}>切换按钮外观</Button>
        </>
    );
}
