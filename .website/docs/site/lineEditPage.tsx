import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import LiveExample from "./liveExample.js";
import type { TutorialRecord } from "./tutorial.js";

globalStyle`
.crab-line-edit-page { min-width: 0; }
.crab-line-edit-page > h2 { margin-block: ${token.space['group-gap']} ${token.space['section-gap']}; font-size: ${token.typography.headline.small['font-size']}; font-weight: ${token.typography.headline.small.emphasized['font-weight']}; }
.crab-line-edit-page > h2:first-child { margin-top: 0; }
.crab-line-edit-page > p { color: ${token.color.text.secondary}; line-height: ${token.typography.body.large['line-height']}; }
.crab-line-edit-page [data-live-example] {
    margin-block: ${token.space['group-gap']};
    --component-preview-card-background-color: transparent;
    --component-preview-card-border-radius: 0;
    --component-preview-stage-background-color: transparent;
    --component-preview-stage-padding: ${token.space['component-gap']} 0;
    --component-preview-stage-min-height: 0;
    --component-preview-meta-actions-background-color: transparent;
    --component-preview-meta-actions-border-style: none;
    --component-preview-meta-actions-padding: ${token.space['component-gap']} 0;
}
.crab-line-edit-page > details { border-block-start: 1px solid ${token.color.border.subtle}; padding-block: ${token.space['section-gap']}; }
.crab-line-edit-page > details > summary { cursor: pointer; min-height: ${token.size['48']}; align-content: center; font-weight: ${token.typography.title.small.emphasized['font-weight']}; }
.crab-line-edit-page > details > summary:focus-visible { outline: 2px solid ${token.color.focus.ring}; outline-offset: 2px; }
.crab-line-edit-page :is(h2,h3) > a { margin-inline-start: ${token.space['component-gap']}; font-size: ${token.typography.label.small['font-size']}; }
@media (forced-colors: active) { .crab-line-edit-page > details { border-color: CanvasText; } }
`;

export function LineEditExample({ tutorial, index }: { tutorial: TutorialRecord; index: number }) {
    const step = tutorial.steps[index];
    if (!step || step.preview.kind !== "inline") return null;
    return <LiveExample title={step.title} sourceCode={step.sourceCode} load={step.preview.load} heading="none" />;
}
