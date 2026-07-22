/**
 * title = "错误态与重试"
 * description = "远程模块首次加载必然失败（模拟弱网）：Realm 渲染 rc-alert 错误态并就近提供重试按钮；失败已自动使缓存失效, 点击重试即重走加载链路, 第二次成功。"
 */
import Realm from '../../src/index.js';
import type { RemoteContainer } from '../../src/index.js';

const RemoteWidget = () => (
    <div style={{ padding: 12, border: '1px dashed currentColor' }}>重试成功, 远程内容已就绪。</div>
);

let attempts = 0;
const container: RemoteContainer = {
    init: () => undefined,
    get: () => {
        attempts += 1;
        if (attempts === 1) {
            return Promise.reject(new Error('模拟网络失败（首次必败, 请点击重试）'));
        }
        return Promise.resolve(() => ({ default: RemoteWidget }));
    },
};
(globalThis as Record<string, unknown>).crabRealmFlaky ??= container;

const ErrorRetryDemo = () => (
    <Realm entry="/virtual/remoteEntry.js" scope="crabRealmFlaky" module="./Widget" />
);

export default ErrorRetryDemo;
