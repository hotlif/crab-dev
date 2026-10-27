import ConfigContext, { useConfig } from './context.js';
import { useId, type ReactElement } from 'react';
import { createBrandTheme } from '@crab-dev/rc-token-semantic';
import type { ConfigProviderProps } from './types.js';
import { cx } from '@crab-dev/css';
import { densityStyles } from './size.js';
import { createScopedBrandCss } from './style-boundary.js';

/** 为后代提供配置，并通过现有 L2 主题选择器建立独立的 CSS 边界。 */
export default function ConfigProvider({
    designSystem,
    colorMode,
    brandColor,
    locale,
    size,
    density,
    direction,
    children,
    ref,
    nonce,
    className,
    ...restProps
}: ConfigProviderProps): ReactElement {
    const parent = useConfig();
    const scopeId = encodeURIComponent(useId());
    const seed = brandColor === undefined ? parent.brandColor : brandColor;
    const brand = seed === null ? null : createBrandTheme(seed);
    const config = {
        designSystem: designSystem ?? parent.designSystem,
        colorMode: colorMode ?? parent.colorMode,
        brandColor: brand?.seed ?? null,
        locale: locale ?? parent.locale,
        size: size ?? parent.size,
        density: density ?? parent.density,
        direction: direction ?? parent.direction,
        nonce: nonce ?? parent.nonce,
    };
    // Only L2 values are dynamic. All component declarations remain static Crab CSS.
    // A rule per boundary also preserves brand inheritance through nested themes / portals.
    const brandCss = createScopedBrandCss(brand, scopeId, config.designSystem);

    return (
        <ConfigContext value={config}>
            <div {...restProps} className={cx(densityStyles[config.density], className)} ref={ref} nonce={config.nonce} data-crab-design={config.designSystem} data-theme={config.colorMode} data-crab-size={config.size} data-crab-density={config.density} data-crab-brand={brand === null ? undefined : scopeId} lang={config.locale} dir={config.direction}>
                {brandCss !== null && <style nonce={config.nonce} data-crab-brand-style={scopeId}>{brandCss}</style>}
                {children}
            </div>
        </ConfigContext>
    );
}
