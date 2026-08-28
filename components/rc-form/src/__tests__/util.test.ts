import { describe, expect, it } from "@crab-dev/wake/test";
import { equalsNamePath, getRecordValue, setRecordValue } from "../util.js";
describe("util", () => {
    it("setRecordValue and getRecordValue support string path", () => {
        const record: Record<string, unknown> = {};
        setRecordValue(record, "name", "crab");
        expect(record.name).toBe("crab");
        expect(getRecordValue(record, "name")).toBe("crab");
    });
    it("setRecordValue and getRecordValue support array path", () => {
        const record: Record<string, unknown> = {};
        setRecordValue(record, ["user", "profile", "age"], 18);
        expect(getRecordValue(record, ["user", "profile", "age"])).toBe(18);
    });
    it("setRecordValue does nothing for empty path array", () => {
        const record: Record<string, unknown> = { keep: 1 };
        setRecordValue(record, [] as unknown as string[], 100);
        expect(record).toEqual({ keep: 1 });
    });
    it("getRecordValue returns undefined for nullish record or missing path", () => {
        expect(getRecordValue(undefined, "name")).toBeUndefined();
        expect(getRecordValue({ user: {} }, ["user", "name"])).toBeUndefined();
        expect(getRecordValue({ user: null }, ["user", "name"])).toBeUndefined();
    });
    it("equalsNamePath compares string and array paths correctly", () => {
        expect(equalsNamePath("name", "name")).toBe(true);
        expect(equalsNamePath(["user", "name"], ["user", "name"])).toBe(true);
        expect(equalsNamePath(["user", "name"], ["user", "age"])).toBe(false);
        expect(equalsNamePath("name", ["name"])).toBe(false);
    });
});
