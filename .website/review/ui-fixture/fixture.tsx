import { use, useState } from "react";
import Button from "@crab-dev/rc-button";
import { SiteContext } from "../../docs/site/siteContext.js";
import { CodeBlock, Demo, PageError } from "../../docs/site/ui.js";
import type { Viewport } from "@crab-dev/wake/docs";

export default function Fixture() {
    const state = use(SiteContext);
    const [fullscreen, setFullscreen] = useState(false);
    const [codeOpen, setCodeOpen] = useState(false);
    const [viewport, setViewport] = useState<Viewport>("responsive");
    const [copied, setCopied] = useState(false);
    const [retryCount, setRetryCount] = useState(0);
    if (!state) return null;
    return <>
        <Demo {...state} id="fixture" title="唯一预览验收" description="打开全屏并关闭，退出动画期间预览节点应始终只有一个。" loading={false} background="transparent" padding="0" error={null} source="export default function Example() { return <p>真实预览</p>; }" highlightedSource={null} sourceLanguage="tsx" codeOpen={codeOpen} setCodeOpen={setCodeOpen} fullscreen={fullscreen} setFullscreen={setFullscreen} viewport={viewport} setViewport={setViewport} copied={copied} copy={async () => setCopied(true)} preview={<div data-testid="fixture-preview"><p>真实预览</p><Button onClick={() => setFullscreen(false)}>关闭全屏预览</Button></div>} />
        <CodeBlock {...state} title="复制失败反馈" language="tsx" code="const value = 1;" copyStatus="error" copy={async () => {}}>const value = 1;</CodeBlock>
        <PageError {...state} error="本地模拟模块错误" retry={() => setRetryCount(value => value + 1)} />
        <p role="status">重试次数：{retryCount}</p>
    </>;
}
