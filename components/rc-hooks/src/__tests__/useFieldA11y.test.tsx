import { describe, expect, it } from "@crab-dev/wake/test";
import { renderHook } from "@crab-dev/wake/test/react";
import { useFieldA11y } from "../useFieldA11y.js";

describe("field accessibility associations", () => {
    it("keeps associations stable when an error replaces support text and a counter appears", async () => {
        const { result, rerender } = await renderHook(({ errorText, hasCount }: { errorText?: string; hasCount: boolean }) => useFieldA11y({
            id: "account", supportingText: "Use your work account", describedBy: "external external", errorText, hasCount,
        }), { initialProps: { hasCount: false, errorText: undefined as string | undefined } });
        const { descriptionId, countId } = result.current;
        expect(result.current.inputId).toBe("account");
        expect(result.current.description).toBe("Use your work account");
        expect(result.current.describedBy).toBe(`external ${descriptionId}`);
        await rerender({ errorText: "Account is required", hasCount: true });
        expect(result.current.descriptionId).toBe(descriptionId);
        expect(result.current.countId).toBe(countId);
        expect(result.current.description).toBe("Account is required");
        expect(result.current.fieldStatus).toBe("error");
        expect(result.current.describedBy).toBe(`external ${descriptionId} ${countId}`);
    });

    it("allocates distinct control IDs and leaves absent descriptions unreferenced", async () => {
        const first = await renderHook(() => useFieldA11y({ status: "warning" }));
        const second = await renderHook(() => useFieldA11y({}));
        expect(first.result.current.inputId).not.toBe(second.result.current.inputId);
        expect(first.result.current.describedBy).toBeUndefined();
        expect(first.result.current.fieldStatus).toBe("warning");
    });
});
