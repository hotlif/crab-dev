import { describe, expect, it } from "@crab-dev/wake/test";
import { departments, offices, makeEmployees, makeOrders, makeBudgets, makeInventory, updateInventory, SNAPSHOT_DATE } from "../../docs/demos/_mock.js";
import { makeOrganization, countOrganization, makeTickets, makeStoreReport, STORE_COLUMNS } from "../../docs/demos/_scenarios.js";
import { approveOrders, buildTsv, filterOrders, matchesNumber } from "../../docs/demos/_operations.js";

describe("Table business demo fixtures", () => {
    it("keeps employee roles, geography, tenure and annual compensation consistent at scale", () => {
        const employees = makeEmployees(2000);
        expect(employees.length).toBe(2000);
        expect(new Set(employees.map(row => row.employeeNo)).size).toBe(2000);
        expect(employees.every(row => {
            const department = departments.find(item => item.name === row.department);
            return department?.jobs.some(job => job === row.jobTitle)
                && offices.some(office => office.city === row.city && office.province === row.province && office.region === row.region)
                && row.age - row.yearsOfService >= 22
                && row.totalComp === row.salary * 12 + row.bonus + row.stock
                && row.joinDate <= SNAPSHOT_DATE;
        })).toBe(true);
        expect(employees.some(row => row.email === "")).toBe(true);
        expect(employees.some(row => row.performance === "待评估")).toBe(true);
        makeOrders(100);
        expect(makeEmployees(3)).toEqual(employees.slice(0, 3));
    });

    it("keeps order totals, payments and fulfillment dates coherent across 3000 rows", () => {
        const rows = makeOrders();
        expect(rows.length).toBe(3000);
        expect(new Set(rows.map(row => row.id)).size).toBe(3000);
        expect(rows.every(({ dataRef: order }) =>
            order.amount === Math.round(order.quantity * order.unitPrice * (1 - order.discount) * 100) / 100
            && order.paid <= order.amount && order.paid >= 0
            && order.outstanding === (order.status === "已取消" ? 0 : Math.round((order.amount - order.paid) * 100) / 100)
            && order.orderDate <= SNAPSHOT_DATE
            && (!order.deliveryDate || order.deliveryDate >= order.orderDate)
            && Boolean(order.trackingNo) === ["运输中", "已完成"].includes(order.status)
        )).toBe(true);
        expect(rows.some(row => row.dataRef.status === "已取消")).toBe(true);
        expect(rows.some(row => row.dataRef.paymentStatus === "部分收款")).toBe(true);
    });

    it("reconciles monthly budgets and keeps meaningful overspend examples", () => {
        const rows = makeBudgets();
        expect(rows.length).toBe(1200);
        expect(rows.every(({ dataRef: budget }) => budget.monthly.length === 12
            && budget.planned === budget.monthly.reduce((sum, value) => sum + value, 0)
            && budget.remaining === budget.planned - budget.actual
            && budget.execution === budget.actual / budget.planned)).toBe(true);
        expect(rows.some(row => row.dataRef.remaining < 0 && row.dataRef.status === "超预算")).toBe(true);
    });

    it("recalculates inventory after a count correction and leaves the original record intact", () => {
        const rows = makeInventory();
        expect(rows.length).toBe(2000);
        expect(rows.every(({ dataRef: row }) => row.available === row.onHand - row.reserved
            && row.reserved <= row.onHand && row.value === Math.round(row.onHand * row.cost * 100) / 100)).toBe(true);
        const original = rows[1].dataRef;
        const updated = updateInventory(original, original.reserved, "复核完成");
        expect(updated.available).toBe(0);
        expect(updated.value).toBe(Math.round(original.reserved * original.cost * 100) / 100);
        expect(updated.note).toBe("复核完成");
        expect(original).toEqual(makeInventory()[1].dataRef);
    });

    it("rolls organization headcount and cost up from current employees without duplicating leaves", () => {
        const tree = makeOrganization();
        const people = tree.flatMap(company => (company.children ?? []).flatMap(department => department.children ?? []));
        const currentEmployees = makeEmployees(2000).filter(employee => employee.status !== "离职");
        expect(countOrganization(tree) > 1900).toBe(true);
        expect(people.length).toBe(currentEmployees.length);
        expect(new Set(people.map(row => row.id)).size).toBe(people.length);
        expect(tree.reduce((sum, company) => sum + company.dataRef.headcount, 0)).toBe(people.length);
        expect(tree.reduce((sum, company) => sum + company.dataRef.annualCost, 0))
            .toBe(currentEmployees.reduce((sum, employee) => sum + employee.totalComp, 0));
    });

    it("creates after-sales tickets after delivery and never resolves them in the future", () => {
        const tickets = makeTickets();
        const orders = new Map(makeOrders(4500).map(row => [row.id, row.dataRef]));
        expect(tickets.length).toBe(1500);
        expect(tickets.every(({ dataRef: ticket }) => {
            const order = orders.get(ticket.orderNo);
            return order?.status === "已完成" && ticket.created >= order.deliveryDate
                && ticket.created <= SNAPSHOT_DATE
                && (!ticket.resolved || (ticket.resolved >= ticket.created && ticket.resolved <= SNAPSHOT_DATE));
        })).toBe(true);
        expect(new Set(tickets.map(row => row.height)).size >= 3).toBe(true);
    });

    it("provides one million business cells with consistent store metrics", () => {
        const rows = makeStoreReport();
        expect(rows.length * STORE_COLUMNS).toBe(1_000_000);
        expect(rows.every(row => row.dataRef.daily.length === 249
            && row.dataRef.daily.every(day => day.units >= day.orders && day.returns <= day.orders && day.revenue >= 0))).toBe(true);
    });
});

describe("Table demo business operations", () => {
    it("combines exact status selection with tolerant text and numeric filters", () => {
        const rows = makeOrders();
        const pending = filterOrders(rows, { "$.status": "待审核" });
        expect(pending.length).toBe(450);
        expect(filterOrders(rows, { "$.region": "华东", "$.amount": ">=10,000" })
            .every(row => row.dataRef.region === "华东" && row.dataRef.amount >= 10000)).toBe(true);
        expect(filterOrders(rows, { "$.orderNo": " so-2026-000001 " }).map(row => row.id)).toEqual(["SO-2026-000001"]);
        expect(filterOrders(rows, { "$.amount": "abc" })).toEqual([]);
        expect(filterOrders(rows, {})).toEqual(rows);
        expect(matchesNumber(1000, "1000-5000")).toBe(true);
        expect(matchesNumber(5001, "1000-5000")).toBe(false);
        expect(matchesNumber(1000, "<1000")).toBe(false);
    });

    it("approves only eligible orders and preserves the snapshot used for undo", () => {
        const rows = makeOrders(20);
        const next = approveOrders(rows, new Set(rows.map(row => row.id)));
        expect(next.filter(row => row.dataRef.status === "待审核").length).toBe(0);
        expect(rows.filter(row => row.dataRef.status === "待审核").length).toBe(3);
        expect(next[19]).toBe(rows[19]);
        expect(next[0].dataRef.amount).toBe(rows[0].dataRef.amount);
        expect(next[0].dataRef.status).toBe("待发货");
    });

    it("preserves sparse rectangles and escapes multiline values when copying TSV", () => {
        expect(buildTsv([])).toBe("");
        expect(buildTsv([
            { rowId: "a", rowIndex: 0, columnIndex: 0, columnName: "sku", value: "SKU-1" },
            { rowId: "b", rowIndex: 1, columnIndex: 1, columnName: "note", value: '复核"外箱"\n需换箱' },
        ])).toBe('SKU-1\t\n\t"复核""外箱""\n需换箱"');
    });
});
