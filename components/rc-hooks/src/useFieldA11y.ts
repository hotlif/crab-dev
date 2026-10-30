import { useId } from "react";

interface FieldA11yOptions {
    id?: string;
    supportingText?: string;
    errorText?: string;
    status?: "error" | "warning";
    describedBy?: string;
    hasCount?: boolean;
}

export interface FieldA11y {
    inputId: string;
    description: string | undefined;
    descriptionId: string;
    countId: string;
    fieldStatus: "error" | "warning" | undefined;
    describedBy: string | undefined;
}

/** Shared associations only; each control owns its label layout and interaction. */
export function useFieldA11y({ id, supportingText, errorText, status, describedBy, hasCount }: FieldA11yOptions): FieldA11y {
    const generatedId = useId();
    const description = errorText || supportingText;
    const descriptionId = `${generatedId}-description`;
    const countId = `${generatedId}-count`;
    const references = [describedBy, description ? descriptionId : undefined, hasCount ? countId : undefined]
        .flatMap(value => value?.split(/\s+/).filter(Boolean) ?? []);
    return {
        inputId: id ?? generatedId,
        description,
        descriptionId,
        countId,
        fieldStatus: errorText ? "error" as const : status,
        describedBy: [...new Set(references)].join(" ") || undefined,
    };
}
