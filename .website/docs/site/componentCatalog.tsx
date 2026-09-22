import Button from "@crab-dev/rc-button";
import { useId } from "react";
import CatalogPreview from "./catalog/preview.js";
import type { CatalogPreviewName } from "./catalog/preview.js";
import { useSiteHref } from "./siteContext.js";
import "./catalogStyles.js";

interface Category {
    title: string;
    count: number;
}

function Arrow() {
    return (
        <svg viewBox="0 0 20 20" aria-hidden="true" className="crab-catalog-arrow">
            <path d="M4 10h12m-5-5 5 5-5 5" />
        </svg>
    );
}

export function CatalogIntro({ categories }: { categories: Category[] }) {
    const href = useSiteHref();
    return (
        <div className="crab-catalog-intro">
            <div className="crab-catalog-actions">
                <Button appearance="primary" href={href("guides/getting-started")}>
                    开始使用
                </Button>
                <Button appearance="text" href={href("learn")} iconAfter={<Arrow />}>
                    实战教程
                </Button>
            </div>
            <nav className="crab-catalog-categories" aria-label="组件分类索引">
                {categories.map((category) => (
                    <Button
                        key={category.title}
                        appearance="text"
                        href={href(`learn/components#${encodeURIComponent(category.title)}`)}
                    >
                        <span>{category.title}</span>
                        <span className="crab-catalog-category-count">{category.count}</span>
                    </Button>
                ))}
            </nav>
        </div>
    );
}

interface CatalogEntry {
    href: string;
    name: string;
    label: string;
    description: string;
    preview: CatalogPreviewName;
}

export function CatalogItem({ item }: { item: CatalogEntry }) {
    const { href: slug, name, label, description, preview } = item;
    const href = useSiteHref();
    const descriptionId = useId();
    return (
        <Button
            className="crab-catalog-item"
            appearance="text"
            href={href(slug)}
            aria-label={`${name} ${label}`.trim()}
            aria-describedby={descriptionId}
        >
            <span className="crab-catalog-artwork"><CatalogPreview name={preview} /></span>
            <span className="crab-catalog-item-heading">
                <span className="crab-catalog-item-title"><strong>{name}</strong><span className="crab-catalog-item-label">{label}</span></span>
                <Arrow />
            </span>
            <span className="crab-catalog-item-description" id={descriptionId}>{description}</span>
        </Button>
    );
}
