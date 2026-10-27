// Include the internal subpath in Wake's module and declaration graphs, without public names.
import './internal.js';
export type {} from './internal.js';
export { default } from './config-provider.js';
export { default as ConfigBoundary } from './config-boundary.js';
export { useConfig } from './context.js';
export { useComponentSize, componentDensityMetrics, densityStyles } from './size.js';
export type { ConfigProviderProps, ConfigBoundaryProps, ConfigValue, ConfigDesignSystem, ConfigColorMode, ConfigLocale, ConfigSize, ConfigDensity, ConfigDirection } from './types.js';
export { useLocale, localeMessages } from './locale.js';
export type { LocaleMessages } from './locale.js';
