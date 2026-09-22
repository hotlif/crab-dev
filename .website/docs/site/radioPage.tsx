import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import LiveExample from "./liveExample.js";
import type { TutorialRecord } from "./tutorial.js";

globalStyle`
.crab-docs-page:has(.crab-radio-page) > .crab-docs-inline-toc { margin-block: ${token.space["section-gap"]}; }
.crab-radio-page { min-width: 0; }
.crab-radio-page h3 { text-wrap: balance; }
.crab-radio-page > h2 { margin: ${token.space["group-gap"]} 0 ${token.space["section-gap"]}; font-size: ${token.typography.headline.small["font-size"]}; line-height: ${token.typography.headline.small["line-height"]}; font-weight: ${token.typography.headline.small.emphasized["font-weight"]}; }
.crab-radio-page > h2:first-of-type { margin-top: 0; }
.crab-radio-page :is(h2,h3) > a { margin-inline-start: ${token.space["component-gap"]}; font-size: ${token.typography.label.small["font-size"]}; opacity: 0; }
.crab-radio-page :is(h2,h3):hover > a, .crab-radio-page :is(h2,h3) > a:focus-visible { opacity: 1; }
.crab-radio-page > p { margin: 0 0 ${token.space["section-gap"]}; line-height: ${token.typography.body.large["line-height"]}; color: ${token.color.text.secondary}; }
.crab-radio-page [data-live-example] { margin-bottom: ${token.space["group-gap"]}; }
.crab-radio-page .radio-page-guidance { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: ${token.space["section-gap"]}; margin-block: ${token.space["group-gap"]}; }
.crab-radio-page .radio-page-guidance > div { padding-inline-start: ${token.space["stack-gap"]}; border-inline-start: 2px solid ${token.color.secondary.container}; min-width: 0; }
.crab-radio-page .radio-page-guidance strong { display: block; font-size: ${token.typography.title.small["font-size"]}; font-weight: ${token.typography.title.small.emphasized["font-weight"]}; }
.crab-radio-page .radio-page-guidance p { color: ${token.color.text.secondary}; font-size: ${token.typography.body.medium["font-size"]}; line-height: ${token.typography.body.medium["line-height"]}; margin: ${token.space["component-gap"]} 0 0; }
.crab-radio-page > details { border: 1px solid ${token.color.border.subtle}; padding: ${token.space["section-gap"]}; border-radius: ${token.shape.large}; margin-block: ${token.space["section-gap"]}; }
.crab-radio-page > details > summary { cursor: pointer; font-weight: ${token.typography.title.small.emphasized["font-weight"]}; min-height: ${token.size["48"]}; align-content: center; }
.crab-radio-page > details > summary:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; border-radius: ${token.shape.small}; }
.crab-radio-page > details p { color: ${token.color.text.secondary}; line-height: ${token.typography.body.large["line-height"]}; }
@media (max-width: 767px) {
    .crab-radio-page .radio-page-guidance { grid-template-columns: minmax(0, 1fr); }
}
@media (forced-colors: active) { .crab-radio-page .radio-page-guidance > div { border-color: CanvasText; } }
`;

export function RadioExample({ tutorial, index }: { tutorial: TutorialRecord; index: number }) {
    const step = tutorial.steps[index];
    if (!step || step.preview.kind !== "inline") return null;
    return <LiveExample title={step.title} sourceCode={step.sourceCode} load={step.preview.load} heading="none" density="compact" />;
}

export function RadioGuidance() {
    return <div className="radio-page-guidance" aria-label="使用要点">
        <div><strong>选项直接可比较</strong><p>适合少量互斥选项。需要多选时用 Checkbox，选项较多时用 Select。</p></div>
        <div><strong>点击文字也能选择</strong><p>让标签与选项成为一个操作目标。必要时添加简短说明，帮助用户判断。</p></div>
        <div><strong>选中即有反馈</strong><p>用圆点与圆环共同表达选择。保留键盘焦点，及时说明校验和不可用原因。</p></div>
    </div>;
}
