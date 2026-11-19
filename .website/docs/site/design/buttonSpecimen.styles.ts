import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";

globalStyle`
.crab-design-specimen {
    display: grid;
    gap: 1rem;
    padding: 1rem;
    border-inline: 1px solid var(--crab-prototype-rule);
    border-block-end: 1px solid var(--crab-prototype-rule);
    background: var(--crab-prototype-paper);
}
.crab-design-specimen-intro { display: grid; gap: .3rem; }
.crab-design-specimen-intro h3 { font-size: .95rem; }
.crab-design-specimen-intro p { font-size: .875rem; color: ${token.color.text.secondary}; }
.crab-design-specimen-controls { display: grid; grid-template-columns: repeat(4,minmax(0,1fr)); gap: .7rem; }
.crab-design-specimen-stage {
    display: grid;
    grid-template-columns: minmax(0,1.4fr) minmax(0,1fr);
    align-items: center;
    gap: .9rem;
    padding: .85rem;
    border: 1px solid var(--crab-prototype-rule);
    border-radius: .55rem;
    background: var(--crab-prototype-panel);
}
.crab-design-specimen-surface { display: grid; grid-template-columns: minmax(0, 1fr); min-width: 0; min-height: 8.5rem; place-items: center; }
.crab-design-specimen-surface > button { max-inline-size: 100%; }
.crab-design-specimen-readout { display: grid; gap: .4rem; font-size: .82rem; color: ${token.color.text.secondary}; font-variant-numeric: tabular-nums; }
.crab-design-specimen-readout [role="status"] { color: ${token.color.text.primary}; }
@container button-matrix (max-width: 42rem) {
    .crab-design-specimen-controls { grid-template-columns: repeat(2,minmax(0,1fr)); }
    .crab-design-specimen-stage { grid-template-columns: minmax(0,1fr); }
}
`;
