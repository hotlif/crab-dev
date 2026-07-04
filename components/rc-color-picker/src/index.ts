import ColorPicker from "./colorPicker/colorPicker.js";
import ColorPickerPanel from "./panels/colorPickerPanel.js";

export type { ColorPickerProps } from "./colorPicker/colorPicker.js";
export type { ColorPickerPanelProps } from "./panels/colorPickerPanel.js";
export type {
    OKLCHValue,
    ColorFormat,
    ColorPreset,
    Locale,
    ColorPickerPanelLocale,
    ColorPickerOverlayLocale,
} from "./types.js";

export { ColorPickerPanel };
export default ColorPicker;
