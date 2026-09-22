/** Resolved CSS expressions; callers apply themes by overriding existing L2 variables. */
export interface FeedbackColors {
    readonly text: string;
    readonly icon: string;
    readonly border: string;
    readonly background: string;
    readonly backgroundHover: string;
    readonly solid: string;
    readonly solidHover: string;
    readonly solidActive: string;
    readonly onSolid: string;
}

export interface ThemeColors {
    readonly secondary?: AccentColors;
    readonly tertiary?: AccentColors;
    /** Optional for existing custom themes; built-in themes always resolve these roles. */
    readonly surface?: SurfaceColors;
    readonly brandContainer?: BrandContainerColors;
    readonly control: Readonly<Record<"thumb" | "track" | "trackHover", string>>;
    readonly brand: Readonly<Record<"primary" | "hover" | "active" | "subtle", string>>;
    readonly background: Readonly<Record<"surface" | "elevated" | "sunken" | "inverse" | "overlay" | "disabled" | "hoverSubtle" | "activeSubtle" | "selected", string>>;
    readonly text: Readonly<Record<"primary" | "secondary" | "tertiary" | "onBrand" | "inverse" | "disabled" | "link" | "linkHover", string>>;
    readonly border: Readonly<Record<"subtle" | "default" | "hover" | "strong" | "focus" | "error", string>>;
    readonly focusRing: string;
    readonly selection: Readonly<Record<"background" | "border" | "foreground", string>>;
    readonly highlight: Readonly<Record<"background" | "backgroundActive" | "foreground", string>>;
    readonly feedback: Readonly<Record<"error" | "success" | "warning" | "info", FeedbackColors>>;
    readonly fill: Readonly<Record<"subtle" | "default" | "strong" | "translucent" | "inactive" | "active", string>>;
    readonly focusShadow: string;
}

export interface ThemeColorContract {
    readonly light: ThemeColors;
    readonly dark: ThemeColors;
}

export type SurfaceColors = Readonly<Record<'canvas' | 'content' | 'container' | 'raised' | 'overlay', string> & Partial<Record<'lowest' | 'low' | 'high' | 'highest' | 'dim' | 'bright', string>>>;
export type AccentColors = Readonly<Record<'primary' | 'onPrimary' | 'container' | 'onContainer', string>>;
export type BrandContainerColors = Readonly<Record<'background' | 'foreground', string>>;

export interface ResolvedThemeColors extends ThemeColors {
    readonly surface: Required<SurfaceColors>;
    readonly secondary: AccentColors;
    readonly tertiary: AccentColors;
    readonly brandContainer: BrandContainerColors;
}

export interface ResolvedThemeColorContract extends ThemeColorContract {
    readonly light: ResolvedThemeColors;
    readonly dark: ResolvedThemeColors;
}
