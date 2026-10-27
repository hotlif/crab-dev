import { useId, type ReactElement } from 'react';
import { createBrandTheme } from '@crab-dev/rc-token-semantic';
import { useConfig } from './context.js';
import { densityStyles } from './size.js';
import type { ConfigValue } from './types.js';

/** One implementation for ordinary providers and native top-layer roots. */
export function createScopedBrandCss(brand: ReturnType<typeof createBrandTheme> | null, scopeId: string, designSystem: ConfigValue['designSystem']): string | null {
    return brand === null ? null : `@media (forced-colors: none) {${(['light', 'dark'] as const).map(mode =>
        `[data-crab-brand="${scopeId}"][data-theme="${mode}"][data-crab-design="${designSystem}"] {${Object.entries(brand[mode]).map(([name, value]) => `${name}:${value};`).join('')}}`,
    ).join('')}}`;
}

export interface ConfigStyleBoundary {
    attributes: {
        'data-crab-design': ConfigValue['designSystem'];
        'data-theme': ConfigValue['colorMode'];
        'data-crab-density': ConfigValue['density'];
        'data-crab-size': ConfigValue['size'];
        'data-crab-brand': string | undefined;
        dir: ConfigValue['direction'];
        lang: ConfigValue['locale'];
        nonce: ConfigValue['nonce'];
    };
    className: string;
    brandStyle: ReactElement | null;
}

/** Internal: native dialog roots cannot use the provider's div container. */
export function useConfigStyleBoundary(): ConfigStyleBoundary {
    const config = useConfig();
    const scopeId = encodeURIComponent(useId());
    const brand = config.brandColor === null ? null : createBrandTheme(config.brandColor);
    const css = createScopedBrandCss(brand, scopeId, config.designSystem);
    return {
        attributes: {
            'data-crab-design': config.designSystem,
            'data-theme': config.colorMode,
            'data-crab-density': config.density,
            'data-crab-size': config.size,
            'data-crab-brand': brand === null ? undefined : scopeId,
            dir: config.direction,
            lang: config.locale,
            nonce: config.nonce,
        },
        className: densityStyles[config.density],
        brandStyle: css === null ? null : <style nonce={config.nonce} data-crab-brand-style={scopeId}>{css}</style>,
    };
}
