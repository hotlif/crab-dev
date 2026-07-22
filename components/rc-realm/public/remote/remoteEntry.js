/**
 * 手写的 var 格式 Module Federation 容器（非构建产物）, 供 script-entry demo
 * 端到端验证「script 注入 → init(shareScope) → get(module)」完整链路。
 * 它从 init 收到的 share scope 里取宿主 React——恰好验证 share scope 注入生效。
 */
(function () {
    'use strict';

    var hostReact = null;

    globalThis.crabRealmDemo = {
        init: function (shareScope) {
            var reactVersions = shareScope && shareScope.react;
            var versions = reactVersions ? Object.keys(reactVersions) : [];
            if (versions.length === 0) {
                return Promise.reject(new Error('share scope 中没有 react'));
            }
            return reactVersions[versions[0]].get().then(function (factory) {
                var mod = factory();
                hostReact = mod && mod.default ? mod.default : mod;
            });
        },
        get: function (moduleId) {
            if (moduleId !== './Widget') {
                return Promise.reject(new Error('unknown module: ' + moduleId));
            }
            return Promise.resolve(function () {
                return {
                    default: function RemoteWidget(props) {
                        return hostReact.createElement(
                            'div',
                            { style: { padding: '12px', border: '1px dashed currentColor' } },
                            hostReact.createElement(
                                'p',
                                null,
                                '我是来自 remoteEntry.js 的远程组件, 使用宿主注入的 React ',
                                hostReact.version,
                                ' 渲染。',
                            ),
                            hostReact.createElement('p', null, 'message = ', String(props.message)),
                        );
                    },
                };
            });
        },
    };
})();
