import { readFileSync } from "node:fs";
import path from "node:path";
import { repositoryRoot } from "../../../scripts/library-manifest.mjs";

const densities = new Set(["compact", "regular", "spacious"]);
const layouts = new Set(["grid", "wide"]);
const demoName = /^[^/\\]+\.demo\.tsx$/;

export function validatePresentation(value, context) {
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error(`${context}: 展示配置必须是对象`);
    for (const key of Object.keys(value)) if (!["layout", "previewDensity", "groups", "heroDemo"].includes(key)) throw new Error(`${context}: 未知展示配置 ${key}`);
    if (value.layout !== undefined && !layouts.has(value.layout)) throw new Error(`${context}: 无效 layout`);
    if (value.previewDensity !== undefined && !densities.has(value.previewDensity)) throw new Error(`${context}: 无效 previewDensity`);
    if (value.heroDemo !== undefined && !demoName.test(value.heroDemo)) throw new Error(`${context}: 无效 heroDemo`);
    if (value.groups !== undefined && !Array.isArray(value.groups)) throw new Error(`${context}: groups 必须是数组`);
    const names = new Set(), titles = new Set();
    for (const group of value.groups ?? []) {
        if (!group || typeof group.title !== "string" || !group.title.trim() || titles.has(group.title)) throw new Error(`${context}: Demo 分组标题无效或重复`);
        titles.add(group.title);
        if (!Array.isArray(group.demos) || !group.demos.length) throw new Error(`${context}: Demo 分组不能为空`);
        for (const name of group.demos) {
            if (typeof name !== "string" || !demoName.test(name)) throw new Error(`${context}: Demo 分组文件名无效`);
            if (names.has(name)) throw new Error(`${context}: Demo 分组重复：${name}`);
            names.add(name);
        }
    }
    return { layout: "wide", previewDensity: "regular", groups: [], ...value };
}

/** Read authored metadata again so long-running documentation watches stay fresh. */
export function readPresentation(slug, { root = repositoryRoot } = {}) {
    if (!/^rc-[a-z0-9-]+$/.test(slug)) throw new Error("无效组件路径");
    const file = path.join(root, "components", slug, "docs/presentation.json");
    try { return validatePresentation(JSON.parse(readFileSync(file, "utf8")), file); }
    catch (error) {
        if (error.code === "ENOENT") return validatePresentation({}, file);
        throw error;
    }
}

export const densityFor = slug => readPresentation(slug).previewDensity;
export const layoutFor = slug => readPresentation(slug).layout;

export function organizeDemos(slug, demos, options) {
    const { groups } = readPresentation(slug, options);
    if (!groups.length) return demos.map(demo => ({ ...demo, group: null }));
    const byName = new Map(demos.map(demo => [path.posix.basename(demo.id), demo]));
    const organized = [], assigned = new Set();
    for (const group of groups) for (const name of group.demos) {
        const demo = byName.get(name);
        if (!demo) throw new Error(`${slug}: Demo 分组引用不存在的文件：${name}`);
        assigned.add(name);
        organized.push({ ...demo, group: group.title });
    }
    const unassigned = [...byName.keys()].filter(name => !assigned.has(name));
    if (unassigned.length) throw new Error(`${slug}: Demo 未分组：${unassigned.join(", ")}`);
    return organized;
}
