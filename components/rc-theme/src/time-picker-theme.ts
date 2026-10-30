import { globalStyle } from '@crab-dev/css';
import palette from '@crab-dev/rc-token-global';
import { desktopTimePickerContract as desktop } from '@crab-dev/rc-token-semantic';

globalStyle`
    :root, [data-crab-design="md3"] {
        --token-semantic-picker-time-input-width: initial;
        --token-semantic-picker-time-input-height: initial;
        --token-semantic-picker-time-input-font-size: initial;
        --token-semantic-picker-time-input-font-weight: initial;
        --token-semantic-picker-time-input-line-height: initial;
        --token-semantic-picker-time-input-radius: initial;
        --token-semantic-picker-time-dial-field-width: initial;
        --token-semantic-picker-time-dial-field-width-24h: initial;
        --token-semantic-picker-time-dial-field-height: initial;
        --token-semantic-picker-time-dial-field-font-size: initial;
        --token-semantic-picker-time-dial-field-line-height: initial;
        --token-semantic-picker-time-period-width: initial;
        --token-semantic-picker-time-period-horizontal-width: initial;
        --token-semantic-picker-time-period-horizontal-height: initial;
    }
    [data-crab-design="apple"], [data-crab-design="shadcn"] {
        --token-semantic-picker-time-input-width: ${desktop.input.width};
        --token-semantic-picker-time-input-height: ${desktop.input.height};
        --token-semantic-picker-time-input-font-size: ${desktop.input['font-size']};
        --token-semantic-picker-time-input-font-weight: ${desktop.input['font-weight']};
        --token-semantic-picker-time-input-line-height: ${desktop.input['line-height']};
        --token-semantic-picker-time-dial-field-width: ${desktop['dial-field'].width};
        --token-semantic-picker-time-dial-field-width-24h: ${desktop['dial-field']['width-24h']};
        --token-semantic-picker-time-dial-field-height: ${desktop['dial-field'].height};
        --token-semantic-picker-time-dial-field-font-size: ${desktop['dial-field']['font-size']};
        --token-semantic-picker-time-dial-field-line-height: ${desktop['dial-field']['line-height']};
        --token-semantic-picker-time-period-width: ${desktop.period.width};
        --token-semantic-picker-time-period-horizontal-width: ${desktop.period['horizontal-width']};
        --token-semantic-picker-time-period-horizontal-height: ${desktop.period['horizontal-height']};
    }
    [data-crab-design="apple"] { --token-semantic-picker-time-input-radius: ${palette.radius[3]}; }
    [data-crab-design="shadcn"] { --token-semantic-picker-time-input-radius: ${palette.radius[4]}; }
`;
