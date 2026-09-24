import type { ComponentPropsWithRef } from 'react';

export type ConfigTheme = 'light' | 'dark';
export type ConfigLocale = 'zh-CN' | 'en-US';
export type ConfigSize = 'small' | 'middle' | 'large';

export interface ConfigValue {
    readonly theme: ConfigTheme;
    readonly brandColor: string | null;
    readonly locale: ConfigLocale;
    readonly size: ConfigSize;
}

export interface ConfigProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'lang'> {
    /** 主题；省略时继承父级，根级默认 light。需加载 rc-theme CSS。 */
    theme?: ConfigTheme;
    /** 品牌种子色（#RGB / #RRGGBB）；省略继承父级，null 恢复默认紫色。 */
    brandColor?: string | null;
    /** 语言；省略时继承父级，根级默认 zh-CN。 */
    locale?: ConfigLocale;
    /** 控件、数据行和布局间距的默认档位；small 紧凑、middle 标准、large 宽松。省略时继承父级。 */
    size?: ConfigSize;
}
