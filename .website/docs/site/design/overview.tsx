import Select from "@crab-dev/rc-select";
import Button from "@crab-dev/rc-button";
import Checkbox from "@crab-dev/rc-checkbox";
import { useConfig } from "@crab-dev/rc-config-provider";
import LineEdit from "@crab-dev/rc-line-edit";
import NumberEdit from "@crab-dev/rc-number-edit";
import Slider from "@crab-dev/rc-slider";
import Radio from "@crab-dev/rc-radio";
import Segmented from "@crab-dev/rc-segmented";
import Switch from "@crab-dev/rc-switch";
import TextEdit from "@crab-dev/rc-text-edit";
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
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <div inert aria-hidden="true"><Switch defaultChecked>自动刷新</Switch></div>
                            <h3>Switch 开关</h3>
                            <p>切换工作区自动刷新，观察即时更新、保存失败和重试。</p>
                            <Button appearance="primary" href={href("design/switch")} iconAfter={<span aria-hidden="true">→</span>}>体验开关原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <div inert aria-hidden="true"><Segmented options={["日", "周", "月"]} aria-label="巡检时间范围" /></div>
                            <h3>Segmented 分段控制器</h3>
                            <p>在巡检记录中切换日、周、月，检查键盘操作和长标签溢出。</p>
                            <Button appearance="primary" href={href("design/segmented")} iconAfter={<span aria-hidden="true">→</span>}>体验分段控制器原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <div inert aria-hidden="true"><TextEdit label="交接备注" rows={2} resize="none" readOnly defaultValue="滤网已清洁。下一班复测入口压差。" /></div>
                            <h3>TextEdit 多行输入框</h3>
                            <p>编写运行交接备注，比较固定高度、自动增长、手动拖拽和长文滚动。</p>
                            <Button appearance="primary" href={href("design/text-edit")} iconAfter={<span aria-hidden="true">→</span>}>体验多行输入框原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <div inert aria-hidden="true"><NumberEdit aria-label="采样频率" defaultValue={2} precision={2} suffix="Hz" readOnly /></div>
                            <h3>NumberEdit 数值输入框</h3>
                            <p>比较数值输入、步进、边界修正和保存。</p>
                            <Button appearance="primary" href={href("design/number-edit")} iconAfter={<span aria-hidden="true">→</span>}>体验数值输入框原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <div inert aria-hidden="true"><Slider aria-label="负载告警阈值" defaultValue={65} /></div>
                            <h3>Slider 滑块</h3>
                            <p>拖动设备负载告警阈值，观察趋势图和实时读值。</p>
                            <Button appearance="primary" href={href("design/slider")} iconAfter={<span aria-hidden="true">→</span>}>体验滑块原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <div inert aria-hidden="true"><Select label="设备类型" placeholder="全部设备" options={[{ value: "pump", label: "离心泵" }]} /></div>
                            <h3>Select 选择器</h3>
                            <p>按设备类型和运行状态筛选台账，试用异步搜索和失败重试。</p>
                            <Button appearance="primary" href={href("design/select")} iconAfter={<span aria-hidden="true">→</span>}>体验选择器原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <div inert aria-hidden="true"><LineEdit label="配置名称" defaultValue="北区输水运行" appearance="outlined" readOnly /></div>
                            <h3>Form 表单</h3>
                            <p>编辑泵站采样配置，试用校验、保存进度和失败恢复。</p>
                            <Button appearance="primary" href={href("design/form")} iconAfter={<span aria-hidden="true">→</span>}>体验表单原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Tabs 页签</h3>
                            <p>核对键盘切换、长标签和面板状态。</p>
                            <Button appearance="primary" href={href("design/tabs")} iconAfter={<span aria-hidden="true">→</span>}>体验页签原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Breadcrumbs 面包屑导航</h3>
                            <p>从记录返回项目并试用紧凑路径。</p>
                            <Button appearance="primary" href={href("design/breadcrumbs")} iconAfter={<span aria-hidden="true">→</span>}>体验面包屑导航原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Pagination 分页</h3>
                            <p>切换每页条数并试用末页回退。</p>
                            <Button appearance="primary" href={href("design/pagination")} iconAfter={<span aria-hidden="true">→</span>}>体验分页原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Tree 树</h3>
                            <p>搜索、预选与打开设备目录。</p>
                            <Button appearance="primary" href={href("design/tree")} iconAfter={<span aria-hidden="true">→</span>}>体验树原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>AppMainLayout 应用主布局</h3>
                            <p>试用侧栏、工作区内容和窄屏导航。</p>
                            <Button appearance="primary" href={href("design/app-main-layout")} iconAfter={<span aria-hidden="true">→</span>}>体验应用主布局原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>SplitPane 分栏</h3>
                            <p>用拖拽、触控和键盘调整列表与详情。</p>
                            <Button appearance="primary" href={href("design/split-pane")} iconAfter={<span aria-hidden="true">→</span>}>体验分栏原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Divider 分隔线</h3>
                            <p>核对分隔的方向、间距和可访问语义。</p>
                            <Button appearance="primary" href={href("design/divider")} iconAfter={<span aria-hidden="true">→</span>}>体验分隔线原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Masonry 瀑布流</h3>
                            <p>查看异步照片、列数和阅读顺序。</p>
                            <Button appearance="primary" href={href("design/masonry")} iconAfter={<span aria-hidden="true">→</span>}>体验瀑布流原型</Button>
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
