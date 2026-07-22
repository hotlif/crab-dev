/**
 * title = "mount 协议 + Shadow DOM 沙箱"
 * description = "mount 协议适配跨框架 / 不同 React 版本的远程, 可开启 sandbox 做样式隔离：下方宿主与远程各有一个 .sandbox-demo-title 元素——远程标题被 styleSheets 染色, 宿主标题不受影响；主题令牌 CSS 变量仍穿透沙箱。"
 */
import Realm from '../../src/index.js';
import type { MountLifecycle, RemoteContainer } from '../../src/index.js';

const lifecycle: MountLifecycle = {
    mount: (container, props) => {
        const title = document.createElement('p');
        title.className = 'sandbox-demo-title';
        title.textContent = `沙箱内的远程标题（message = ${String(props.message)}）`;
        container.append(title);
        return () => title.remove();
    },
};

const container: RemoteContainer = {
    init: () => undefined,
    get: () => Promise.resolve(() => ({ default: lifecycle })),
};
(globalThis as Record<string, unknown>).crabRealmSandbox ??= container;

const MountSandboxDemo = () => (
    <div>
        <p className="sandbox-demo-title">宿主的标题：不受沙箱内样式影响, 保持默认颜色</p>
        <Realm
            entry="/virtual/remoteEntry.js"
            scope="crabRealmSandbox"
            module="./Title"
            protocol="mount"
            sandbox
            styleSheets={[
                '.sandbox-demo-title { color: var(--token-semantic-color-brand-primary, oklch(0.55 0.2 260)); font-weight: 600; }',
            ]}
            remoteProps={{ message: '隔离生效' }}
        />
    </div>
);

export default MountSandboxDemo;
