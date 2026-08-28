import { useEffect, useMemo, useState } from "react";
import { useKeyDown } from "../../src/index.js";
export const meta = {
    title: "Use Key Down",
    description: "Use Key Down 示例",
};
const Demo = () => {
    const [keyboardRef] = useKeyDown();
    const [, setVersion] = useState(0);

    useEffect(() => {
        const onKeyActivity = () => {
            setVersion((previous) => previous + 1);
        };

        window.addEventListener("keydown", onKeyActivity);
        window.addEventListener("keyup", onKeyActivity);

        return () => {
            window.removeEventListener("keydown", onKeyActivity);
            window.removeEventListener("keyup", onKeyActivity);
        };
    }, []);

    const info = useMemo(() => {
        const event = keyboardRef.current;
        if (event == null) {
            return "等待按键输入...";
        }

        return `${event.type}: ${event.key}`;
    }, [keyboardRef.current]);

    return (
        <div>
            <p>请按任意按键，观察当前监听结果：</p>
            <strong>{info}</strong>
        </div>
    );
};

export default Demo;
