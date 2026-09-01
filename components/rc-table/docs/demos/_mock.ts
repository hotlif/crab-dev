/**
 * demo 共享的「真实业务数据」生成模块。
 *
 * 为什么存在：fakerZH_CN 的 commerce.department() / person.jobTitle() 在中文 locale 下
 * 仍返回英文（"Garden" / "Lead Solutions Orchestrator"），放进中文表格里很假；这里用
 * 人工整理的中文词库 + 固定 seed 的工厂，产出稳定、可复现、看着像真实业务的数据，供各 demo 复用。
 *
 * 注意：本文件不是 *.demo.tsx，Wake Docs 不会把它当 demo 扫描。
 */

import { fakerZH_CN as faker } from "@faker-js/faker";

// ─── 中文真实词库 ──────────────────────────────────────────────────────────────

export const DEPARTMENTS = [
    "研发部", "产品部", "设计部", "市场部", "销售部", "人力资源部",
    "财务部", "运维部", "数据部", "法务部", "客户成功部", "供应链部",
] as const;

export const JOB_TITLES = [
    "前端工程师", "后端工程师", "全栈工程师", "测试工程师", "运维工程师",
    "数据分析师", "算法工程师", "产品经理", "高级产品经理", "UI 设计师",
    "交互设计师", "视觉设计师", "市场专员", "销售经理", "客户经理",
    "人力资源专员", "财务专员", "法务顾问", "项目经理", "技术总监",
] as const;

export const POSITIONS = [
    "实习", "初级", "中级", "高级", "资深", "专家", "团队负责人", "总监",
] as const;

export const CITIES = [
    "北京", "上海", "广州", "深圳", "杭州", "南京", "成都", "重庆",
    "武汉", "西安", "苏州", "天津", "长沙", "厦门", "青岛",
] as const;

export const PROVINCES = [
    "北京市", "上海市", "广东省", "浙江省", "江苏省", "四川省", "湖北省",
    "陕西省", "山东省", "湖南省", "福建省", "重庆市", "天津市",
] as const;

export const INDUSTRIES = [
    "互联网", "制造业", "金融", "零售", "医疗健康", "教育",
    "物流", "能源", "房地产", "文娱传媒",
] as const;

export const PROJECTS = [
    "主数据平台", "经营分析看板", "供应链优化", "门店数字化", "风控中台",
    "物流协同平台", "能源巡检系统", "医药追溯平台", "客服系统重构",
    "仓储自动化", "营销自动化", "数据治理平台",
] as const;

export const COMPANIES = [
    "星海科技", "云象数据", "启明制造", "远峰零售", "辰光金融", "中联物流",
    "博睿能源", "泰和医药", "弘毅教育", "锐思网络", "瀚海智能", "聚信集团",
    "嘉沃信息", "鼎盛供应链", "未来传媒", "恒通地产",
] as const;

export const STATUSES = ["在职", "试用", "离职"] as const;

export const PERFORMANCES = ["S", "A", "B", "C"] as const;

export const RISK_LEVELS = ["低", "中", "高"] as const;

export const CHANNELS = ["直营", "伙伴", "代理", "线上"] as const;

export const TAGS = ["核心", "骨干", "潜力", "稳定", "新人"] as const;

export const GENDERS = ["男", "女"] as const;

// ─── 类型 ──────────────────────────────────────────────────────────────────────

/** 覆盖所有 demo 字段的员工记录超集；各 demo 按需取子集。 */
export interface Employee {
    employeeNo: string
    name: string
    gender: (typeof GENDERS)[number]
    age: number
    email: string
    phone: string
    department: (typeof DEPARTMENTS)[number]
    jobTitle: (typeof JOB_TITLES)[number]
    position: (typeof POSITIONS)[number]
    performance: (typeof PERFORMANCES)[number]
    status: (typeof STATUSES)[number]
    company: (typeof COMPANIES)[number]
    industry: (typeof INDUSTRIES)[number]
    city: (typeof CITIES)[number]
    province: (typeof PROVINCES)[number]
    address: string
    salary: number
    bonus: number
    stock: number
    totalComp: number
    joinDate: string
    joinYear: number
    yearsOfService: number
    project: (typeof PROJECTS)[number]
    tag: (typeof TAGS)[number]
    channel: (typeof CHANNELS)[number]
    riskLevel: (typeof RISK_LEVELS)[number]
}

// ─── 工厂 ──────────────────────────────────────────────────────────────────────

const CURRENT_YEAR = 2026;

/**
 * 生成 count 条真实感员工数据。固定 seed 保证可复现；部门 / 职位一律取自中文词库。
 * @param count 行数
 * @param seed faker 种子（不同 demo 可传不同值以获得不同样本）
 */
export function makeEmployees(count: number, seed = 20260625): Employee[] {
    faker.seed(seed);
    return Array.from({ length: count }, (_, index) => {
        const salary = faker.number.int({ min: 8000, max: 60000 });
        const bonus = faker.number.int({ min: 0, max: 80000 });
        const stock = faker.number.int({ min: 0, max: 50000 });
        const hireDate = faker.date.between({ from: "2014-01-01", to: "2024-12-31" });
        const joinYear = hireDate.getFullYear();
        return {
            employeeNo: `EMP-${String(index + 1).padStart(4, "0")}`,
            name: faker.person.fullName(),
            gender: faker.helpers.arrayElement(GENDERS),
            age: faker.number.int({ min: 22, max: 58 }),
            email: faker.internet.email(),
            phone: `1${faker.string.numeric(10)}`,
            department: faker.helpers.arrayElement(DEPARTMENTS),
            jobTitle: faker.helpers.arrayElement(JOB_TITLES),
            position: faker.helpers.arrayElement(POSITIONS),
            performance: faker.helpers.arrayElement(PERFORMANCES),
            status: faker.helpers.arrayElement(STATUSES),
            company: faker.helpers.arrayElement(COMPANIES),
            industry: faker.helpers.arrayElement(INDUSTRIES),
            city: faker.helpers.arrayElement(CITIES),
            province: faker.helpers.arrayElement(PROVINCES),
            address: faker.location.streetAddress(),
            salary,
            bonus,
            stock,
            totalComp: salary + bonus + stock,
            joinDate: hireDate.toISOString().slice(0, 10),
            joinYear,
            yearsOfService: Math.max(0, CURRENT_YEAR - joinYear),
            project: faker.helpers.arrayElement(PROJECTS),
            tag: faker.helpers.arrayElement(TAGS),
            channel: faker.helpers.arrayElement(CHANNELS),
            riskLevel: faker.helpers.arrayElement(RISK_LEVELS),
        };
    });
}
