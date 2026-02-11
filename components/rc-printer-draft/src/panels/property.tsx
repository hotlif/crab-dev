import { css } from "@linaria/core";
import type { FC, HTMLAttributes } from "react";

interface PropertyPanelProps extends HTMLAttributes<HTMLDivElement> {

}

const PropertyPanel: FC<PropertyPanelProps> = () => {
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
            `}
        >
            <div
                className={css`
                    padding: 8px 12px;
                    border-bottom: 1px solid #d9d9d9;
                `}
            >
                属性设置
            </div>
            <div
                className={css`
                    padding: 8px 12px;
                `}
            >
            </div>
        </div>
    )
}

export default PropertyPanel;