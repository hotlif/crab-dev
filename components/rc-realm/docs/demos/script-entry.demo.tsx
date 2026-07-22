/**
 * title = "真实 script 注入链路"
 * description = "从 URL 加载 remoteEntry.js（本包 public/remote/ 下的手写 var 格式容器）：script 注入 → init 收到含宿主 React 的 share scope → get('./Widget') → 渲染。远程组件用 init 时注入的宿主 React 实例创建元素, 端到端验证共享机制。"
 */
import Realm from '../../src/index.js';

const ScriptEntryDemo = () => (
    <Realm
        entry="/remote/remoteEntry.js"
        scope="crabRealmDemo"
        module="./Widget"
        remoteProps={{ message: '来自宿主的问候' }}
    />
);

export default ScriptEntryDemo;
