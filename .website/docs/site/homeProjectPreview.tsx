import { useId } from "react";
import Avatar from "@crab-dev/rc-avatar";
import Button from "@crab-dev/rc-button";
import Card from "@crab-dev/rc-card";
import Tag from "@crab-dev/rc-tag";
import "@crab-dev/rc-avatar/css/index.css";
import "@crab-dev/rc-button/css/index.css";
import "@crab-dev/rc-card/css/index.css";
import "@crab-dev/rc-tag/css/index.css";
import { useSiteHref } from "./siteContext.js";

/** A read-only project summary assembled from the same public components as the live gallery. */
export default function HomeProjectPreview() {
    const href = useSiteHref();
    const titleId = useId();
    return (
        <section className="crab-home-project" aria-labelledby={titleId}>
            <Card variant="filled" className="crab-home-project-panel">
                <header className="crab-home-project-heading">
                    <div>
                        <p className="crab-home-project-caption">项目概览 · 示例数据</p>
                        <h2 id={titleId}>设计系统迭代</h2>
                    </div>
                    <Tag color="primary" bordered={false}>进行中</Tag>
                </header>
                <dl className="crab-home-project-facts">
                    <div>
                        <dt>负责人</dt>
                        <dd><Avatar size="small" variant="primary" aria-hidden="true">林</Avatar><span>林晓</span></dd>
                    </div>
                    <div><dt>当前阶段</dt><dd>组件交互验收</dd></div>
                    <div><dt>完成情况</dt><dd><strong>3 / 4</strong><span className="crab-home-project-caption">项任务</span></dd></div>
                </dl>
                <footer className="crab-home-project-footer">
                    <p>试用清单、邀请表单与状态反馈。</p>
                    <Button appearance="text" href={href("#first-example")}>体验交互示例 <span aria-hidden="true">↓</span></Button>
                </footer>
            </Card>
        </section>
    );
}
