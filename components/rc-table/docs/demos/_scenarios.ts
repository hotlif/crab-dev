import type { Row } from "../../src/types.js";
import { employeeRows, offices, dateAfter, makeOrders, random, SNAPSHOT_DATE } from "./_mock.js";

export interface OrganizationRow extends Row {
    dataRef: {
        name: string; type: string; code: string; department: string; jobTitle: string; position: string;
        manager: string; city: string; region: string; status: string; employeeNo: string; email: string;
        project: string; joinDate: string; headcount: number; payroll: number; annualCost: number; contractEnd: string;
    };
    children?: OrganizationRow[];
}
export function makeOrganization(): OrganizationRow[] {
    const employees = employeeRows().filter(row => row.dataRef.status !== "离职");
    const branch = (id: string, name: string, type: string, children: OrganizationRow[]): OrganizationRow => ({
        id, children, dataRef: {
            name, type, code: id, department: type === "部门" ? name : "", jobTitle: "", position: "",
            manager: children[0]?.dataRef.manager ?? "", city: children[0]?.dataRef.city ?? "",
            region: children[0]?.dataRef.region ?? "", status: "运营中", employeeNo: "", email: "",
            project: "", joinDate: "", contractEnd: "",
            headcount: children.reduce((sum, row) => sum + row.dataRef.headcount, 0),
            payroll: children.reduce((sum, row) => sum + row.dataRef.payroll, 0),
            annualCost: children.reduce((sum, row) => sum + row.dataRef.annualCost, 0),
        },
    });
    return offices.map((office, officeIndex) => {
        const members = employees.filter(row => row.dataRef.city === office.city);
        const departmentNames = [...new Set(members.map(row => row.dataRef.department))];
        const departments = departmentNames.map((name, deptIndex) => branch(
            "ORG-" + officeIndex + "-" + deptIndex, name, "部门",
            members.filter(row => row.dataRef.department === name).map(row => ({
                id: row.id, dataRef: {
                    ...row.dataRef, code: row.dataRef.employeeNo, type: "员工", headcount: 1,
                    payroll: row.dataRef.salary, annualCost: row.dataRef.totalComp,
                },
            })),
        ));
        return branch("ORG-" + officeIndex, "星海科技（" + office.city + "）有限公司", "公司", departments);
    });
}
export function countOrganization(rows: OrganizationRow[]): number {
    return rows.reduce((count, row) => count + 1 + countOrganization(row.children ?? []), 0);
}

export interface TicketRow extends Row {
    dataRef: {
        ticketNo: string; title: string; description: string; customer: string; orderNo: string; product: string;
        category: string; priority: string; owner: string; team: string; city: string; channel: string;
        status: string; created: string; due: string; resolved: string; elapsed: number; satisfaction: string;
    };
}
export function makeTickets(count = 1500): TicketRow[] {
    const orders = makeOrders(count * 3).filter(row => row.dataRef.status === "已完成").slice(0, count);
    const next = random(1226);
    const issues = [
        { title: "到货数量与签收单不一致", priority: "高", category: "配送异常",
            text: "客户拆箱核对时发现实物数量少于签收单。\n仓库已调取出库称重记录，正在核对承运商分拨记录。\n请在补发前确认缺失设备的序列号范围，并同步客户经理。" },
        { title: "设备首次安装需要远程协助", priority: "中", category: "安装支持",
            text: "客户预约工作日下午进行安装。\n请实施工程师提前确认网络环境与现场联系人。" },
        { title: "申请补开发票", priority: "低", category: "票据服务",
            text: "客户申请补发电子发票，请核对订单抬头后发送至合同联系人。" },
        { title: "批量设备间歇性离线", priority: "高", category: "技术故障",
            text: "现场反馈部分设备运行数小时后离线，重启可暂时恢复。\n同批次其他门店暂未出现该现象，初步怀疑现场网络环境。\n已收集系统日志、固件版本和交换机端口配置。\n下一步：在维护窗口逐项检查供电、地址冲突与固件兼容性。\n客户要求提供排查记录及复测结论后再关闭工单。" },
        { title: "预约门店操作培训", priority: "中", category: "使用培训",
            text: "门店新员工需要设备操作培训，请协调远程培训时间。\n客户经理确认参加人员后发送操作手册与会议邀请。" },
    ];
    return orders.map((order, index) => {
        const issue = issues[index % issues.length];
        const daysSinceDelivery = Math.floor((Date.parse(SNAPSHOT_DATE) - Date.parse(order.dataRef.deliveryDate)) / 86_400_000);
        const age = next(1, Math.min(30, daysSinceDelivery));
        const created = dateAfter(SNAPSHOT_DATE, -age);
        const closed = index % 5 < 3;
        const status = closed ? "已完成" : index % 5 === 3 ? "处理中" : "待客户反馈";
        const ticketNo = "SR-2026-" + String(index + 1).padStart(5, "0");
        return { id: ticketNo, height: issue.text.split("\n").length >= 4 ? 220 : issue.text.length > 60 ? 160 : 110, dataRef: {
            ticketNo, title: issue.title, description: issue.text, customer: order.dataRef.customer,
            orderNo: order.dataRef.orderNo, product: order.dataRef.product, category: issue.category,
            priority: issue.priority, owner: order.dataRef.owner, team: issue.category === "技术故障" ? "技术支持二组" : "客户服务一组",
            city: order.dataRef.city, channel: ["客户门户", "电话", "客户经理转交"][index % 3], status, created,
            due: dateAfter(created, issue.priority === "高" ? 1 : 3),
            resolved: closed ? dateAfter(created, Math.min(age, 2)) : "",
            elapsed: closed ? Math.min(age, 2) * 24 : age * 24,
            satisfaction: closed && index % 7 !== 0 ? ["满意", "满意", "一般"][index % 3] : "未评价",
        } };
    });
}

export interface StoreRow extends Row {
    dataRef: {
        storeCode: string; storeName: string; region: string; city: string;
        daily: Array<{ orders: number; units: number; revenue: number; returns: number }>;
    };
}
export const STORE_DAYS = 249;
export const STORE_COLUMNS = 4 + STORE_DAYS * 4;
export function makeStoreReport(count = 1000): StoreRow[] {
    const next = random(2026);
    return Array.from({ length: count }, (_, index) => {
        const office = offices[index % offices.length];
        const base = next(40, 220);
        const storeCode = "ST-" + String(index + 1).padStart(4, "0");
        return { id: storeCode, dataRef: {
            storeCode, storeName: office.city + "第" + (Math.floor(index / offices.length) + 1) + "门店",
            region: office.region, city: office.city,
            daily: Array.from({ length: STORE_DAYS }, (_, day) => {
                const weekend = [0, 6].includes(new Date(Date.UTC(2026, 0, day + 1)).getUTCDay());
                const orders = Math.round(base * next(80, 120) / 100 * (weekend ? 1.3 : 1));
                return { orders, units: orders * next(1, 3), revenue: orders * next(35, 160), returns: next(0, Math.floor(orders * 0.04)) };
            }),
        } };
    });
}
