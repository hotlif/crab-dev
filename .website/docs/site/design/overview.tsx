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
                            <h3>Dialog 对话框</h3>
                            <p>删除确认、编辑和错误恢复。</p>
                            <Button appearance="primary" href={href("design/dialog")} iconAfter={<span aria-hidden="true">→</span>}>体验对话框原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>DropdownContainer 浮层容器</h3>
                            <p>测试视口边缘、碰撞和关闭。</p>
                            <Button appearance="primary" href={href("design/dropdown-container")} iconAfter={<span aria-hidden="true">→</span>}>体验浮层容器原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Menu 菜单</h3>
                            <p>分组命令、权限和下级菜单。</p>
                            <Button appearance="primary" href={href("design/menu")} iconAfter={<span aria-hidden="true">→</span>}>体验菜单原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Drawer 抽屉</h3>
                            <p>查看设备详情并保护未保存备注。</p>
                            <Button appearance="primary" href={href("design/drawer")} iconAfter={<span aria-hidden="true">→</span>}>体验抽屉原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>DatePicker 日期选择器</h3>
                            <p>选择报告日期和统计区间，试用日历操作、手输与地区格式。</p>
                            <Button appearance="primary" href={href("design/date-picker")} iconAfter={<span aria-hidden="true">→</span>}>体验日期选择器原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>ColorPicker 取色器</h3>
                            <p>切换预设、输入颜色并核对浅色和深色图表。</p>
                            <Button appearance="primary" href={href("design/color-picker")} iconAfter={<span aria-hidden="true">→</span>}>体验取色器原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>CronPicker 定时表达式</h3>
                            <p>配置工作日计划并查看下一次预估执行。</p>
                            <Button appearance="primary" href={href("design/cron-picker")} iconAfter={<span aria-hidden="true">→</span>}>体验定时表达式原型</Button>
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
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Alert 页内警告</h3>
                            <p>恢复导出权限错误，检查可关闭警告。</p>
                            <Button appearance="primary" href={href("design/alert")} iconAfter={<span aria-hidden="true">→</span>}>体验页内警告原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Message 短时反馈</h3>
                            <p>连续触发保存与复制，检查排队、合并和暂停。</p>
                            <Button appearance="primary" href={href("design/message")} iconAfter={<span aria-hidden="true">→</span>}>体验短时反馈原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Notification 持久通知</h3>
                            <p>核对后台任务、通知堆叠和失败重试。</p>
                            <Button appearance="primary" href={href("design/notification")} iconAfter={<span aria-hidden="true">→</span>}>体验持久通知原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Tooltip 辅助提示</h3>
                            <p>对比鼠标、键盘和触屏取得说明的方式。</p>
                            <Button appearance="primary" href={href("design/tooltip")} iconAfter={<span aria-hidden="true">→</span>}>体验辅助提示原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Empty 空状态</h3>
                            <p>分别恢复空项目、搜索无匹配与请求失败后的设备列表。</p>
                            <Button appearance="primary" href={href("design/empty")} iconAfter={<span aria-hidden="true">→</span>}>体验空状态原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Spin 等待反馈</h3>
                            <p>比较快慢请求、按钮和局部等待、整页等待以及取消后的焦点。</p>
                            <Button appearance="primary" href={href("design/spin")} iconAfter={<span aria-hidden="true">→</span>}>体验等待反馈原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Skeleton 骨架屏</h3>
                            <p>体验首次加载、旧数据刷新、空结果和读取失败，检查列表几何过渡。</p>
                            <Button appearance="primary" href={href("design/skeleton")} iconAfter={<span aria-hidden="true">→</span>}>体验骨架屏原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Avatar 成员头像</h3>
                            <p>在操作员列表切换照片、姓名首字和失败回退，试用紧凑尺寸和成员组。</p>
                            <Button appearance="primary" href={href("design/avatar")} iconAfter={<span aria-hidden="true">→</span>}>体验成员头像原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Badge 角标</h3>
                            <p>切换未读计数、零值和溢出，并比对任务名称与设备状态点。</p>
                            <Button appearance="primary" href={href("design/badge")} iconAfter={<span aria-hidden="true">→</span>}>体验角标原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Card 内容卡片</h3>
                            <p>比较纯信息卡、单一入口卡与含多项动作的设备卡。</p>
                            <Button appearance="primary" href={href("design/card")} iconAfter={<span aria-hidden="true">→</span>}>体验内容卡片原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Prose 长文排版</h3>
                            <p>用巡检手册查看字号、章节结构和窄屏可滚动内容。</p>
                            <Button appearance="primary" href={href("design/prose")} iconAfter={<span aria-hidden="true">→</span>}>体验长文排版原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Tag 状态与筛选标签</h3>
                            <p>对比只读状态、复选条件和可移除筛选，验证连续键盘操作。</p>
                            <Button appearance="primary" href={href("design/tag")} iconAfter={<span aria-hidden="true">→</span>}>体验状态与筛选标签原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Table 基础数据表格</h3>
                            <p>在巡检清单体验列排序、行选中、备注编辑和请求状态。</p>
                            <Button appearance="primary" href={href("design/table")} iconAfter={<span aria-hidden="true">→</span>}>体验基础数据表格原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>TablePro 跨页数据工作流</h3>
                            <p>使用搜索、列设置、筛选、跨页选择和批量复核。</p>
                            <Button appearance="primary" href={href("design/table-pro")} iconAfter={<span aria-hidden="true">→</span>}>体验跨页数据工作流原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>BarChart 柱状图读值</h3>
                            <p>对照长标签、零值、班次图例和接口异常后的读值。</p>
                            <Button appearance="primary" href={href("design/bar-chart")} iconAfter={<span aria-hidden="true">→</span>}>体验柱状图读值原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>Canvas 工程画布</h3>
                            <p>试用工程设备画布的浏览、缩放、选择、空白和异常恢复。</p>
                            <Button appearance="primary" href={href("design/canvas")} iconAfter={<span aria-hidden="true">→</span>}>体验工程画布原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>FlowDiagram 节点与连线</h3>
                            <p>在小型设备流程中测试拖动、连线、无效提示与定位。</p>
                            <Button appearance="primary" href={href("design/flow-diagram")} iconAfter={<span aria-hidden="true">→</span>}>体验节点与连线原型</Button>
                        </div>
                    </div>
                    <div className="crab-design-card">
                        <div className="crab-design-card-body">
                            <h3>PdfEditor 文档编辑器</h3>
                            <p>在真实 PDF 示例中验证浏览、编辑、未保存保护与导出重试。</p>
                            <Button appearance="primary" href={href("design/pdf-editor")} iconAfter={<span aria-hidden="true">→</span>}>体验文档编辑器原型</Button>
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
