import manifest from "../_generated/manifest.js";

/**
 * 组件分类 —— 用于侧边栏与总览页分组。
 * 顺序代表展示顺序; 分类数据来自各组件 package.json 的 category 字段。
 */
export interface ComponentCategory {
    id: string;
    title: string;
    slugs: string[];
}

const categoryDefinitions = [
    { id: "general", title: "通用" },
    { id: "layout", title: "布局" },
    { id: "navigation", title: "导航" },
    { id: "data-entry", title: "数据录入" },
    { id: "data-display", title: "数据展示" },
    { id: "feedback", title: "反馈" },
    { id: "primitive", title: "底层与令牌" },
] as const;

const knownCategoryIds = new Set<string>(categoryDefinitions.map(item => item.id));

const categorySlugs = new Map<string, string[]>();
const uncategorizedSlugs: string[] = [];

for (const item of manifest as Array<{ slug: string; category?: string }>) {
    const categoryId = item.category ?? "other";
    if (!knownCategoryIds.has(categoryId)) {
        uncategorizedSlugs.push(item.slug);
        continue;
    }

    const slugs = categorySlugs.get(categoryId);
    if (slugs) {
        slugs.push(item.slug);
    } else {
        categorySlugs.set(categoryId, [item.slug]);
    }
}

export const componentCategories: ComponentCategory[] = [
    ...categoryDefinitions
        .map(category => ({
            id: category.id,
            title: category.title,
            slugs: categorySlugs.get(category.id) ?? [],
        }))
        .filter(category => category.slugs.length > 0),
    ...(uncategorizedSlugs.length > 0
        ? [{ id: "other", title: "其他", slugs: uncategorizedSlugs }]
        : []),
];

/**
 * 按分类组织组件; 返回 [(category, items)...]。
 * 未在分类中声明的组件归入末尾的 "其他"。
 */
export const groupComponents = <T extends { slug: string }>(
    items: T[],
): Array<{ category: ComponentCategory; items: T[] }> => {
    const map = new Map<string, T>(items.map(it => [it.slug, it]));
    const result: Array<{ category: ComponentCategory; items: T[] }> = [];
    const used = new Set<string>();

    for (const cat of componentCategories) {
        const list: T[] = [];
        for (const slug of cat.slugs) {
            const it = map.get(slug);
            if (it) {
                list.push(it);
                used.add(slug);
            }
        }
        if (list.length > 0) result.push({ category: cat, items: list });
    }

    const rest = items.filter(it => !used.has(it.slug));
    if (rest.length > 0) {
        result.push({
            category: { id: "other", title: "其他", slugs: rest.map(it => it.slug) },
            items: rest,
        });
    }

    return result;
};
