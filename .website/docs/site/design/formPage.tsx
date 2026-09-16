import { useId } from "react";
import ProfileExample from "./profile.js";
import DesignPreview, { useDesignPreview } from "./preview.js";

function FormContent() {
    const { theme, density } = useDesignPreview();
    const id = useId();
    return <section className="cl-section" aria-labelledby={`${id}-form`}><div><p className="cl-kicker">05 / EDITING</p><h2 id={`${id}-form`}>复杂任务，逐步展开</h2></div><ProfileExample theme={theme} density={density} /></section>;
}

export default function FormPage() {
    return <DesignPreview><FormContent /></DesignPreview>;
}
