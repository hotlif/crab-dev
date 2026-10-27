import type { ConfigLocale } from '@crab-dev/rc-config-provider';
import { RealmError } from './types.js';
import type { RealmErrorCode } from './types.js';

type BuiltinErrorDetails =
    | { readonly id: 'script-load' | 'module-import' | 'global-container' | 'module-container' | 'init' | 'ssr' | 'load' | 'render' | 'mount' }
    | { readonly id: 'module-get' | 'factory'; readonly module: string }
    | { readonly id: 'component-protocol' | 'mount-protocol'; readonly exportName: string }
    | { readonly id: 'timeout'; readonly timeout: number };

const errorCodes: Record<BuiltinErrorDetails['id'], RealmErrorCode> = {
    'script-load': 'script',
    'module-import': 'script',
    'global-container': 'container',
    'module-container': 'container',
    init: 'init',
    'module-get': 'factory',
    factory: 'factory',
    ssr: 'ssr',
    timeout: 'timeout',
    'component-protocol': 'protocol',
    'mount-protocol': 'protocol',
    load: 'factory',
    render: 'render',
    mount: 'render',
};

// Only errors constructed by the library receive a message descriptor. A public
// RealmError with the same code or message remains caller-owned. Weak keys retain
// neither failed loads nor the remote resources associated with them.
const builtinDetails = new WeakMap<RealmError, {
    details: BuiltinErrorDetails;
    originalMessage: string;
}>();

function formatBuiltinMessage(
    entry: string,
    scope: string,
    details: BuiltinErrorDetails,
    locale: ConfigLocale,
    diagnostic = false,
): string {
    const english = locale === 'en-US';
    switch (details.id) {
        case 'script-load': return english
            ? `Unable to load remoteEntry script: ${entry}`
            : `remoteEntry 脚本加载失败：${entry}`;
        case 'module-import': return english
            ? `Unable to import remoteEntry module: ${entry}`
            : `remoteEntry 模块导入失败：${entry}`;
        case 'global-container': return english
            ? `remoteEntry loaded, but globalThis['${scope}'] is not a Module Federation container. Check that scope matches ModuleFederationPlugin.name and the remote uses the var format.`
            : `remoteEntry 加载完成但 globalThis['${scope}'] 不是 MF 容器：scope 与 ModuleFederationPlugin.name 不符, 或该脚本不是 var 格式的 remote`;
        case 'module-container': return english
            ? 'The remoteEntry module does not export a Module Federation container (init/get are required).'
            : 'remoteEntry 模块的导出不是 MF 容器（缺少 init/get）';
        case 'init': return english
            ? 'The remote container threw in init(shareScope).'
            : '远程容器 init(shareScope) 抛出异常';
        case 'module-get': return english
            ? `The container does not expose module '${details.module}', or the module could not be loaded.`
            : `容器不含模块 '${details.module}' 或其加载失败`;
        case 'factory': return english
            ? `The factory for module '${details.module}' threw.`
            : `模块 '${details.module}' 的工厂执行抛出异常`;
        case 'ssr': return english
            ? 'Remote modules can only be loaded in a browser.'
            : '非浏览器环境无法加载远程模块';
        case 'timeout': {
            const duration = diagnostic ? String(details.timeout) : new Intl.NumberFormat(locale).format(details.timeout);
            return english
                ? `Remote module loading exceeded the ${duration} ms timeout.`
                : `远程模块加载超过 ${duration}ms 期限`;
        }
        case 'component-protocol': return english
            ? `Remote export '${details.exportName}' is not a React component. If it exports mount/unmount lifecycles, use protocol="mount".`
            : `远程导出 '${details.exportName}' 不是 React 组件；若远程导出 mount/unmount 生命周期, 请改用 protocol="mount"`;
        case 'mount-protocol': return english
            ? `Remote export '${details.exportName}' has no mount() lifecycle. If it is a React component, use protocol="component".`
            : `远程导出 '${details.exportName}' 不含 mount() 生命周期；若远程导出的是 React 组件, 请改用 protocol="component"`;
        case 'load': return english ? 'The remote module could not be loaded.' : '远程模块加载失败';
        case 'render': return english ? 'The remote component threw while rendering.' : '远程组件渲染时抛出异常';
        case 'mount': return english ? 'The remote module threw in mount().' : '远程模块 mount() 抛出异常';
    }
}

/** Internal provenance for default UI only; public diagnostics stay unchanged. */
export function createBuiltinRealmError(
    entry: string,
    scope: string,
    details: BuiltinErrorDetails,
    options?: { cause?: unknown },
): RealmError {
    const message = formatBuiltinMessage(entry, scope, details, 'zh-CN', true);
    const error = new RealmError(errorCodes[details.id], entry, scope, message, options);
    builtinDetails.set(error, { details, originalMessage: message });
    return error;
}

export function getRealmErrorMessage(error: RealmError, locale: ConfigLocale): string {
    const builtin = builtinDetails.get(error);
    // An explicit message override is also caller-owned, even when the original
    // object came from the loader. Do not translate arbitrary Error.message text.
    if (builtin === undefined || error.message !== builtin.originalMessage) return error.message;
    return formatBuiltinMessage(error.entry, error.scope, builtin.details, locale);
}
