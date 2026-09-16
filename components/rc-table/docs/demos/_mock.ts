import type { Row } from "../../src/types.js";

// 全部为虚构业务数据；固定快照与局部随机序列保证各示例互不影响、刷新可复现。
export const SNAPSHOT_DATE = "2026-09-12";
export const DAY = 86_400_000;
const currencyFormatter = new Intl.NumberFormat("zh-CN", {
    style: "currency", currency: "CNY", minimumFractionDigits: 2,
});
export const money = (value: number) => currencyFormatter.format(value);
export const dateAfter = (date: string, days: number) =>
    new Date(Date.parse(date) + days * DAY).toISOString().slice(0, 10);

export function random(seed: number) {
    let state = seed >>> 0;
    return (min: number, max: number) => {
        state = (Math.imul(state, 1664525) + 1013904223) >>> 0;
        return min + Math.floor((state / 4294967296) * (max - min + 1));
    };
}

export const offices = [
    { city: "北京", province: "北京市", region: "华北", district: "海淀区", street: "知春路" },
    { city: "天津", province: "天津市", region: "华北", district: "南开区", street: "鞍山西道" },
    { city: "上海", province: "上海市", region: "华东", district: "浦东新区", street: "张江路" },
    { city: "杭州", province: "浙江省", region: "华东", district: "滨江区", street: "江南大道" },
    { city: "南京", province: "江苏省", region: "华东", district: "建邺区", street: "江东中路" },
    { city: "深圳", province: "广东省", region: "华南", district: "南山区", street: "科技南路" },
    { city: "广州", province: "广东省", region: "华南", district: "天河区", street: "科韵路" },
    { city: "成都", province: "四川省", region: "西南", district: "武侯区", street: "天府大道" },
    { city: "重庆", province: "重庆市", region: "西南", district: "渝北区", street: "金开大道" },
    { city: "武汉", province: "湖北省", region: "华中", district: "洪山区", street: "珞喻路" },
    { city: "长沙", province: "湖南省", region: "华中", district: "岳麓区", street: "麓谷大道" },
    { city: "西安", province: "陕西省", region: "西北", district: "雁塔区", street: "科技路" },
] as const;
export const departments = [
    { name: "研发部", jobs: ["前端工程师", "后端工程师", "测试工程师"], project: "主数据平台升级" },
    { name: "产品部", jobs: ["产品经理", "业务分析师"], project: "门店数字化" },
    { name: "设计部", jobs: ["交互设计师", "视觉设计师"], project: "客户门户改版" },
    { name: "销售部", jobs: ["客户经理", "销售经理"], project: "区域客户拓展" },
    { name: "客户成功部", jobs: ["实施顾问", "客户成功经理"], project: "客户续约计划" },
    { name: "供应链部", jobs: ["采购专员", "计划专员"], project: "库存周转优化" },
    { name: "财务部", jobs: ["应收会计", "预算专员"], project: "业财一体化" },
    { name: "人力资源部", jobs: ["招聘专员", "薪酬专员"], project: "人才梯队建设" },
] as const;
const surnames = ["陈", "王", "李", "张", "刘", "周", "吴", "徐", "孙", "赵", "林", "黄", "郑", "何", "郭", "罗"];
const givenNames = ["思远", "雨桐", "子涵", "文博", "嘉宁", "晓敏", "明轩", "欣悦", "一帆", "梓萱", "志恒", "若琳", "景行", "可欣", "安然", "沐阳", "清禾", "晨曦", "书宁"];
export const personName = (index: number) =>
    surnames[index % surnames.length] + givenNames[Math.floor(index / surnames.length) % givenNames.length];

export interface Employee {
    employeeNo: string;
    name: string;
    department: string;
    jobTitle: string;
    position: string;
    manager: string;
    company: string;
    city: string;
    province: string;
    region: string;
    address: string;
    email: string;
    phone: string;
    age: number;
    status: string;
    joinDate: string;
    joinYear: number;
    yearsOfService: number;
    salary: number;
    bonus: number;
    stock: number;
    totalComp: number;
    performance: string;
    project: string;
    contractEnd: string;
}
export interface EmployeeRow extends Row { dataRef: Employee }

export function makeEmployees(count: number, seed = 912): Employee[] {
    const next = random(seed);
    return Array.from({ length: count }, (_, index) => {
        const office = offices[next(0, offices.length - 1)];
        const department = departments[next(0, departments.length - 1)];
        const trial = index % 13 === 0;
        const departed = !trial && index % 19 === 0;
        const serviceDays = trial ? next(7, 85) : next(200, 3500);
        const joinDate = dateAfter(SNAPSHOT_DATE, -serviceDays);
        const yearsOfService = Math.floor(serviceDays / 365.25);
        const level = next(0, Math.min(5, yearsOfService + 1));
        const salary = (70 + level * 35 + next(0, 30)) * 100;
        const bonus = trial ? 0 : salary * next(1, 4);
        const stock = level >= 3 ? next(3, 12) * 10000 : 0;
        const employeeNo = "EMP-" + String(index + 1).padStart(5, "0");
        return {
            employeeNo, name: personName(next(0, 300)),
            department: department.name, jobTitle: department.jobs[next(0, department.jobs.length - 1)],
            position: ["初级", "中级", "高级", "资深", "专家", "团队负责人"][level],
            manager: personName(30 + departments.indexOf(department)),
            company: "星海科技（" + office.city + "）有限公司",
            ...office, address: office.province + office.city + office.district + office.street + next(1, 200) + "号",
            email: departed ? "" : employeeNo.toLowerCase() + "@xinghai.example",
            phone: "138" + String(10000000 + index),
            age: 22 + yearsOfService + level + next(0, 8),
            status: departed ? "离职" : trial ? "试用" : "在职",
            joinDate, joinYear: Number(joinDate.slice(0, 4)), yearsOfService,
            salary, bonus, stock, totalComp: salary * 12 + bonus + stock,
            performance: trial ? "待评估" : ["B", "B", "B", "A", "A", "S", "C"][next(0, 6)],
            project: department.project,
            contractEnd: departed ? dateAfter(SNAPSHOT_DATE, -next(1, 90)) : dateAfter(SNAPSHOT_DATE, next(30, 1000)),
        };
    });
}
export const employeeRows = (count = 2000): EmployeeRow[] =>
    makeEmployees(count).map(dataRef => ({ id: dataRef.employeeNo, dataRef }));

export const products = [
    { sku: "NET-SW-24", name: "24口千兆企业交换机", category: "网络设备", unit: "台", price: 1899 },
    { sku: "NET-AP-6", name: "Wi-Fi 6 吸顶式无线接入点", category: "网络设备", unit: "台", price: 899 },
    { sku: "POS-T15", name: "15.6英寸双屏收银终端（含安装调试）", category: "门店设备", unit: "套", price: 4599 },
    { sku: "POS-SC-2", name: "二维条码扫描枪", category: "门店设备", unit: "支", price: 329 },
    { sku: "STO-SSD-2T", name: "企业级固态硬盘 2TB", category: "存储设备", unit: "块", price: 1399 },
    { sku: "OFF-MON-27", name: "27英寸低蓝光办公显示器", category: "办公设备", unit: "台", price: 1299 },
    { sku: "OFF-DOCK-C", name: "USB-C 多接口扩展坞", category: "办公设备", unit: "个", price: 269 },
    { sku: "SEC-CAM-4", name: "400万像素网络监控摄像机", category: "安防设备", unit: "台", price: 599 },
] as const;
const customers = [
    { name: "启明精密制造有限公司", industry: "制造业" },
    { name: "远峰连锁商业集团有限公司", industry: "零售" },
    { name: "泰和医疗器械供应链有限公司", industry: "医疗健康" },
    { name: "中联仓储物流有限公司", industry: "物流" },
    { name: "弘毅职业教育科技有限公司", industry: "教育" },
    { name: "云象数据技术有限公司", industry: "互联网" },
];
export type OrderStatus = "待审核" | "待发货" | "运输中" | "已完成" | "已取消";
export interface Order {
    orderNo: string; customer: string; industry: string; owner: string;
    region: string; province: string; city: string; address: string;
    sku: string; product: string; category: string; unit: string; quantity: number;
    unitPrice: number; discount: number; amount: number; paid: number; outstanding: number;
    paymentStatus: string; status: OrderStatus; orderDate: string; deliveryDate: string;
    channel: string; warehouse: string; trackingNo: string; remark: string;
}
export interface OrderRow extends Row { dataRef: Order }
export function makeOrders(count = 3000): OrderRow[] {
    const next = random(20260912);
    return Array.from({ length: count }, (_, index) => {
        const office = offices[next(0, offices.length - 1)];
        const customer = customers[next(0, customers.length - 1)];
        const product = products[next(0, products.length - 1)];
        const bucket = index % 20;
        const status: OrderStatus = bucket < 3 ? "待审核" : bucket < 7 ? "待发货" : bucket < 11 ? "运输中" : bucket < 19 ? "已完成" : "已取消";
        const age = status === "已完成" ? next(10, 180) : status === "运输中" ? next(2, 5) : next(0, 5);
        const orderDate = dateAfter(SNAPSHOT_DATE, -age);
        const quantity = next(2, 120);
        const discount = quantity >= 80 ? 0.08 : quantity >= 30 ? 0.03 : 0;
        const amount = Math.round(quantity * product.price * (1 - discount) * 100) / 100;
        const paid = status === "待审核" || status === "已取消" ? 0
            : status === "已完成" ? amount : Math.round(amount * (index % 3 === 0 ? 1 : 0.3) * 100) / 100;
        const outstanding = status === "已取消" ? 0 : Math.round((amount - paid) * 100) / 100;
        const orderNo = "SO-2026-" + String(index + 1).padStart(6, "0");
        return {
            id: orderNo,
            dataRef: {
                orderNo, customer: customer.name, industry: customer.industry,
                owner: personName(offices.indexOf(office) * 3 + index % 3),
                ...office, address: office.province + office.city + office.district + office.street + next(1, 200) + "号",
                sku: product.sku, product: product.name, category: product.category, unit: product.unit,
                quantity, unitPrice: product.price, discount, amount, paid, outstanding,
                paymentStatus: status === "已取消" ? "已关闭" : paid === 0 ? "未收款" : paid === amount ? "已结清" : "部分收款",
                status, orderDate, deliveryDate: status === "已取消" ? "" : dateAfter(orderDate, 7),
                channel: ["直营", "渠道伙伴", "企业商城"][index % 3],
                warehouse: office.city + "中心仓",
                trackingNo: status === "运输中" || status === "已完成" ? "SF" + String(100000000000 + index) : "",
                remark: index % 11 === 0 ? "分批配送，送货前一天联系收货人；工作日 09:00—17:00 收货。" : index % 7 === 0 ? "需随货附带设备序列号及验收清单。" : "",
            },
        };
    });
}

export interface Budget {
    code: string; project: string; department: string; owner: string; city: string;
    category: string; year: number; monthly: number[]; planned: number; actual: number;
    remaining: number; execution: number; status: string;
}
export interface BudgetRow extends Row { dataRef: Budget }
export function makeBudgets(count = 1200): BudgetRow[] {
    const next = random(9122026);
    return Array.from({ length: count }, (_, index) => {
        const department = departments[index % departments.length];
        const monthly = Array.from({ length: 12 }, () => next(80, 500) * 100);
        const planned = monthly.reduce((sum, value) => sum + value, 0);
        const actual = Math.round(monthly.slice(0, 8).reduce((sum, value) => sum + value, 0) * next(65, 160) / 100);
        const code = "BGT-2026-" + String(index + 1).padStart(4, "0");
        return { id: code, dataRef: {
            code, project: department.project + " · 第" + (Math.floor(index / 96) + 1) + "期",
            department: department.name, owner: personName(index % 32), city: offices[Math.floor(index / 8) % offices.length].city,
            category: ["软件服务", "设备采购", "实施交付", "运维服务"][Math.floor(index / 24) % 4],
            year: 2026, monthly, planned, actual, remaining: planned - actual,
            execution: actual / planned, status: actual > planned ? "超预算" : actual / planned > 0.85 ? "接近上限" : "执行中",
        } };
    });
}

export interface Inventory {
    recordNo: string; sku: string; product: string; category: string; unit: string; warehouse: string;
    city: string; region: string; location: string; batch: string; supplier: string;
    onHand: number; reserved: number; available: number; minimum: number; inTransit: number;
    cost: number; value: number; lastCountDate: string; nextCountDate: string; owner: string;
    status: string; note: string;
}
export interface InventoryRow extends Row { dataRef: Inventory }
export function makeInventory(count = 2000): InventoryRow[] {
    const next = random(918);
    return Array.from({ length: count }, (_, index) => {
        const product = products[index % products.length];
        const office = offices[Math.floor(index / products.length) % offices.length];
        const onHand = index % 17 === 0 ? 0 : next(10, 800);
        const reserved = next(0, onHand);
        const minimum = next(20, 80);
        const cost = Math.round(product.price * 0.7 * 100) / 100;
        const recordNo = "INV-" + String(index + 1).padStart(5, "0");
        return { id: recordNo, dataRef: {
            recordNo, sku: product.sku, product: product.name, category: product.category, unit: product.unit,
            warehouse: office.city + "中心仓", city: office.city, region: office.region,
            location: "A" + String(Math.floor(index / 96) + 1).padStart(2, "0") + "-" + String(index % 24 + 1).padStart(2, "0"),
            batch: "LOT-202608-" + String(index + 1).padStart(5, "0"),
            supplier: product.category + "华东供应中心", onHand, reserved, available: onHand - reserved,
            minimum, inTransit: onHand - reserved < minimum ? minimum * 3 : 0,
            cost, value: Math.round(onHand * cost * 100) / 100,
            lastCountDate: dateAfter(SNAPSHOT_DATE, -next(1, 30)), nextCountDate: dateAfter(SNAPSHOT_DATE, next(1, 7)),
            owner: personName(offices.indexOf(office)), status: onHand === 0 ? "缺货" : onHand - reserved < minimum ? "需补货" : "正常",
            note: index % 9 === 0 ? "外箱轻微破损，已单独存放，盘点时复核包装。" : "",
        } };
    });
}
export function updateInventory(item: Inventory, onHand: number, note: string): Inventory {
    return {
        ...item, onHand, note, available: onHand - item.reserved,
        value: Math.round(onHand * item.cost * 100) / 100,
        status: onHand === 0 ? "缺货" : onHand - item.reserved < item.minimum ? "需补货" : "正常",
    };
}
