import { describe, it, expect } from "@jest/globals";
import { getTemplateStyle } from "../src/util";


describe('test rc-virtual', () => {
    it("test getTemplateStyle", () => {
        const data = getTemplateStyle([20, 20, 20, 20])
        expect(data).toBe("repeat(4, 20px) ");
    })
})
