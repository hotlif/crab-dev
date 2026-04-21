/**
 * title = "状态点"
 * description = "以 `status + text` 表达系统或实体的运行状态。`processing` 带脉冲动画。"
 */

import { css } from "@linaria/core";
import Badge from "../../src/index.js";

const StatusDemo = () => {
    return (
        <div
            className={css`
                display: flex;
                flex-direction: column;
                gap: 0.5rem;
            `}
        >
            <Badge status="default" text="未启动" />
            <Badge status="processing" text="处理中" />
            <Badge status="success" text="运行中" />
            <Badge status="warning" text="告警" />
            <Badge status="error" text="故障" />
        </div>
    );
};

export default StatusDemo;
