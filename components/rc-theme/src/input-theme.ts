import { globalStyle } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import palette from "@crab-dev/rc-token-global";

// Field boundaries share one semantic contract, including fields without labels.
// Desktop focus rings are external; Material keeps its active outline inset.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
    @media (forced-colors: none) {
    :root,
    [data-crab-design="md3"] {
        --token-semantic-field-control-shadow: none;
        --token-semantic-field-control-shadow-focus: inset 0 0 0 2px ${token.color.border.focus};
        --token-semantic-field-control-shadow-error: inset 0 0 0 2px ${token.color.feedback.error.border};
        --token-semantic-field-control-shadow-warning: inset 0 0 0 2px ${token.color.feedback.warning.border};
        --token-semantic-field-label-color-focus: ${token.color.brand.primary};
        --token-semantic-field-option-radius: 0px;
        --token-semantic-field-option-color-selected: ${token.color.brand['on-container']};
        --token-semantic-field-option-background-selected: ${token.color.brand.container};
        --token-semantic-picker-calendar-cell-radius: ${token.shape.full};
        --token-semantic-picker-panel-radius: ${token.shape['extra-large']};
        --token-semantic-picker-panel-background: ${token.color.surface.high};
    }

    [data-crab-design="shadcn"][data-theme],
    [data-crab-design="apple"][data-theme] {
        --token-semantic-field-outlined-shadow-focus: var(--token-semantic-field-control-shadow-focus);
        --token-semantic-field-outlined-shadow-error: var(--token-semantic-field-control-shadow-error);
        --token-semantic-field-outlined-shadow-warning: var(--token-semantic-field-control-shadow-warning);
        --token-semantic-field-filled-shadow-focus: var(--token-semantic-field-control-shadow-focus);
        --token-semantic-field-filled-shadow-error: var(--token-semantic-field-control-shadow-error);
        --token-semantic-field-filled-shadow-warning: var(--token-semantic-field-control-shadow-warning);
        --token-semantic-field-label-color-focus: ${token.color.text.primary};
    }

    [data-crab-design="shadcn"] {
        --token-semantic-field-control-shadow: ${palette.shadow.xs};
        --token-semantic-field-control-shadow-focus: 0 0 0 3px color-mix(in oklch, ${token.color.focus.ring} 50%, transparent);
        --token-semantic-field-control-shadow-error: 0 0 0 3px color-mix(in oklch, ${token.color.feedback.error.border} 20%, transparent);
        --token-semantic-field-control-shadow-warning: 0 0 0 3px color-mix(in oklch, ${token.color.feedback.warning.border} 20%, transparent);
        --token-semantic-field-option-radius: 4px;
        --token-semantic-field-option-color-selected: ${token.color.text.primary};
        --token-semantic-field-option-background-selected: ${token.color.background['hover-subtle']};
        --token-semantic-picker-calendar-cell-radius: 4px;
        --token-semantic-picker-panel-radius: 8px;
        --token-semantic-picker-panel-background: ${token.color.surface.overlay};
    }

    [data-crab-design="shadcn"][data-theme="dark"] {
        --token-semantic-field-control-shadow-error: 0 0 0 3px color-mix(in oklch, ${token.color.feedback.error.border} 40%, transparent);
        --token-semantic-field-control-shadow-warning: 0 0 0 3px color-mix(in oklch, ${token.color.feedback.warning.border} 40%, transparent);
    }

    [data-crab-design="apple"] {
        --token-semantic-field-control-shadow: inset ${palette.shadow.sm};
        --token-semantic-field-control-shadow-focus: ${token.shadow['focus-ring']};
        --token-semantic-field-control-shadow-error: 0 0 0 3px color-mix(in oklch, ${token.color.feedback.error.border} 24%, transparent);
        --token-semantic-field-control-shadow-warning: 0 0 0 3px color-mix(in oklch, ${token.color.feedback.warning.border} 24%, transparent);
        --token-semantic-field-option-radius: 6px;
        --token-semantic-field-option-color-selected: ${token.color.text['on-brand']};
        --token-semantic-field-option-background-selected: ${token.color.brand.primary};
        --token-semantic-picker-calendar-cell-radius: 6px;
        --token-semantic-picker-panel-radius: 8px;
        --token-semantic-picker-panel-background: ${token.color.surface.overlay};
    }
    }
`;
