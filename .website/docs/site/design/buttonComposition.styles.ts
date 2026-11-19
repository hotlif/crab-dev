import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-design-composition { scroll-margin-block-start: 5rem; min-inline-size: 0; container: button-composition / inline-size; }
.crab-design-composition-grid { display: grid; grid-template-columns: repeat(2,minmax(0,1fr)); gap: .9rem; }
.crab-design-composition-card {
    display: grid;
    align-content: start;
    justify-items: start;
    gap: .9rem;
    min-inline-size: 0;
    padding: 1rem;
    border: 1px solid var(--crab-prototype-rule);
    border-radius: .8rem;
    background: var(--crab-prototype-paper);
}
.crab-design-composition-card h3 { font-size: .98rem; }
.crab-design-composition-card p, .crab-design-composition-themes p { font-size: .875rem; color: ${token.color.text.secondary}; }
.crab-design-composition-card [role="group"] { max-inline-size: 100%; }
.crab-design-composition-card p[role="status"] { color: ${token.color.text.primary}; }
.crab-design-composition-labels { grid-column: 1 / -1; }
.crab-design-composition-rail {
    --crab-button-container-width: 10rem;
    box-sizing: content-box;
    inline-size: var(--crab-button-container-width);
    max-inline-size: calc(100% - 1rem - 2px);
    padding: .5rem;
    border: 1px solid var(--crab-prototype-rule);
    border-radius: .55rem;
    background: var(--crab-prototype-panel);
}
.crab-design-composition-rail[data-width="wide"] { --crab-button-container-width: 17.5rem; }
.crab-design-composition-result {
    display: grid;
    grid-template-columns: minmax(0, 12rem) max-content;
    align-items: center;
    gap: .35rem 1.1rem;
    max-inline-size: 100%;
}
.crab-design-composition-themes { margin-block-start: .8rem; padding: .8rem 1rem; border: 1px solid var(--crab-prototype-rule); border-radius: .55rem; }
.crab-design-composition-themes summary { font-size: .875rem; cursor: pointer; }
.crab-design-composition-themes p { margin-top: .5rem; }
@container button-composition (max-width: 42rem) {
    .crab-design-composition-grid { grid-template-columns: minmax(0,1fr); }
}
@container button-composition (max-width: 28rem) {
    .crab-design-composition-result { grid-template-columns: minmax(0,1fr); justify-items: start; }
    .crab-design-composition-result p { min-block-size: 2lh; }
}
`;
