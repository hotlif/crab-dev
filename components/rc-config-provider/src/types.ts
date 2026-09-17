import type { ComponentPropsWithRef } from 'react';

export type ConfigTheme = 'light' | 'dark';
export type ConfigLocale = 'zh-CN' | 'en-US';
export type ConfigSize = 'small' | 'middle' | 'large';

export interface ConfigValue {
    readonly theme: ConfigTheme;
    readonly locale: ConfigLocale;
    readonly size: ConfigSize;
}

export interface ConfigProviderProps extends Omit<ComponentPropsWithRef<'div'>, 'lang'> {
    /** 主题；省略时继承父级，根级默认 light。需加载 rc-theme CSS。 */
    theme?: ConfigTheme;
    /** 语言；省略时继承父级，根级默认 zh-CN。 */
    locale?: ConfigLocale;
    /** 组件默认尺寸；省略时继承父级，根级默认 middle。 */
    size?: ConfigSize;
}
