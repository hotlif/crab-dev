import { inputPreviews } from "./input.js";
import { displayPreviews, feedbackPreviews } from "./display.js";
import { navigationPreviews, layoutPreviews, dataPreviews } from "./structure.js";
import { foundationPreviews } from "./foundation.js";

const previews = {
    ...inputPreviews,
    ...displayPreviews,
    ...feedbackPreviews,
    ...navigationPreviews,
    ...layoutPreviews,
    ...dataPreviews,
    ...foundationPreviews,
};

export type CatalogPreviewName = keyof typeof previews;

export default function CatalogPreview({ name }: { name: CatalogPreviewName }) {
    return (
        <svg viewBox="0 0 240 156" aria-hidden="true" focusable="false" className="crab-catalog-preview">
            {previews[name]}
        </svg>
    );
}
