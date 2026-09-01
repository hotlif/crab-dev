import { describe, expect, it } from "@crab-dev/wake/test";
import { OverStateEnum, NodeType, NodeEditStateType, LoadStateType } from "../type.js";
describe("type enums", () => {
    describe("OverStateEnum", () => {
        it("has UPWARD", () => {
            expect(OverStateEnum.UPWARD).toBe(0);
        });
        it("has DOWN", () => {
            expect(OverStateEnum.DOWN).toBe(1);
        });
        it("has INSIDE", () => {
            expect(OverStateEnum.INSIDE).toBe(2);
        });
    });
    describe("NodeType", () => {
        it("has FOLDER", () => {
            expect(NodeType.FOLDER).toBe(0);
        });
        it("has FILE", () => {
            expect(NodeType.FILE).toBe(1);
        });
    });
    describe("NodeEditStateType", () => {
        it("has CREATE", () => {
            expect(NodeEditStateType.CREATE).toBe(0);
        });
        it("has DELETE", () => {
            expect(NodeEditStateType.DELETE).toBe(1);
        });
        it("has UPDATE", () => {
            expect(NodeEditStateType.UPDATE).toBe(2);
        });
    });
    describe("LoadStateType", () => {
        it("has UNLOADED", () => {
            expect(LoadStateType.UNLOADED).toBe(0);
        });
        it("has LOADING", () => {
            expect(LoadStateType.LOADING).toBe(1);
        });
        it("has LOADING_COMPLETED", () => {
            expect(LoadStateType.LOADING_COMPLETED).toBe(2);
        });
    });
});
