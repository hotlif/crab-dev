import { beforeAll, describe, expect, it, mock } from "@crab-dev/wake/test";
import { render, screen } from "@crab-dev/wake/test/react";
import type { ComponentType } from "react";

type HomeSectionProps = { href: (slug: string) => string };
let HomeHero: ComponentType<HomeSectionProps>;
let HomeCategories: ComponentType<HomeSectionProps>;

beforeAll(async () => {
    ({ HomeHero, HomeCategories } = await mock.import<typeof import("../learningHome.js")>("../learningHome.js"));
});

describe("LearningHome", () => {
    it("提供核心标题、CTA、分类导航和实战入口", async () => {
        const href = (slug: string) => `/${slug}`;
        await render(<><HomeHero href={href} /><HomeCategories href={href} /></>);
        expect(screen.getByRole("heading", { name: /为企业应用，.*构建清晰的界面。/, level: 1 })).toBeTruthy();
        expect(screen.getByRole("link", { name: /开始使用/ }).getAttribute("href")).toBe("/guides/getting-started");
        expect(screen.getByRole("link", { name: /组件目录/ }).getAttribute("href")).toBe("/learn/components");
        expect(screen.getByRole("navigation", { name: "组件分类跳转" }).querySelectorAll("a").length).toBe(6);
        expect(screen.getByRole("link", { name: "业务实战" }).getAttribute("href")).toBe("/#practice");
    });

});
