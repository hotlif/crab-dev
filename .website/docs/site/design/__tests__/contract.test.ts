import { describe, expect, it } from "@crab-dev/wake/test";
import { colors } from "../tokens.js";
import { filterProjects, initialProfile, normalizeProfile, validateProfile } from "../data.js";

import { contrast } from "../../__tests__/colorAssertions.js";

describe("设计样板视觉契约", () => {
    for (const [name, color] of Object.entries(colors)) {
        it(`${name} 正文、选中及按钮文字满足 4.5:1，边界与焦点满足 3:1`, () => {
            for (const surface of [color.canvas, color.surface, color.elevated]) {
                for (const text of [color.text, color.secondary, color.muted]) expect(contrast(text, surface)).toBeGreaterThanOrEqual(4.5);
                expect(contrast(color.border, surface)).toBeGreaterThanOrEqual(3);
                expect(contrast(color.focus, surface)).toBeGreaterThanOrEqual(3);
            }
            for (const background of [color.brand, color.hover, color.active]) expect(contrast(color.onBrand, background)).toBeGreaterThanOrEqual(4.5);
            expect(contrast(color.onSelected, color.selected)).toBeGreaterThanOrEqual(4.5);
        });
    }
    it("搜索宽容处理空白与大小写，并与状态求交集", () => {
        expect(filterProjects("  prj-001  ", "全部状态").map(row => row.id)).toEqual(["PRJ-001"]);
        expect(filterProjects("林晓", "进行中").map(row => row.id)).toEqual(["PRJ-001", "PRJ-007"]);
        expect(filterProjects("不存在", "全部状态")).toHaveLength(0);
    });
    it("表单拒绝空白姓名与无效邮箱，保存时规范化输出", () => {
        expect(validateProfile({ ...initialProfile, name: "  ", email: "invalid" })).toEqual({ name: "请填写成员姓名。", email: "请输入有效邮箱，例如 lin@example.com。" });
        expect(normalizeProfile({ ...initialProfile, name: "  林晓 ", email: " LIN@EXAMPLE.COM " })).toEqual(initialProfile);
    });
});
