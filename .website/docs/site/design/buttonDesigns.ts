import type { DesignSystem } from "@crab-dev/rc-token-semantic";

// Copy for the documentation prototype follows the selected design system.
export const buttonDesigns = {
    md3: {
        save: "保存配置", busy: "保存中", retry: "重新保存",
        specimenAction: "校验配置",
        stateNote: "悬停状态层为 8%，焦点和按压为 10%。按下、松开和切换选中时，圆角与按钮边界保持稳定。",
        motion: "按住时显示状态层，松手后可见涟漪。选择成功或失败片段，体验加载和结果反馈。",
        formTitle: "操作员偏好", prototype: "在工作区配置中试用按钮，观察按压反馈、等待时的宽度和失败后的恢复方式。",
        scenario: "修改操作员名称和启动视图，观察草稿何时成为当前配置。",
        observation: "保存期间按钮保持原宽。失败后草稿保留，再次保存即可重试。",
    },
    macos: {
        save: "存储", busy: "存储", retry: "存储",
        specimenAction: "应用设置",
        stateNote: "默认按钮以着色表示优先级。按住时表面变暗，轮廓保持稳定。存储中保留操作标题。",
        motion: "按住时表面压暗，松手后边缘高光消退。等待期间保留按钮标题，在文字前显示进度。",
        formTitle: "个人资料设置", prototype: "在紧凑的操作栏中比较普通按钮和着色默认按钮。",
        scenario: "在设置面板中修改显示名称，使用右下角的默认动作存储。",
        observation: "存储时保留按钮标题，进度显示在标题前。在表单内按 ⌘ S 也能存储或重试。",
    },
    shadcn: {
        save: "保存更改", busy: "提交中", retry: "重试",
        specimenAction: "应用筛选",
        stateNote: "实心与描边区分操作层级。按下时由填色和边缘反馈表达状态，按钮边界保持稳定。",
        motion: "按下时改变填色，松手后边缘反馈淡出。等待用三点轮替，失败时同一按钮切换为重试。",
        formTitle: "账户资料", prototype: "比较实心主按钮与轻量次操作，检查描边与键盘焦点。",
        scenario: "在账户设置卡中保存更改，直接从卡片底部的错误提示重试。",
        observation: "提交失败时，卡片底部同时显示错误提示和“重试”按钮，保留已经输入的名称。",
    },
} as const satisfies Record<DesignSystem, {
    save: string; busy: string; retry: string; formTitle: string; prototype: string; scenario: string; observation: string; motion: string;
    specimenAction: string; stateNote: string;
}>;
