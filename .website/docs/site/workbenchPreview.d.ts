import type { ComponentType, ReactElement, ReactNode } from "react";
import type { ConfigColorMode, ConfigDensity, ConfigDesignSystem, ConfigDirection, ConfigLocale, ConfigProviderProps, ConfigSize, ConfigValue } from "@crab-dev/rc-config-provider";

/** Same-origin parent configuration. Omitted optional axes retain the current preview values. */
export interface WorkbenchPreviewConfigurationMessage {
    readonly type: "crab:preview-config";
    readonly designSystem: ConfigDesignSystem;
    readonly colorMode: ConfigColorMode;
    readonly size?: ConfigSize;
    readonly density?: ConfigDensity;
    readonly locale?: ConfigLocale;
    readonly direction?: ConfigDirection;
    /** Omitted keeps the local override; null restores the design default, undefined inherits the nearest Provider. */
    readonly brandColor?: ConfigValue["brandColor"] | undefined;
    /** Omitted keeps the local override; explicit undefined inherits the nearest Provider. */
    readonly nonce?: ConfigValue["nonce"];
}

export interface WorkbenchPreviewProps {
    readonly children: ReactNode;
    /** Additional preview classes; the shared demo-default-preview boundary is always retained. */
    readonly className?: string;
    /** Use the same provider module identity as an owner package's demos. */
    readonly boundary?: ComponentType<ConfigProviderProps>;
}

export default function WorkbenchPreview(props: WorkbenchPreviewProps): ReactElement;
