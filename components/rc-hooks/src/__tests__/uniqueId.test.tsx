import { describe, expect, it } from "@crab-dev/wake/test";
import { uniqueId } from "../uniqueId.js";
describe("uniqueId", () => {
    it("连续调用返回互不相同的 id", () => {
        expect(uniqueId()).not.toBe(uniqueId());
    });
    it("无前缀时返回纯数字字符串", () => {
        expect(uniqueId()).toMatch(/^\d+$/);
    });
    it("带前缀时以前缀开头，后接自增整数", () => {
        expect(uniqueId("message-")).toMatch(/^message-\d+$/);
    });
    it("计数器单调递增", () => {
        const first = Number(uniqueId());
        const second = Number(uniqueId());
        expect(second).toBeGreaterThan(first);
    });
});
