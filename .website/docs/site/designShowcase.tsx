import { css } from "@crab-dev/css";
import { use, useId, useRef, useState } from "react";
import type { RefObject } from "react";
import ConfigProvider from "@crab-dev/rc-config-provider";
import Button from "@crab-dev/rc-button";
import Card from "@crab-dev/rc-card";
import Checkbox from "@crab-dev/rc-checkbox";
import Radio from "@crab-dev/rc-radio";
import Switch from "@crab-dev/rc-switch";
import Slider from "@crab-dev/rc-slider";
import LineEdit from "@crab-dev/rc-line-edit";
import TextEdit from "@crab-dev/rc-text-edit";
import Select from "@crab-dev/rc-select";
import NumberEdit from "@crab-dev/rc-number-edit";
import Segmented from "@crab-dev/rc-segmented";
import Tabs from "@crab-dev/rc-tabs";
import Pagination from "@crab-dev/rc-pagination";
import Alert from "@crab-dev/rc-alert";
import Tag, { CheckableTag } from "@crab-dev/rc-tag";
import Dialog from "@crab-dev/rc-dialog";
import Drawer from "@crab-dev/rc-drawer";
import DropdownContainer, { useDropdownContext } from "@crab-dev/rc-dropdown-container";
import Menu, { MenuItemType } from "@crab-dev/rc-menu";
import Tooltip from "@crab-dev/rc-tooltip";
import Avatar from "@crab-dev/rc-avatar";
import Badge from "@crab-dev/rc-badge";
import Spin from "@crab-dev/rc-spin";
import { useMessage } from "@crab-dev/rc-message";
import { useNotification } from "@crab-dev/rc-notification";
import token from "@crab-dev/rc-token-semantic";
import globalToken from "@crab-dev/rc-token-global";
import { DocumentDesignContext, isSiteDesign, SITE_DESIGNS, SiteContext } from "./siteContext.js";

const names = { macos: "macOS", material: "Material Design 3", shadcn: "shadcn" };
const stack = css`
    display: grid;
    min-width: 0;
    gap: ${token.space["group-gap"]};
    color: ${token.color.text.primary};
    & h3 { margin: 0; font-size: ${token.font.size.subhead}; font-weight: ${token.font.weight.heading}; }
    & p { margin: 0; color: ${token.color.text.secondary}; }
`;
const row = css`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: ${token.space["section-gap"]};
`;
const fields = css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(min(100%, calc(${token.size[64]} * 3)), 1fr));
    gap: ${token.space["section-gap"]};
    align-items: start;
    & > * { min-width: 0; }
`;
const group = css`
    display: grid;
    gap: ${token.space["section-gap"]};
    border: 0;
    padding: 0;
    margin: 0;
    min-width: 0;
    & > legend { margin-block-end: ${token.space["stack-gap"]}; font-weight: ${token.font.weight.label}; }
`;
const controls = css`
    display: grid;
    gap: ${token.space["stack-gap"]};
    padding: ${token.space["section-gap"]};
    border: ${globalToken.space.px} solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.low};
`;
const popup = css`min-width: calc(${token.size[64]} * 3);`;

function PopupTrigger({ trigger, menuId }: { trigger: RefObject<HTMLSpanElement | null>; menuId: string }) {
    const { refs, state, dispatch } = useDropdownContext<HTMLSpanElement>();
    return <span ref={trigger}><span ref={refs.setReference}>
        <Button appearance="outlined" aria-haspopup="dialog" aria-expanded={state.open} aria-controls={state.open ? menuId : undefined}
            onClick={() => dispatch({ type: "setOpen", payload: !state.open })}
            onKeyDown={event => {
                if (event.key === "ArrowDown") { event.preventDefault(); dispatch({ type: "setOpen", payload: true }); }
            }}>更多操作</Button>
    </span></span>;
}

function PopupOptions({ trigger, menuId }: { trigger: RefObject<HTMLSpanElement | null>; menuId: string }) {
    const { dispatch } = useDropdownContext();
    const close = () => {
        dispatch({ type: "setOpen", payload: false });
        trigger.current?.querySelector("button")?.focus();
    };
    return <div id={menuId} role="dialog" aria-label="项目更多操作" ref={element => { element?.querySelector<HTMLElement>("[data-menu-item]")?.focus(); }}><Menu aria-label="项目操作" className={popup}
        onClick={close}
        onKeyDown={event => { if (event.key === "Escape") { event.preventDefault(); close(); } }}
        items={[{ type: MenuItemType.Item, key: "duplicate", title: "创建副本" },
            { type: MenuItemType.Item, key: "export", title: "导出演示" },
            { type: MenuItemType.Item, key: "archive", title: "归档" }]} /></div>;
}

/** One persistent component tree lets reviewers compare designs without losing input. */
export default function DesignShowcase() {
    const { design, setDesign } = use(DocumentDesignContext);
    const site = use(SiteContext);
    const radioName = useId();
    const menuId = useId();
    // DOM instance used only to restore keyboard focus after closing the popup.
    const dropdownTrigger = useRef<HTMLSpanElement>(null);
    const [open, setOpen] = useState(false);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [saved, setSaved] = useState(false);
    const [favorite, setFavorite] = useState(true);
    const [scale, setScale] = useState(40);
    const [message, messageContext] = useMessage();
    const [notification, notificationContext] = useNotification();
    return <div className={stack}>
        <div className={controls}>
            <Segmented aria-label="对照设计风格" value={design}
                options={SITE_DESIGNS.map(value => ({ value, label: names[value] }))}
                onChange={value => { if (isSiteDesign(value)) setDesign(value); }} />
            <p>先修改项目名称、勾选选项，再切换风格；输入和选择会保留。明暗模式跟随文档站主题菜单。</p>
        </div>
        <ConfigProvider design={design} theme={site?.theme.resolved} className={stack} aria-label="三种风格交互对照">
            <Card title="操作与输入">
                <div className={stack}>
                    <div className={row}>
                        <Button appearance="primary" onClick={() => { setSaved(false); setOpen(true); }}>保存项目</Button>
                        <Button appearance="outlined">次要操作</Button>
                        <Button appearance="text">文字操作</Button>
                        <Button disabled>不可用操作</Button>
                        <Button loading>处理中</Button>
                    </div>
                    <div className={fields}>
                        <LineEdit label="项目名称" defaultValue="设计系统工作区" supportingText="切换风格不会清空输入" allowClear />
                        <LineEdit label="项目标识" defaultValue="" errorText="请输入项目标识" required />
                        <LineEdit label="只读编号" defaultValue="CRAB-001" readOnly />
                        <LineEdit label="归档项目" defaultValue="历史版本" disabled />
                        <Select label="项目阶段" defaultValue="review" options={[
                            { value: "draft", label: "草稿" }, { value: "review", label: "评审中" },
                            { value: "published", label: "已发布" }, { value: "archived", label: "归档（不可选）", disabled: true },
                        ]} />
                        <NumberEdit aria-label="团队人数" defaultValue={8} min={1} max={24} />
                    </div>
                    <TextEdit label="项目说明" defaultValue="记录设计决策与组件行为。" rows={3} />
                </div>
            </Card>
            <Card title="选择与调节">
                <div className={stack}>
                    <fieldset className={group}><legend>多选状态</legend><div className={row}>
                        <Checkbox defaultChecked>已选择</Checkbox><Checkbox>未选择</Checkbox>
                        <Checkbox indeterminate>部分选择</Checkbox><Checkbox disabled>禁用</Checkbox>
                        <Checkbox disabled checked>禁用且选中</Checkbox>
                    </div></fieldset>
                    <fieldset className={group}><legend>发布范围</legend><div className={row}>
                        <Radio name={radioName} value="team" defaultChecked>当前团队</Radio>
                        <Radio name={radioName} value="organization">整个组织</Radio>
                        <Radio name={radioName} value="public" disabled>公开访问</Radio>
                    </div></fieldset>
                    <div className={row}>
                        <Switch defaultChecked>自动保存</Switch><Switch>通知提醒</Switch>
                        <Switch disabled defaultChecked>托管策略</Switch>
                    </div>
                    <Slider aria-label="界面预览缩放" value={scale} onValueChange={setScale} min={0} max={100} />
                </div>
            </Card>
            <Card title="导航与反馈">
                <div className={stack}>
                    <Tabs aria-label="项目详情" defaultActiveKey="overview" items={[
                        { key: "overview", label: "概览", children: "这里展示项目概况。" },
                        { key: "activity", label: "活动", children: "这里展示最近的活动。" },
                        { key: "settings", label: "权限", disabled: true },
                    ]} />
                    <Segmented aria-label="预览设备" defaultValue="desktop" options={[
                        { value: "desktop", label: "桌面" }, { value: "tablet", label: "平板" },
                        { value: "mobile", label: "手机" },
                    ]} />
                    <div className={row}><Tag>默认</Tag><Tag color="primary">进行中</Tag>
                        <Tag color="success">已完成</Tag><Tag color="warning">待检查</Tag><Tag color="error">失败</Tag></div>
                    <div className={row}><CheckableTag checked={favorite} onChange={setFavorite}>关注项目</CheckableTag>
                        <Badge count={3}><Avatar aria-label="设计团队">设</Avatar></Badge>
                        <Avatar shape="square" aria-label="开发团队">开</Avatar>
                        <Badge status="success" text="服务正常" /><Spin size="small" label="正在同步" /></div>
                    <Alert type={saved ? "success" : "info"} showIcon>{saved ? "已完成演示保存。" : "所有演示仅在当前页面内交互。"}</Alert>
                    <Pagination total={60} pageSize={10} />
                </div>
            </Card>
            <Card title="浮层与通知">
                <div className={row}>
                    <Button appearance="outlined" onClick={() => setDrawerOpen(true)}>打开侧边面板</Button>
                    <DropdownContainer overlay={<PopupOptions trigger={dropdownTrigger} menuId={menuId} />}>
                        <PopupTrigger trigger={dropdownTrigger} menuId={menuId} />
                    </DropdownContainer>
                    <Tooltip title="说明会跟随当前主题，并保留键盘焦点入口。"><Button appearance="text">查看说明</Button></Tooltip>
                    <Button appearance="outlined" onClick={() => { message.success("项目已同步"); }}>显示消息</Button>
                    <Button appearance="outlined" onClick={() => { notification.open({ title: "协作更新", description: "设计评审已完成，可以继续下一步。", duration: 6000 }); }}>显示通知</Button>
                </div>
            </Card>
            <Dialog title="保存项目" open={open} onOpenChange={setOpen} onConfirm={() => setSaved(true)}
                i18n={{ confirmText: "保存", cancelText: "取消" }}>
                <p>确认后会更新本页的反馈提示。按 Escape 或取消可返回继续编辑。</p>
            </Dialog>
            <Drawer title="项目设置" open={drawerOpen} onOpenChange={setDrawerOpen} closeLabel="关闭项目设置" shouldResetContent={false}>
                <div className={stack}><LineEdit label="面板草稿" defaultValue="保留这段内容" />
                    <Switch defaultChecked>允许团队协作</Switch></div>
            </Drawer>
            {messageContext}{notificationContext}
        </ConfigProvider>
    </div>;
}
