import ConfigContext, { useConfig } from './context.js';
import { useId, type ReactElement } from 'react';
import { createBrandTheme } from '@crab-dev/rc-token-semantic';
import type { ConfigProviderProps } from './types.js';

/** 为后代提供配置，并通过现有 L2 主题选择器建立独立的 CSS 边界。 */
export default function ConfigProvider({
    theme,
    brandColor,
    locale,
    size,
    children,
    ref,
    nonce,
    ...restProps
}: ConfigProviderProps): ReactElement {
    const parent = useConfig();
    const scopeId = encodeURIComponent(useId());
    const seed = brandColor === undefined ? parent.brandColor : brandColor;
    const brand = seed === null ? null : createBrandTheme(seed);
    const config = {
        theme: theme ?? parent.theme,
        brandColor: brand?.seed ?? null,
        locale: locale ?? parent.locale,
        size: size ?? parent.size,
    };
    // Only L2 values are dynamic. All component declarations remain static Crab CSS.
    // A rule per boundary also preserves brand inheritance through nested themes / portals.
    const brandCss = brand === null ? null : `@media (forced-colors: none) {${(['light', 'dark'] as const).map((mode) =>
        `[data-crab-brand="${scopeId}"][data-theme="${mode}"] {${Object.entries(brand[mode]).map(([name, value]) => `${name}:${value};`).join('')}}`,
    ).join('')}}`;

    return (
        <ConfigContext value={config}>
            <div {...restProps} ref={ref} nonce={nonce} data-theme={config.theme} data-crab-brand={brand === null ? undefined : scopeId} lang={config.locale}>
                {brandCss !== null && <style nonce={nonce} data-crab-brand-style={scopeId}>{brandCss}</style>}
                {children}
            </div>
        </ConfigContext>
    );
}
