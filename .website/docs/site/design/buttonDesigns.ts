import type { DesignSystem } from "@crab-dev/rc-token-semantic";

// These are proposals for the documentation prototype, scoped to the selected design.
export const buttonDesigns = {
    md3: {
        save: "保存配置", busy: "保存中", retry: "重新保存",
        motion: "分别点按两边体验按压。选择成功或失败片段后，点任一边可同步比较等待与结果。",
        formTitle: "操作员偏好", prototype: "在工作区配置中试用按钮，比较按压反馈、等待时的宽度和失败后的恢复方式。",
        scenario: "修改操作员名称和启动视图，观察草稿何时成为当前配置。",
        observation: "保存期间按钮保持原宽。失败后草稿保留，再次保存即可重试。",
    },
    macos: {
        save: "存储", busy: "存储", retry: "存储",
        motion: "按住时表面压暗，释放后边缘高光消退。等待期间保留按钮标题，结果图标淡入。",
        formTitle: "个人资料设置", prototype: "在紧凑的操作栏中比较普通按钮和着色默认按钮。",
        scenario: "在设置面板中修改显示名称，使用右下角的默认动作存储。",
        observation: "存储时保留按钮标题，进度显示在标题前。在表单内按 ⌘ S 也能存储或重试。",
    },
    shadcn: {
        save: "保存更改", busy: "提交中", retry: "重试",
        motion: "按住时按钮下沉一像素，松开后归位。等待用三点轮替，结果图标逐笔显现。",
        formTitle: "账户资料", prototype: "比较实心主按钮与轻量次操作，检查描边与键盘焦点。",
        scenario: "在账户设置卡中保存更改，直接从卡片底部的错误提示重试。",
        observation: "提交失败时，卡片底部同时显示错误提示和“重试”按钮，保留已经输入的名称。",
    },
} as const satisfies Record<DesignSystem, {
    save: string; busy: string; retry: string; formTitle: string; prototype: string; scenario: string; observation: string; motion: string;
}>;
