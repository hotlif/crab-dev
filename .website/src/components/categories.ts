/**
 * 组件分类 —— 用于侧边栏与总览页分组。
 * 顺序代表展示顺序; 未列出的 slug 归入 "其他"。
 */
export interface ComponentCategory {
    id: string;
    title: string;
    slugs: string[];
}

export const componentCategories: ComponentCategory[] = [
    {
        id: "general",
        title: "通用",
        slugs: ["rc-button", "rc-tag", "rc-badge", "rc-avatar", "rc-skeleton"],
    },
    {
        id: "layout",
        title: "布局",
        slugs: ["rc-app-main-layout", "rc-masonry"],
    },
    {
        id: "navigation",
        title: "导航",
        slugs: ["rc-menu", "rc-tabs", "rc-breadcrumbs", "rc-pagination", "rc-tree"],
    },
    {
        id: "data-entry",
        title: "数据录入",
        slugs: [
            "rc-form",
            "rc-line-edit",
            "rc-checkbox",
            "rc-radio",
            "rc-switch",
            "rc-select",
            "rc-slider",
            "rc-date-picker",
            "rc-color-picker",
        ],
    },
    {
        id: "data-display",
        title: "数据展示",
        slugs: ["rc-table", "rc-prose", "rc-virtual"],
    },
    {
        id: "feedback",
        title: "反馈",
        slugs: [
            "rc-alert",
            "rc-message",
            "rc-notification",
            "rc-dialog",
            "rc-drawer",
            "rc-tooltip",
        ],
    },
    {
        id: "primitive",
        title: "底层与令牌",
        slugs: [
            "rc-token-global",
            "rc-token-semantic",
            "rc-hooks",
            "rc-dropdown-container",
            "rc-component-preview",
        ],
    },
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
