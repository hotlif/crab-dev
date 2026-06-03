import type { FC, ReactNode, SVGProps } from "react";

const baseSvgProps: SVGProps<SVGSVGElement> = {
    xmlns: "http://www.w3.org/2000/svg",
    width: 16,
    height: 16,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": true,
    focusable: false,
};

const Svg: FC<{ children: ReactNode }> = ({ children }) => (
    <svg {...baseSvgProps}>{children}</svg>
);

/** 菜单：三条等距横线 */
export const MenuIcon: FC = () => (
    <Svg>
        <path d="M4 7h16" />
        <path d="M4 12h16" />
        <path d="M4 17h16" />
    </Svg>
);

/** 通知：钟身 + 钟舌 */
export const BellIcon: FC = () => (
    <Svg>
        <path d="M6 8a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" />
        <path d="M10.5 18a1.8 1.8 0 0 0 3 0" />
    </Svg>
);

/** 进入全屏:四角向外 */
export const EnterFullscreenIcon: FC = () => (
    <Svg>
        <path d="M4 9V4h5" />
        <path d="M15 4h5v5" />
        <path d="M20 15v5h-5" />
        <path d="M9 20H4v-5" />
    </Svg>
);

/** 退出全屏:四角向内 */
export const ExitFullscreenIcon: FC = () => (
    <Svg>
        <path d="M9 4v5H4" />
        <path d="M15 4v5h5" />
        <path d="M15 20v-5h5" />
        <path d="M9 20v-5H4" />
    </Svg>
);

/** 切换角色：双人 + 中间双向箭头，强调"切换" */
export const SwitchRoleIcon: FC = () => (
    <Svg>
        <circle cx="7" cy="7" r="2.4" />
        <path d="M3 18a4 4 0 0 1 8 0" />
        <circle cx="17" cy="7" r="2.4" />
        <path d="M13 18a4 4 0 0 1 8 0" />
        <path d="M8.5 13h7" />
        <path d="M10 11.5l-1.5 1.5 1.5 1.5" />
        <path d="M14 14.5l1.5-1.5-1.5-1.5" />
    </Svg>
);

/** 退出登录：门框 + 向外箭头 */
export const LogoutIcon: FC = () => (
    <Svg>
        <path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" />
        <path d="M15 8l4 4-4 4" />
        <path d="M19 12H9" />
    </Svg>
);

/** 关闭：标准 × */
export const CloseIcon: FC = () => (
    <Svg>
        <path d="M6 6l12 12" />
        <path d="M18 6L6 18" />
    </Svg>
);

/** 关闭其他：中间标签保留，左右两侧各一个 × */
export const CloseOthersIcon: FC = () => (
    <Svg>
        <path d="M3 9l3 3" />
        <path d="M6 9l-3 3" />
        <rect x="9" y="6" width="6" height="12" rx="1" />
        <path d="M18 9l3 3" />
        <path d="M21 9l-3 3" />
    </Svg>
);

/** 关闭右侧：左侧标签保留，右侧大 × 关掉余下标签 */
export const CloseRightIcon: FC = () => (
    <Svg>
        <rect x="3" y="7" width="7" height="10" rx="1" />
        <path d="M13 8l8 8" />
        <path d="M21 8l-8 8" />
    </Svg>
);

/** 关闭全部：堆叠的两个 tab + 右上角 × —— "把整摞标签一起关掉" */
export const CloseAllIcon: FC = () => (
    <Svg>
        <rect x="3" y="7" width="11" height="11" rx="1.5" />
        <path d="M7 4h9a2 2 0 0 1 2 2v8" />
        <path d="M16 16l5 5" />
        <path d="M21 16l-5 5" />
    </Svg>
);

/** 重新加载：顺时针环形箭头 */
export const ReloadIcon: FC = () => (
    <Svg>
        <path d="M21 12a9 9 0 1 1-3.51-7.13" />
        <path d="M21 4v5h-5" />
    </Svg>
);
