import ColorPicker from "@crab-dev/rc-color-picker";
import "@crab-dev/rc-color-picker/css/index.css";
export default function Example() {
    return (
        <ColorPicker
            defaultValue={{
                lightness: 0.65,
                chroma: 0.16,
                hue: 250,
            }}
        />
    );
}
