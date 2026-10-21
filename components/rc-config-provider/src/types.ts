import type { ComponentPropsWithRef } from 'react';
import type { ThemeDesign } from '@crab-dev/rc-token-semantic';

export type ConfigDesign = ThemeDesign;
export type ConfigTheme = 'light' | 'dark';
export type ConfigLocale = 'zh-CN' | 'en-US';
export type ConfigSize = 'small' | 'middle' | 'large';

export interface ConfigValue {
    readonly design: ConfigDesign;
    readonly theme: ConfigTheme;
    readonly brandColor: string | null;
    readonly locale: ConfigLocale;
    readonly size: ConfigSize;
}

/** 浮层配置边界的原生容器属性。 */
export type ConfigBoundaryProps = Omit<ComponentPropsWithRef<'div'>, 'lang'>;

export interface ConfigProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'lang'> {
    /** 设计风格；省略时继承父级，根级默认 material。与明暗主题、品牌色和尺寸独立。 */
    design?: ConfigDesign;
    /** 主题；省略时继承父级，根级默认 light。需加载 rc-theme CSS。 */
    theme?: ConfigTheme;
    /** 品牌种子色（#RGB / #RRGGBB）；省略继承父级，null 恢复当前设计风格的默认品牌。 */
    brandColor?: string | null;
    /** 语言；省略时继承父级，根级默认 zh-CN。 */
    locale?: ConfigLocale;
    /** 控件、数据行和布局间距的默认档位；small 紧凑、middle 标准、large 宽松。省略时继承父级。 */
    size?: ConfigSize;
}
