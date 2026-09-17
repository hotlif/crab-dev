import { useState } from "react";
import Tabs from "@crab-dev/rc-tabs";
import Button from "@crab-dev/rc-button";
import Alert from "@crab-dev/rc-alert";
import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import { tutorial as profile } from "../_generated_tutorials/practice-profile.js";
import { tutorial as data } from "../_generated_tutorials/practice-data.js";
import { tutorial as admin } from "../_generated_tutorials/practice-admin.js";
import LiveExample from "./liveExample.js";
import { useSiteHref } from "./siteContext.js";

const layout = css`
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: ${token.space["section-gap"]};
    min-width: 0;
`;
const practices = [profile, data, admin];

export default function PracticeGallery() {
    const href = useSiteHref();
    const [activeKey, setActiveKey] = useState(profile.id);
    return (
        <Tabs
            aria-label="选择实战运行示例"
            activeKey={activeKey}
            onChange={setActiveKey}
            destroyInactiveTabPane
            items={practices.map(tutorial => {
                const step = tutorial.steps.at(-1);
                return {
                    key: tutorial.id,
                    label: tutorial.title,
                    children: (
                        <div className={layout}>
                            <div>
                                <Button appearance="primary" href={href(`learn/${tutorial.id}`)}>
                                    从第一步学习{tutorial.title} →
                                </Button>
                            </div>
                            {step?.preview.kind === "inline" ? (
                                <LiveExample
                                    key={tutorial.id}
                                    title={tutorial.title}
                                    description="这里运行的是实战教程最后一步的同一个组件。切换实战或重置会恢复初始状态。"
                                    sourceCode={step.sourceCode}
                                    load={step.preview.load}
                                />
                            ) : <Alert type="error" title="实战缺少运行入口" aria-label="实战缺少运行入口" />}
                        </div>
                    ),
                };
            })}
        />
    );
}
