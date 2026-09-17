import ColorPicker from "@crab-dev/rc-color-picker";
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
