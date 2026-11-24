import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
[data-segmented-prototype] { max-inline-size: 54rem; margin-inline: auto; }
[data-segmented-prototype] .crab-design-hero {
    min-height: auto;
    padding: .75rem clamp(.5rem, 2vw, 1.65rem) 0;
    border: 0;
    background: transparent;
}
[data-segmented-prototype] .crab-design-hero > div:first-child { max-width: 100%; }
[data-segmented-prototype] :is(.crab-design-hero-art, .crab-design-status) { display: none; }
[data-segmented-prototype] .crab-design-jump-links {
    display: flex;
    flex-wrap: wrap;
    gap: .4rem 1rem;
    margin-block-start: .65rem;
    font-size: .875rem;
}
[data-segmented-prototype] .crab-design-body { container-type: inline-size; }
#segmented-trend, #segmented-overflow, #segmented-rules { scroll-margin-block-start: 5rem; }

.crab-segmented-panel {
    min-inline-size: 0;
    border: 1px solid ${token.color.border.subtle};
    border-radius: ${token.shape.card};
    background: ${token.color.surface.content};
}
.crab-segmented-toolbar {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    gap: .75rem 1rem;
    padding: .9rem 1rem;
    border-block-end: 1px solid ${token.color.border.subtle};
}
.crab-segmented-data { display: grid; gap: .8rem; padding: 1rem; }
.crab-segmented-stats { display: grid; gap: .2rem; }
.crab-segmented-stats strong { font-size: 1.45rem; font-variant-numeric: tabular-nums; }
.crab-segmented-detail, .crab-segmented-rules dd {
    color: ${token.color.text.secondary};
    font-size: .875rem;
    line-height: 1.45;
    overflow-wrap: anywhere;
}
[data-segmented-prototype] .crab-segmented-chart {
    display: grid;
    grid-auto-flow: column;
    grid-auto-columns: minmax(0, 1fr);
    gap: clamp(.18rem, 1cqi, .6rem);
    margin: 0;
    padding: 0;
    list-style: none;
    text-align: center;
}
.crab-segmented-chart li {
    display: grid;
    grid-template-rows: auto clamp(5rem, 15cqi, 8rem) auto;
    gap: .25rem;
    min-inline-size: 0;
}
.crab-segmented-count, .crab-segmented-tick { font-size: .75rem; font-variant-numeric: tabular-nums; }
.crab-segmented-tick { grid-row: 3; color: ${token.color.text.secondary}; overflow-wrap: anywhere; }
.crab-segmented-count { grid-row: 1; font-weight: 650; }
.crab-segmented-plot {
    grid-row: 2;
    display: flex;
    align-items: flex-end;
    justify-content: center;
    border-block-end: 1px solid ${token.color.border.subtle};
}
.crab-segmented-bar {
    inline-size: clamp(.45rem, 55%, 2.4rem);
    border-start-start-radius: .3rem;
    border-start-end-radius: .3rem;
    background: ${token.color.brand.primary};
}

.crab-segmented-overflow-panel, .crab-segmented-rules { padding: .85rem 1rem; }
.crab-segmented-overflow-panel { display: grid; gap: .5rem; }
.crab-segmented-overflow-scroll {
    overflow-x: auto;
    overscroll-behavior-inline: contain;
    scroll-padding-inline: .5rem;
    padding: .7rem .5rem;
    margin-inline: -.5rem;
}
[data-segmented-prototype] .crab-segmented-long-control { inline-size: max-content; max-inline-size: none; }
.crab-segmented-overflow-panel strong { color: ${token.color.text.primary}; }
.crab-segmented-rules dl {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: .5rem 1rem;
    margin-block: .8rem 0;
}
.crab-segmented-rules dt { font-size: .875rem; font-weight: 650; }
.crab-segmented-rules dd { margin: 0; }

[data-segmented-prototype][data-prototype-design="md3"] .crab-segmented-panel {
    border-color: transparent;
    border-radius: 1.35rem;
    background: ${token.color.surface.low};
}
[data-segmented-prototype][data-prototype-design="md3"] .crab-segmented-toolbar {
    border-color: transparent;
    border-start-start-radius: inherit;
    border-start-end-radius: inherit;
    background: ${token.color.surface.container};
}
[data-segmented-prototype][data-prototype-design="md3"] .crab-segmented-data { padding: 1rem clamp(.65rem, 3cqi, 1.4rem); }
[data-segmented-prototype][data-prototype-design="md3"] .crab-segmented-period { min-inline-size: min(100%, 12rem); }

[data-segmented-prototype][data-prototype-design="macos"] { max-inline-size: 44rem; }
[data-segmented-prototype][data-prototype-design="macos"] .crab-segmented-toolbar {
    padding: .65rem .9rem;
    border-start-start-radius: inherit;
    border-start-end-radius: inherit;
    background: ${token.color.surface.low};
}
[data-segmented-prototype][data-prototype-design="macos"] .crab-segmented-data { gap: .6rem; padding: .75rem .9rem; }
[data-segmented-prototype][data-prototype-design="macos"] .crab-segmented-bar { inline-size: clamp(.45rem, 46%, 1.75rem); }

[data-segmented-prototype][data-prototype-design="shadcn"] .crab-segmented-bar { background: ${token.color.text.primary}; }
[data-segmented-prototype][data-prototype-design="shadcn"] .crab-segmented-data { gap: .75rem; }

@container (max-width: 24rem) {
    [data-segmented-prototype] .crab-segmented-toolbar { padding: .7rem; }
    .crab-segmented-period { inline-size: 100%; }
    .crab-segmented-rules dl { grid-template-columns: minmax(0, 1fr); gap: .24rem; }
    .crab-segmented-rules dd + dt { margin-block-start: .35rem; }
}
@media (forced-colors: active) {
    [data-segmented-prototype] .crab-segmented-bar { forced-color-adjust: none; background: CanvasText; }
}
`;
