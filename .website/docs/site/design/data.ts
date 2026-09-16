import type { Row } from "@crab-dev/rc-table";

export interface ProjectRow extends Row {
    dataRef: { name: string; owner: string; status: string; budget: number; updated: string };
}

export const projects: ProjectRow[] = [
    ["PRJ-001", "海蓝设计系统", "林晓", "进行中", 86000, "09-14"],
    ["PRJ-002", "客户服务工作台", "陈瑜", "待启动", 48000, "09-13"],
    ["PRJ-003", "供应链数据平台", "周宁", "进行中", 128000, "09-13"],
    ["PRJ-004", "团队知识库", "林晓", "已完成", 32000, "09-12"],
    ["PRJ-005", "采购审批流程", "陈瑜", "进行中", 64000, "09-12"],
    ["PRJ-006", "资产管理门户", "周宁", "待启动", 56000, "09-11"],
    ["PRJ-007", "分析报告中心", "林晓", "进行中", 92000, "09-10"],
    ["PRJ-008", "账户安全升级", "陈瑜", "已完成", 41000, "09-09"],
    ["PRJ-009", "订单交付追踪", "周宁", "进行中", 73000, "09-08"],
    ["PRJ-010", "运营指标看板", "林晓", "待启动", 58000, "09-07"],
    ["PRJ-011", "合同归档工具", "陈瑜", "已完成", 36000, "09-06"],
    ["PRJ-012", "权限审计中心", "周宁", "进行中", 69000, "09-05"],
].map(([id, name, owner, status, budget, updated]) => ({
    id: String(id),
    dataRef: { name: String(name), owner: String(owner), status: String(status), budget: Number(budget), updated: String(updated) },
}));

export function filterProjects(query: string, status: string) {
    const normalized = query.trim().toLocaleLowerCase();
    return projects.filter(({ id, dataRef }) =>
        (status === "全部状态" || dataRef.status === status)
        && `${id} ${dataRef.name} ${dataRef.owner}`.toLocaleLowerCase().includes(normalized),
    );
}

export interface Profile { name: string; email: string; team: string }
export const initialProfile: Profile = { name: "林晓", email: "lin@example.com", team: "产品设计" };
export function normalizeProfile(profile: Profile): Profile {
    return { name: profile.name.trim(), email: profile.email.trim().toLowerCase(), team: profile.team };
}
export function validateProfile(profile: Profile) {
    return {
        name: profile.name.trim() ? "" : "请填写成员姓名。",
        email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email.trim()) ? "" : "请输入有效邮箱，例如 lin@example.com。",
    };
}
