import { describe, it, expect } from "@jest/globals";
import { getTemplateStyle } from "../util";


describe('test rc-virtual', () => {
    it("test getTemplateStyle with uniform values", () => {
        const data = getTemplateStyle([20, 20, 20, 20])
        expect(data).toBe("repeat(4, 20px)");
    })

    it("test getTemplateStyle with mixed values", () => {
        const data = getTemplateStyle([20, 20, 20, 20, 80, 10, 10])
        expect(data).toBe("repeat(4, 20px) 80 repeat(2, 10px)");
    })
})
