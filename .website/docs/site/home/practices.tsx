import Button from "@crab-dev/rc-button";
import { sourceCode } from "../../_generated_tutorials/home.js";
import LiveExample from "../liveExample.js";
import type { HomeSectionProps } from "./hero.js";

const loadProfile = () => import("../../examples/home/profile.js");

const practices = [
    { number: "01", title: "资料编辑表单", detail: "从输入校验到异步保存", slug: "practice-profile", components: "Form · LineEdit · Button" },
    { number: "02", title: "数据管理列表", detail: "连接搜索、分页与状态反馈", slug: "practice-data", components: "Table · Pagination · Empty" },
    { number: "03", title: "后台管理页面", detail: "组织导航、内容与编辑流程", slug: "practice-admin", components: "Tabs · Drawer · Form" },
] as const;

export default function HomePractices({ href }: HomeSectionProps) {
    return <>
            <section className="crab-home-section" id="practice" aria-labelledby="practice-title">
                <header className="crab-home-section-heading">
                    <div><span className="crab-home-eyebrow">业务实战</span><h2 id="practice-title">把组件组合成完整流程。</h2></div>
                    <p className="crab-home-secondary">从一个场景进入，跟随步骤完成可运行的界面。</p>
                </header>
                <div className="crab-home-practices">
                    {practices.map((practice) => (
                        <article key={practice.slug}>
                            <span className="crab-home-practice-number">{practice.number}</span>
                            <div><h3>{practice.title}</h3><p>{practice.detail}</p><span className="crab-home-practice-components">{practice.components}</span></div>
                            <Button appearance="text" href={href(`learn/${practice.slug}`)} aria-label={`开始实战：${practice.title}`}><span aria-hidden="true">→</span></Button>
                        </article>
                    ))}
                </div>
            </section>

            <section className="crab-home-section crab-home-showcase" id="first-example" aria-labelledby="showcase-title">
                <header className="crab-home-section-heading">
                    <div><span className="crab-home-eyebrow">在线实战</span><h2 id="showcase-title">先试用，再读实现。</h2></div>
                    <p className="crab-home-secondary">完成邀请表单，再展开源码理解组件如何协作。</p>
                </header>
                <LiveExample title="组件，自然组合。" heading="outside" density="regular" sourceCode={sourceCode} load={loadProfile} />
            </section>

    </>;
}
