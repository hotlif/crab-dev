import ConfigContext, { useConfig } from './context.js';
import type { ReactElement } from 'react';
import type { ConfigProviderProps } from './types.js';

/** 为后代提供配置，并通过现有 L2 主题选择器建立独立的 CSS 边界。 */
export default function ConfigProvider({
    theme,
    locale,
    size,
    children,
    ref,
    ...restProps
}: ConfigProviderProps): ReactElement {
    const parent = useConfig();
    const config = {
        theme: theme ?? parent.theme,
        locale: locale ?? parent.locale,
        size: size ?? parent.size,
    };

    return (
        <ConfigContext value={config}>
            <div {...restProps} ref={ref} data-theme={config.theme} lang={config.locale}>
                {children}
            </div>
        </ConfigContext>
    );
}
