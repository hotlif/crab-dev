import { useId } from "react";
import Workbench from "./workbench.js";
import DesignPreview, { useDesignPreview } from "./preview.js";

function WorkbenchContent() {
    const { density, touch } = useDesignPreview();
    const id = useId();
    return <section className="cl-section" aria-labelledby={`${id}-workbench`}><div><p className="cl-kicker">04 / WORKSPACE</p><h2 id={`${id}-workbench`}>数据工作台</h2></div><Workbench density={density} touch={touch} /></section>;
}

export default function WorkbenchPage() {
    return <DesignPreview><WorkbenchContent /></DesignPreview>;
}
