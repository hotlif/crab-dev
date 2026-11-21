import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
[data-checkbox-prototype] .crab-design-body { container-type: inline-size; }
#checkbox-export, #checkbox-states, #checkbox-rules { scroll-margin-block-start: 5rem; }

.crab-checkbox-board { display: grid; grid-template-columns: minmax(0, 1.7fr) minmax(13rem, 1fr); align-items: start; gap: 1rem; }
.crab-checkbox-queue, .crab-checkbox-summary, .crab-checkbox-samples > div, .crab-checkbox-rules {
    min-inline-size: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-checkbox-queue { padding: 1rem; }
.crab-checkbox-queue-heading { display: grid; gap: .25rem; padding: 0 .55rem .75rem; }
.crab-checkbox-queue-heading p, .crab-checkbox-detail, .crab-checkbox-instructions, .crab-checkbox-rules dd {
    color: ${token.color.text.secondary};
    font-size: .875rem;
    line-height: 1.45;
}
.crab-checkbox-queue .crab-checkbox-tasks, .crab-checkbox-summary .crab-checkbox-receipt {
    list-style: none;
    margin: 0;
    padding: 0;
}
.crab-checkbox-option {
    box-sizing: border-box;
    width: 100%;
    min-block-size: ${token.size["touch-target"]};
    padding: .45rem .55rem;
}
.crab-checkbox-option > span:last-child { flex: 1; }
[data-checkbox-prototype] .crab-checkbox-option[data-disabled] {
    opacity: 1;
}
.crab-checkbox-option[data-disabled] .crab-checkbox-name { color: ${token.color.text.secondary}; }
.crab-checkbox-option-content, .crab-checkbox-summary .crab-checkbox-receipt li {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    align-items: center;
    gap: .65rem;
}
.crab-checkbox-copy { display: grid; gap: .13rem; min-inline-size: 0; }
.crab-checkbox-name { font-weight: 600; overflow-wrap: anywhere; }
.crab-checkbox-meta { font-size: .75rem; color: ${token.color.text.secondary}; font-variant-numeric: tabular-nums; }
.crab-checkbox-master { border-block-end: 1px solid ${token.color.border.subtle}; }
.crab-checkbox-summary { display: grid; justify-items: start; gap: .8rem; padding: 1rem; }
.crab-checkbox-count { color: ${token.color.text.secondary}; font-size: .9rem; }
.crab-checkbox-summary .crab-checkbox-receipt { display: grid; gap: .35rem; width: 100%; font-size: .875rem; overflow-wrap: anywhere; }
.crab-checkbox-receipt li { border-block-start: 1px solid ${token.color.border.subtle}; padding-block: .45rem; }
.crab-checkbox-samples { display: grid; grid-template-columns: repeat(auto-fit, minmax(min(100%, 12rem), 1fr)); gap: .7rem; }
.crab-checkbox-samples > div { display: grid; align-content: start; gap: .4rem; padding: .8rem 1rem; }
[data-checkbox-prototype] .crab-checkbox-samples h3 { font-size: .95rem; }
[data-checkbox-prototype] .crab-checkbox-instructions { margin-block-start: .65rem; }
.crab-checkbox-rules { padding: 1rem; }
.crab-checkbox-rules dl { display: grid; grid-template-columns: auto minmax(0, 1fr); gap: .55rem 1rem; margin-block: 1rem 0; }
.crab-checkbox-rules dt { font-weight: 650; font-size: .875rem; }
.crab-checkbox-rules dd { margin: 0; overflow-wrap: anywhere; }

[data-checkbox-prototype][data-prototype-design="md3"] .crab-design-hero {
    border: 0;
    border-radius: 1.5rem;
    background: ${token.color.surface.low};
}
[data-checkbox-prototype][data-prototype-design="md3"] :is(.crab-checkbox-queue, .crab-checkbox-summary, .crab-checkbox-samples > div) {
    border-color: transparent;
    border-radius: 1.25rem;
    background: ${token.color.surface.low};
}
[data-checkbox-prototype][data-prototype-design="md3"] .crab-checkbox-queue { padding: clamp(.65rem, 2cqi, 1.25rem); }
[data-checkbox-prototype][data-prototype-design="md3"] .crab-checkbox-summary { background: ${token.color.surface.container}; }
[data-checkbox-prototype][data-prototype-design="md3"] .crab-checkbox-option {
    border-radius: .8rem;
    transition: background-color ${token.motion.effects.fast};
}
[data-checkbox-prototype][data-prototype-design="md3"] .crab-checkbox-master { border-radius: .8rem .8rem 0 0; }
[data-checkbox-prototype][data-prototype-design="md3"] .crab-checkbox-tasks { display: grid; gap: .3rem; padding-block-start: .35rem; }
[data-checkbox-prototype][data-prototype-design="md3"] .crab-checkbox-tasks .crab-checkbox-option[data-state="checked"] {
    background: ${token.color.background.selected};
}
[data-checkbox-prototype][data-prototype-design="md3"] .crab-checkbox-tasks .crab-checkbox-option:not([data-disabled]):hover {
    background: color-mix(in oklab, ${token.color.brand.primary} 12%, ${token.color.surface.low});
}

[data-checkbox-prototype][data-prototype-design="macos"] .crab-checkbox-board { gap: 0; align-items: stretch; }
[data-checkbox-prototype][data-prototype-design="macos"] .crab-checkbox-queue {
    padding: 0;
    overflow: hidden;
    border-start-end-radius: 0;
    border-end-end-radius: 0;
    box-shadow: ${token.shadow.control};
}
[data-checkbox-prototype][data-prototype-design="macos"] .crab-checkbox-queue-heading {
    background: ${token.color.surface.low};
    border-block-end: 1px solid ${token.color.border.subtle};
    padding: .65rem 1rem;
}
[data-checkbox-prototype][data-prototype-design="macos"] .crab-checkbox-option { padding: .35rem .8rem; }
[data-checkbox-prototype][data-prototype-design="macos"] .crab-checkbox-tasks li + li { border-block-start: 1px solid ${token.color.border.subtle}; }
[data-checkbox-prototype][data-prototype-design="macos"] .crab-checkbox-summary {
    align-content: start;
    border-inline-start: 0;
    border-start-start-radius: 0;
    border-end-start-radius: 0;
    background: ${token.color.surface.low};
}

[data-checkbox-prototype][data-prototype-design="shadcn"] .crab-checkbox-queue { border: 0; background: transparent; padding: 0; }
[data-checkbox-prototype][data-prototype-design="shadcn"] .crab-checkbox-tasks { display: grid; gap: .5rem; margin-block-start: .5rem; }
[data-checkbox-prototype][data-prototype-design="shadcn"] .crab-checkbox-option {
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.control};
    background: ${token.color.surface.content};
    transition: border-color ${token.motion.effects.fast};
}
[data-checkbox-prototype][data-prototype-design="shadcn"] .crab-checkbox-option:not([data-disabled]):is(:hover, [data-state="checked"]) {
    border-color: ${token.color.text.secondary};
}

@container (max-width: 42rem) {
    .crab-checkbox-board { grid-template-columns: minmax(0, 1fr); }
    [data-checkbox-prototype][data-prototype-design="macos"] .crab-checkbox-queue {
        border-start-end-radius: ${token.shape.card};
        border-end-start-radius: 0;
    }
    [data-checkbox-prototype][data-prototype-design="macos"] .crab-checkbox-summary {
        border-inline-start: 1px solid ${token.color.border.subtle};
        border-block-start: 0;
        border-start-end-radius: 0;
        border-end-start-radius: ${token.shape.card};
    }
}
@container (max-width: 27rem) {
    .crab-checkbox-tasks .crab-checkbox-option-content { grid-template-columns: minmax(0, 1fr); gap: .15rem; }
    .crab-checkbox-option .crab-checkbox-meta { justify-self: start; }
    .crab-checkbox-rules dl { grid-template-columns: minmax(0, 1fr); gap: .2rem; }
    .crab-checkbox-rules dd + dt { margin-block-start: .45rem; }
}
@media (prefers-reduced-motion: reduce) {
    [data-checkbox-prototype] .crab-checkbox-option { transition: none !important; }
}
`;
