import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
[data-text-edit-prototype] {
    --crab-text-edit-surface: ${token.color.surface.content};
    max-inline-size: 61rem;
    margin-inline: auto;
}
[data-text-edit-prototype] .crab-design-hero {
    min-block-size: 0;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
[data-text-edit-prototype] .crab-design-hero > div:first-child { max-inline-size: 100%; }
[data-text-edit-prototype] :is(.crab-design-hero-art, .crab-design-status) { display: none; }
[data-text-edit-prototype] .crab-design-body { container-type: inline-size; }
.crab-text-edit-jump {
    display: flex;
    flex-wrap: wrap;
    gap: .35rem 1rem;
    margin-block-start: .65rem;
    font-size: .875rem;
}
#text-edit-note, #text-edit-height, #text-edit-rules { scroll-margin-block-start: 5rem; }
.crab-text-edit-workspace,
.crab-text-edit-comparison {
    display: grid;
    align-items: start;
    gap: .8rem;
}
.crab-text-edit-workspace { grid-template-columns: minmax(0, 2fr) minmax(0, 1fr); }
.crab-text-edit-comparison { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.crab-text-edit-panel {
    display: grid;
    align-content: start;
    gap: .75rem;
    min-inline-size: 0;
    padding: 1rem;
    background: var(--crab-text-edit-surface);
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
}
.crab-text-edit-editor { gap: 1rem; padding: clamp(1rem, 2.5cqi, 1.5rem); }
.crab-text-edit-footer {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: .5rem 1rem;
    min-block-size: 2.5rem;
}
.crab-text-edit-footer p {
    flex: 1 1 10rem;
    font-size: .875rem;
    color: ${token.color.text.secondary};
}
.crab-text-edit-footer p:empty { position: absolute; }
.crab-text-edit-footer p[data-result="failed"] { color: ${token.color.feedback.error.text}; }
.crab-text-edit-footer p[data-result="saved"] { color: ${token.color.feedback.success.text}; }
.crab-text-edit-footer .crab-design-actions { margin-inline-start: auto; }
.crab-text-edit-preset-actions { display: flex; flex-wrap: wrap; gap: .45rem; }
.crab-text-edit-saved {
    display: grid;
    gap: .4rem;
    margin: 0;
    padding-block-start: .75rem;
    border-block-start: 1px solid ${token.color.border.subtle};
}
.crab-text-edit-saved figcaption { color: ${token.color.text.secondary}; font-size: .8125rem; }
.crab-text-edit-saved p {
    max-block-size: 5em;
    overflow: auto;
    overflow-wrap: anywhere;
    white-space: pre-wrap;
    font-size: .875rem;
}
.crab-text-edit-grow textarea { min-block-size: 3lh; max-block-size: 8lh; overflow-y: auto; }
.crab-text-edit-resize textarea {
    flex: none;
    min-block-size: 3lh;
    max-block-size: 10lh;
    overflow-y: auto;
    scrollbar-gutter: stable;
}
.crab-text-edit-rules dl {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: .5rem 1rem;
    margin: 0;
    font-size: .875rem;
}
.crab-text-edit-rules dt { font-weight: 650; }
.crab-text-edit-rules dd { margin: 0; color: ${token.color.text.secondary}; }
.crab-text-edit-rules > a { justify-self: start; }

[data-text-edit-prototype][data-prototype-design="md3"] {
    --crab-text-edit-surface: ${token.color.surface.low};
}
[data-text-edit-prototype][data-prototype-design="md3"] .crab-text-edit-panel {
    border-color: transparent;
}
[data-text-edit-prototype][data-prototype-design="md3"] [data-field-root][data-appearance="outlined"][data-labeled="true"] {
    position: relative;
    padding-block-start: .5rem;
}
[data-text-edit-prototype][data-prototype-design="md3"] [data-field-root][data-appearance="outlined"][data-labeled="true"] > label {
    position: absolute;
    grid-row: auto;
    inset-block-start: 0;
    inset-inline-start: .75rem;
    margin: 0;
    padding-inline: .25rem;
    transform: none;
    font-size: .75rem;
    line-height: 1rem;
    max-inline-size: calc(100% - 1.5rem);
    background: var(--crab-text-edit-surface);
}
[data-text-edit-prototype][data-prototype-design="md3"] [data-field-root][data-appearance="outlined"][data-labeled="true"] > [data-control] {
    background: transparent;
}
[data-text-edit-prototype][data-prototype-design="md3"] [data-field-root][data-appearance="outlined"][data-labeled="true"] textarea::placeholder {
    color: ${token.color.text.secondary};
}
[data-text-edit-prototype][data-prototype-design="md3"] [data-support] { padding-inline: 1rem; }

[data-text-edit-prototype][data-prototype-design="macos"] { max-inline-size: 56rem; }
[data-text-edit-prototype][data-prototype-design="macos"] .crab-text-edit-workspace {
    align-items: stretch;
    gap: 0;
    background: var(--crab-text-edit-surface);
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
}
[data-text-edit-prototype][data-prototype-design="macos"] .crab-text-edit-workspace > .crab-text-edit-panel {
    border: 0;
    border-radius: 0;
    background: transparent;
}
[data-text-edit-prototype][data-prototype-design="macos"] .crab-text-edit-presets {
    border-inline-start: 1px solid ${token.color.border.subtle};
}
[data-text-edit-prototype][data-prototype-design="macos"] .crab-text-edit-footer {
    padding-block-start: .65rem;
    border-block-start: 1px solid ${token.color.border.subtle};
}
[data-text-edit-prototype][data-prototype-design="shadcn"] .crab-text-edit-panel {
    border-radius: ${token.radius.lg};
    box-shadow: none;
}

@container (max-width: 42rem) {
    .crab-text-edit-workspace, .crab-text-edit-comparison { grid-template-columns: minmax(0, 1fr); }
    [data-text-edit-prototype][data-prototype-design="macos"] .crab-text-edit-presets {
        border-inline-start: 0;
        border-block-start: 1px solid ${token.color.border.subtle};
    }
}
@container (max-width: 24rem) {
    .crab-text-edit-rules dl { grid-template-columns: minmax(0, 1fr); gap: .25rem; }
    .crab-text-edit-rules dd + dt { margin-block-start: .4rem; }
}
`;
