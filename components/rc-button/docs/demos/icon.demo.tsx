export const meta = {
    title: "图标按钮",
    description: "通过 `icon` 属性设置按钮图标",
};

import { css } from "@crab-dev/css";
import { Lollipop } from 'lucide-react';
import { useId, useState } from "react";
import Button from "../../src/index.js";

const IconDemo = () => {
    const loadingCheckboxId = useId();
    const [isLoading, setIsLoading] = useState(false);
    return (
        <div>
            <div
                className={css`
                    margin-bottom: 1rem;
                `}
            >
                <label htmlFor={loadingCheckboxId}>显示加载状态</label>
                <input
                    id={loadingCheckboxId}
                    type="checkbox"
                    checked={isLoading}
                    onChange={() => setIsLoading(!isLoading)}
                />
            </div>
            <div
                className={css`
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    margin-bottom: 2rem;
                `}
            >
                
                <Button
                    loading={isLoading}
                    icon={<Lollipop />}
                    appearance="primary"
                >
                    primary
                </Button>
                <Button
                    loading={isLoading}
                    icon={<Lollipop />}
                    appearance="subtle"
                >
                    subtle
                </Button>
                <Button
                    loading={isLoading}
                    icon={<Lollipop />}
                    appearance="dashed"
                >
                    dashed
                </Button>
                <Button
                    loading={isLoading}
                    icon={<Lollipop />}
                    appearance="text"
                >
                    text
                </Button>
                <Button
                    loading={isLoading}
                    icon={<Lollipop />}
                    appearance="link"
                >
                    link
                </Button>
            </div>
        </div>
    )
}

export default IconDemo;
