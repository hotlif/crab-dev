import Button from "@crab-dev/rc-button";
import Checkbox from "@crab-dev/rc-checkbox";
import { useConfig } from "@crab-dev/rc-config-provider";
import LineEdit from "@crab-dev/rc-line-edit";
import Radio from "@crab-dev/rc-radio";
import SiteIcon from "../siteIcon.js";
import { useSiteHref } from "../siteContext.js";
import { DesignHero } from "./hero.js";
import { buttonDesigns } from "./buttonDesigns.js";

const guides = [
    { title: "三套设计体系", summary: "比较各体系的视觉与交互约定", path: "design-styles", icon: "design" },
    { title: "尺寸与密度", summary: "查阅控件高度、间距与触控区域", path: "component-sizing", icon: "tools" },
    { title: "设计体系覆盖矩阵", summary: "核对各组件的设计覆盖情况", path: "design-coverage", icon: "start" },
] as const;

export default function DesignOverview() {
    const href = useSiteHref();
    const { designSystem } = useConfig();
    const design = buttonDesigns[designSystem];
    const engineering = designSystem === "md3";
    return <div className="crab-design-workspace" data-prototype-design={designSystem}>
        <DesignHero title="设计" description={engineering ? "在工作区配置中检验操作层级、键盘焦点和异步反馈。" : "查阅设计基础，在应用场景中试用组件原型。"} />
        <div className="crab-design-body">
            <div className="crab-design-pair">
                <section>
                    <h2>组件原型</h2>
                    <div className="crab-design-card">
                        {engineering ? <div className="crab-design-overview-sample" inert aria-hidden="true">
                            <strong>工作区配置</strong><div><Button appearance="outlined">还原修改</Button><Button appearance="primary">保存配置</Button></div>
                        </div> : <div className="crab-design-button-art" aria-hidden="true">
                            {designSystem === "macos" && <span className="crab-design-art-secondary">取消</span>}
                            <span>{design.save}</span>
                            {designSystem === "shadcn" && <span className="crab-design-art-secondary">取消</span>}
                        </div>}
                        <div className="crab-design-card-body">
                            <div className="crab-design-title"><h3>Button 按钮</h3><span className="crab-design-status">探索中</span></div>
                            <p>{design.prototype}</p>
                            <Button appearance="primary" href={href("design/button")} iconAfter={<span aria-hidden="true">→</span>}>体验按钮原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <div inert aria-hidden="true">
                                <LineEdit label="工作区名称" defaultValue="北区巡检工作区" readOnly
                                    appearance="outlined" size={designSystem === "macos" ? "small" : "medium"} />
                            </div>
                            <h3>LineEdit 单行输入框</h3>
                            <p>编辑工作区名称，试用清除、必填校验和错误反馈。</p>
                            <Button appearance="primary" href={href("design/line-edit")} iconAfter={<span aria-hidden="true">→</span>}>体验输入框原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <div inert aria-hidden="true"><Checkbox indeterminate>全选可导出任务</Checkbox></div>
                            <h3>Checkbox 复选框</h3>
                            <p>勾选导出项目，试用全选、部分选中和禁用状态。</p>
                            <Button appearance="primary" href={href("design/checkbox")} iconAfter={<span aria-hidden="true">→</span>}>体验复选框原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <div inert aria-hidden="true"><Radio defaultChecked>恢复上次会话</Radio></div>
                            <h3>Radio 单选框</h3>
                            <p>选择工作区的启动方式，试用默认项、权限禁用和必填校验。</p>
                            <Button appearance="primary" href={href("design/radio")} iconAfter={<span aria-hidden="true">→</span>}>体验单选框原型</Button>
                        </div>
                    </div>
                </section>
                <section>
                    <h2>应用场景</h2>
                    <div className="crab-design-card">
                        <div className="crab-design-flow" aria-hidden="true">
                            {engineering && <dl className="crab-design-overview-readout"><dt>操作员</dt><dd>林月</dd><dt>启动视图</dt><dd>项目总览</dd></dl>}
                            {designSystem === "macos" && <div className="crab-design-scene-sample"><strong>个人资料设置</strong><div>显示名称 <b>林悦</b></div><kbd>⌘ S</kbd></div>}
                            {designSystem === "shadcn" && <div className="crab-design-scene-sample"><strong>账户资料</strong><div>保存失败，修改已保留。<b>重试</b></div></div>}
                        </div>
                        <div className="crab-design-card-body">
                            <h3>{engineering ? "保存工作区配置" : "保存个人资料"}</h3>
                            <p>{design.scenario}</p>
                            <Button appearance="text" href={href("design/save-profile")} iconAfter={<span aria-hidden="true">→</span>}>进入保存场景</Button>
                        </div>
                    </div>
                </section>
            </div>
            <section>
                <h2>设计基础</h2>
                <div className="crab-design-guides">{guides.map(guide => <a href={href("guides/" + guide.path)} key={guide.path}>
                    <SiteIcon name={guide.icon} /><div><strong>{guide.title}</strong><p>{guide.summary}</p></div><span aria-hidden="true">→</span>
                </a>)}</div>
            </section>
        </div>
    </div>;
}
