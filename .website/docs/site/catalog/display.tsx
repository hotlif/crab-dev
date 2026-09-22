import { Box, Check, Label, Line, Window } from "./shapes.js";

export const displayPreviews = {
    "rc-pdf-editor": <Window><Box x={29} y={46} w={34} h={80} tone="soft" /><Box x={36} y={54} w={20} h={25} /><Box x={36} y={87} w={20} h={25} /><Box x={77} y={48} w={88} h={76} /><Line x={90} y={66} w={60} /><Line x={90} y={81} w={44} /><Box x={89} y={96} w={39} h={17} tone="soft" /><Line x={177} y={61} w={27} /><Line x={177} y={78} w={27} /><Label x={190} y={104} tone="brand">PDF</Label></Window>,
    "rc-avatar": <><circle cx={66} cy={73} r={24} className="cc-brand" /><Label x={66} y={79} tone="on-brand">林</Label><circle cx={123} cy={73} r={20} className="cc-soft" /><circle cx={123} cy={67} r={6} className="cc-brand" /><path d="M112 84a11 11 0 0 1 22 0" className="cc-brand" /><Box x={160} y={57} w={32} h={32} tone="muted" /><Label x={176} y={78} tone="on-brand">陈</Label></>,
    "rc-badge": <><Box x={49} y={53} w={48} h={48} tone="soft" /><Box x={81} y={42} w={30} h={22} tone="brand" r={11} /><Label x={96} y={58} tone="on-brand">12</Label><Box x={148} y={53} w={48} h={48} tone="soft" /><circle cx={194} cy={53} r={6} className="cc-brand" /></>,
    "rc-card": <><Box x={47} y={21} w={146} h={112} r={12} /><Box x={57} y={31} w={126} h={40} tone="soft" /><Label x={61} y={93} anchor="start">项目概览</Label><Line x={61} y={112} w={105} /></>,
    "rc-divider": <><Line x={48} y={38} w={144} /><Line x={48} y={54} w={95} /><path d="M35 77h170" className="cc-stroke cc-border" /><Line x={48} y={101} w={144} /><Line x={48} y={117} w={95} /></>,
    "rc-empty": <><path d="m90 46 12-17h36l12 17v35H90z" className="cc-surface" /><path d="M90 48h18l5 10h14l5-10h18" className="cc-stroke cc-border" /><Label y={106}>暂无数据</Label><Label y={131} tone="brand">＋ 创建项目</Label></>,
    "rc-skeleton": <><circle cx={64} cy={48} r={17} className="cc-soft" /><Line x={96} y={42} w={79} tone="border" /><Line x={96} y={57} w={47} tone="border" /><Line x={48} y={85} w={144} tone="border" /><Line x={48} y={103} w={144} tone="border" /><Line x={48} y={121} w={102} tone="border" /></>,
    "rc-tag": <><Box x={32} y={38} w={82} h={32} tone="soft" r={8} /><Label x={73} y={58} tone="brand">设计系统</Label><Box x={124} y={38} w={82} h={32} r={8} /><Label x={165} y={58}>产品设计</Label><Box x={76} y={87} w={88} h={32} tone="soft" r={8} /><Check x={86} y={102} tone="text" /><Label x={130} y={107}>已完成</Label></>,
};

export const feedbackPreviews = {
    "rc-alert": <><Box x={23} y={48} w={194} h={60} tone="soft" /><circle cx={45} cy={69} r={9} className="cc-brand" /><Label x={45} y={74} tone="on-brand">i</Label><Label x={64} y={74} anchor="start" tone="brand">请完善项目信息</Label><Line x={65} y={92} w={124} /></>,
    "rc-dialog": <Window><Box x={36} y={49} w={168} h={73} tone="soft" /><Box x={60} y={52} w={120} h={65} /><Label y={75}>确认此操作？</Label><Box x={125} y={88} w={43} h={21} tone="brand" /><Label x={146} y={103} tone="on-brand">确认</Label><Label x={95} y={103}>取消</Label></Window>,
    "rc-drawer": <Window><Line x={37} y={64} w={56} /><Line x={37} y={81} w={42} /><Box x={111} y={43} w={104} h={88} r={0} /><Label x={123} y={63} anchor="start">编辑详情</Label><Line x={123} y={81} w={76} /><Line x={123} y={96} w={53} /><Box x={163} y={109} w={37} h={14} tone="brand" r={3} /></Window>,
    "rc-dropdown-container": <><Box x={52} y={18} w={136} h={27} /><Label y={37}>更多操作 ⌄</Label><path d="m120 45 0 11" className="cc-stroke cc-border" /><Box x={52} y={57} w={136} h={77} />{["复制链接", "移动项目", "归档项目"].map((label, i) => <Label key={label} x={70} y={78 + i * 22} anchor="start">{label}</Label>)}</>,
    "rc-message": <><Box x={44} y={56} w={152} h={41} /><circle cx={68} cy={76} r={10} className="cc-brand" /><Check x={62} y={77} /><Label x={88} y={81} anchor="start">保存成功</Label></>,
    "rc-notification": <Window><Line x={36} y={100} w={58} /><Line x={36} y={115} w={90} /><Box x={74} y={48} w={132} h={66} /><circle cx={88} cy={66} r={5} className="cc-brand" /><Label x={101} y={71} anchor="start">项目已更新</Label><Line x={86} y={88} w={106} /><Line x={86} y={101} w={68} /></Window>,
    "rc-spin": <><circle cx={120} cy={64} r={22} className="cc-stroke cc-border" /><path d="M120 42a22 22 0 0 1 22 22" className="cc-stroke cc-brand cc-thick" /><Label y={118}>正在加载…</Label></>,
    "rc-tooltip": <><Box x={53} y={30} w={134} h={32} tone="brand" /><path d="m114 61 6 7 6-7" className="cc-brand" /><Label y={52} tone="on-brand">查看完整说明</Label><Box x={76} y={81} w={88} h={33} /><Label y={103}>提示内容</Label></>,
};
