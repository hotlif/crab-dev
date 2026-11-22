import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
[data-switch-prototype] { max-inline-size: 52rem; margin-inline: auto; }
[data-switch-prototype] .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
[data-switch-prototype] .crab-design-hero > div:first-child { max-width: 100%; }
[data-switch-prototype] :is(.crab-design-hero-art, .crab-design-status) { display: none; }
[data-switch-prototype] .crab-design-jump-links {
    display: flex;
    flex-wrap: wrap;
    gap: .4rem 1rem;
    margin-block-start: .65rem;
    font-size: .875rem;
}
[data-switch-prototype] .crab-design-body { container-type: inline-size; }
#switch-setting, #switch-permission, #switch-rules { scroll-margin-block-start: 5rem; }

.crab-switch-panel, .crab-switch-rules {
    min-inline-size: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
[data-switch-prototype] .crab-switch-setting {
    display: flex;
    box-sizing: border-box;
    justify-content: space-between;
    align-items: center;
    min-block-size: ${token.size["touch-target"]};
    gap: .8rem;
    padding: .85rem 1rem;
}
.crab-switch-setting > span { order: -1; min-inline-size: 0; }
.crab-switch-copy { display: grid; gap: .2rem; min-inline-size: 0; }
.crab-switch-title { font-weight: 650; overflow-wrap: anywhere; }
.crab-switch-detail, .crab-switch-rules dd {
    color: ${token.color.text.secondary};
    font-size: .875rem;
    line-height: 1.45;
    overflow-wrap: anywhere;
}
[data-switch-prototype] .crab-switch-setting[data-disabled] > span { opacity: 1; }
.crab-switch-setting[data-disabled] .crab-switch-title { color: ${token.color.text.secondary}; }
.crab-switch-panel[data-phase="saving"] .crab-switch-setting,
.crab-switch-setting button[aria-disabled="true"] { cursor: wait; }

.crab-switch-result {
    display: grid;
    gap: .35rem;
    padding: .75rem 1rem;
    border-block-start: 1px solid ${token.color.border.subtle};
    border-end-start-radius: inherit;
    border-end-end-radius: inherit;
}
.crab-switch-mode {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: .25rem .6rem;
    min-inline-size: 0;
    margin: 0;
    font-size: .875rem;
}
.crab-switch-mode dt { color: ${token.color.text.secondary}; }
.crab-switch-mode dd { margin: 0; font-weight: 650; }
.crab-switch-feedback, .crab-switch-simulator {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: space-between;
    gap: .5rem .85rem;
}
.crab-switch-feedback { min-block-size: 2.25rem; }
.crab-switch-feedback button, .crab-switch-simulator button { flex: none; }
.crab-switch-panel[data-phase="failed"] .crab-switch-feedback p { color: ${token.color.feedback.error.text}; }
.crab-switch-simulator {
    margin-block-start: .65rem;
    padding: .7rem 1rem;
    border: 1px dashed ${token.color.border.subtle};
    border-radius: ${token.shape.card};
}
[data-switch-prototype] .crab-switch-simulator h3 { font-size: .95rem; margin-block-end: .2rem; }
.crab-switch-rules { padding: .9rem 1rem; }
.crab-switch-rules dl {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: .5rem 1rem;
    margin-block: .85rem 0;
}
.crab-switch-rules dt { font-size: .875rem; font-weight: 650; }
.crab-switch-rules dd { margin: 0; }

[data-switch-prototype][data-prototype-design="md3"] .crab-switch-panel {
    border-color: transparent;
    border-radius: 1.35rem;
    background: ${token.color.surface.low};
}
[data-switch-prototype][data-prototype-design="md3"] .crab-switch-setting { padding: .95rem clamp(.7rem, 3cqi, 1.35rem); }
[data-switch-prototype][data-prototype-design="md3"] .crab-switch-result {
    border-color: transparent;
    background: ${token.color.surface.container};
}

[data-switch-prototype][data-prototype-design="macos"] { max-inline-size: 44rem; }
[data-switch-prototype][data-prototype-design="macos"] .crab-switch-setting { padding: .6rem .9rem; }
[data-switch-prototype][data-prototype-design="macos"] .crab-switch-detail { font-size: .8125rem; }
[data-switch-prototype][data-prototype-design="macos"] .crab-switch-result {
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: .25rem .85rem;
    padding: .45rem .9rem;
    background: ${token.color.surface.low};
}
[data-switch-prototype][data-prototype-design="macos"] .crab-switch-simulator { padding: .6rem .9rem; }

[data-switch-prototype][data-prototype-design="shadcn"] .crab-switch-setting { padding-block: .7rem; }
[data-switch-prototype][data-prototype-design="shadcn"] .crab-switch-feedback {
    box-sizing: border-box;
    padding: .35rem .5rem;
    border: 1px solid transparent;
    border-radius: ${token.shape.control};
}
[data-switch-prototype][data-prototype-design="shadcn"] .crab-switch-panel[data-phase="failed"] .crab-switch-feedback {
    border-color: ${token.color.feedback.error.border};
    background: ${token.color.feedback.error.background};
}

@container (max-width: 24rem) {
    .crab-switch-rules dl { grid-template-columns: minmax(0, 1fr); gap: .25rem; }
    .crab-switch-rules dd + dt { margin-block-start: .35rem; }
}
@media (pointer: coarse) {
    .crab-switch-feedback { min-block-size: 3rem; }
}
`;
