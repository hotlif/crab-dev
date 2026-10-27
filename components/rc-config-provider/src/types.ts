import type { ComponentPropsWithRef } from 'react';
import type { DesignSystem } from '@crab-dev/rc-token-semantic';

export type ConfigDesignSystem = DesignSystem;
export type ConfigColorMode = 'light' | 'dark';
export type ConfigLocale = 'zh-CN' | 'en-US';
export type ConfigSize = 'small' | 'medium' | 'large';
export type ConfigDensity = 'compact' | 'standard' | 'comfortable';
export type ConfigDirection = 'ltr' | 'rtl';

export interface ConfigValue {
    readonly designSystem: ConfigDesignSystem;
    readonly colorMode: ConfigColorMode;
    readonly brandColor: string | null;
    readonly locale: ConfigLocale;
    readonly size: ConfigSize;
    readonly density: ConfigDensity;
    readonly direction: ConfigDirection;
    readonly nonce: string | undefined;
}

/** 浮层配置边界的原生容器属性。 */
export type ConfigBoundaryProps = Omit<ComponentPropsWithRef<'div'>, 'lang'> & { size?: ConfigSize };

export interface ConfigProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'lang' | 'dir'> {
    /** 设计体系；省略继承父级，根级默认 md3。 */
    designSystem?: ConfigDesignSystem;
    /** 已解析的明暗模式；省略继承父级，根级默认 light。 */
    colorMode?: ConfigColorMode;
    /** 品牌种子色（#RGB / #RRGGBB）；省略继承父级，null 恢复当前设计风格的默认品牌。 */
    brandColor?: string | null;
    /** 语言；省略时继承父级，根级默认 zh-CN。 */
    locale?: ConfigLocale;
    /** 控件默认尺寸；省略继承父级，根级默认 medium。 */
    size?: ConfigSize;
    /** 数据、导航与布局密度，独立于控件尺寸；默认 standard。 */
    density?: ConfigDensity;
    /** 文字与布局方向；省略继承父级，根级默认 ltr。 */
    direction?: ConfigDirection;
}
