import { useEffect, useRef, useState } from "react";
import Avatar, { AvatarGroup } from "@crab-dev/rc-avatar";
import Button from "@crab-dev/rc-button";
import { useConfig } from "@crab-dev/rc-config-provider";
import { useSiteHref } from "../siteContext.js";
import { ContentPrototype } from "./contentPrototype.js";

const roster = [
    { id: "op-01", name: "林月", role: "当班负责人", initials: "林" },
    { id: "op-02", name: "周晨", role: "远程巡检", initials: "周" },
    { id: "op-03", name: "司徒予宁", role: "进水工段仪表复核", initials: "司" },
    { id: "op-04", name: "Sam Rivera", role: "夜班设备值守", initials: "SR" },
];
const brokenPhoto = "data:image/png;base64,broken";
type PhotoMode = "portrait" | "initials" | "failed";

export default function AvatarPrototype() {
    const { designSystem } = useConfig();
    const href = useSiteHref();
    const [dense, setDense] = useState(designSystem === "macos");
    const [photo, setPhoto] = useState<PhotoMode>("portrait");
    const [expanded, setExpanded] = useState(false);
    const details = useRef<HTMLHeadingElement>(null);
    const group = useRef<HTMLDivElement>(null);
    const portrait = href("prototype-assets/operations-lead.png");
    const size = dense ? "small" : "medium";
    const shape = designSystem === "shadcn" ? "square" : "circle";
    const rosterRows = expanded ? roster : roster.slice(0, 2);

    useEffect(() => {
        if (expanded) details.current?.focus({ preventScroll: true });
    }, [expanded]);

    function closeRoster() {
        setExpanded(false);
        group.current?.querySelector("button")?.focus({ preventScroll: true });
    }

    return <ContentPrototype route="avatar" title="Avatar 成员头像" description="对照照片、姓名首字和加载失败，核对密集的操作员列表。"
        scene="北区泵站当班人员" rules={[
            ["辨识顺序", "照片可用时显示照片。未上传或加载失败时回退到姓名首字。完整姓名与职责持续显示。"],
            ["尺寸与密度", "同一行的照片和回退内容用相同宽高。紧凑模式只减少间距和头像尺寸，长姓名可以换行。"],
            ["键盘与名称", "列表中的头像和旁边姓名只播报一遍。成员组的额外人数可通过键盘展开，收起后焦点返回入口。"],
            ["主题差异", "MD3 圆形头像使用语义色回退，macOS 圆头像配紧凑人物栏，shadcn/ui 用圆角方形适应工作区列表。"],
        ]}>
        <div className="crab-content-actions">
            <Button size="s" appearance={photo === "portrait" ? "tonal" : "text"} aria-pressed={photo === "portrait"} onClick={() => setPhoto("portrait")}>正常照片</Button>
            <Button size="s" appearance={photo === "initials" ? "tonal" : "text"} aria-pressed={photo === "initials"} onClick={() => setPhoto("initials")}>未上传照片</Button>
            <Button size="s" appearance={photo === "failed" ? "tonal" : "text"} aria-pressed={photo === "failed"} onClick={() => setPhoto("failed")}>模拟图片失败</Button>
            <Button size="s" appearance="outlined" aria-pressed={dense} onClick={() => setDense(!dense)}>密集显示</Button>
        </div>
        <div ref={group} className="crab-content-actions">
            <AvatarGroup size={size} shape={shape} max={2} aria-label="当班成员概览" onExtraClick={() => {
                if (expanded) details.current?.focus({ preventScroll: true });
                else setExpanded(true);
            }}>
                {roster.map(member => <Avatar key={member.id} aria-label={member.name}
                    src={member.id === "op-01" && photo === "portrait" ? portrait : undefined}>{member.initials}</Avatar>)}
            </AvatarGroup>
            <span className="crab-content-caption">当班 {roster.length} 人</span>
        </div>
        <div className="crab-content-region">
            <h3 tabIndex={-1} ref={details} data-content-focus>{expanded ? "全部当班人员" : "当前岗位"}</h3>
            <ul className="crab-content-roster" role="list" aria-label="操作员列表" data-dense={dense}>
                {rosterRows.map((member) => <li key={member.id} data-member-id={member.id}>
                    <Avatar aria-hidden="true" data-roster-avatar size={size} shape={shape} bordered={designSystem !== "md3"}
                        variant={member.id === "op-01" ? "primary" : "default"}
                        src={member.id === "op-01" ? photo === "portrait" ? portrait : photo === "failed" ? brokenPhoto : undefined : undefined}
                        alt="">{member.initials}</Avatar>
                    <div><strong>{member.name}</strong><span className="crab-content-caption">{member.role}</span></div>
                </li>)}
            </ul>
            {expanded && <Button appearance="text" size="s" onClick={closeRoster}>收起当班名单</Button>}
        </div>
    </ContentPrototype>;
}
