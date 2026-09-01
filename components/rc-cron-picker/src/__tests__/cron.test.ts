import { describe, expect, it } from "@crab-dev/wake/test";
import { describeCron, formatCron, formatCronField, nextOccurrences, parseCron, } from '../cron.js';
const parse = (expr: string) => {
    const parsed = parseCron(expr);
    if (parsed === null) {
        throw new Error(`预期可解析: ${expr}`);
    }
    return parsed;
};
describe('parseCron', () => {
    it('解析全通配表达式为 every', () => {
        const value = parse('* * * * *');
        expect(value.minute).toEqual({ kind: 'every' });
        expect(value.hour).toEqual({ kind: 'every' });
        expect(value.dayOfMonth).toEqual({ kind: 'every' });
        expect(value.month).toEqual({ kind: 'every' });
        expect(value.dayOfWeek).toEqual({ kind: 'every' });
    });
    it('解析四种标准形态并保留结构', () => {
        const value = parse('*/15 9-18 1,15 6 3/2');
        expect(value.minute).toEqual({ kind: 'step', from: 0, step: 15 });
        expect(value.hour).toEqual({ kind: 'range', from: 9, to: 18 });
        expect(value.dayOfMonth).toEqual({ kind: 'list', values: [1, 15] });
        expect(value.month).toEqual({ kind: 'list', values: [6] });
        expect(value.dayOfWeek).toEqual({ kind: 'step', from: 3, step: 2 });
    });
    it('宽容解析:英文名不区分大小写、周日的 7 归一为 0', () => {
        const value = parse('0 0 * jan,JUL sun');
        expect(value.month).toEqual({ kind: 'list', values: [1, 7] });
        expect(value.dayOfWeek).toEqual({ kind: 'list', values: [0] });
        expect(parse('0 0 * * 7').dayOfWeek).toEqual({ kind: 'list', values: [0] });
    });
    it('复合形态展开归一为值列表', () => {
        expect(parse('1-10/2 * * * *').minute).toEqual({ kind: 'list', values: [1, 3, 5, 7, 9] });
        expect(parse('1,3-5 * * * *').minute).toEqual({ kind: 'list', values: [1, 3, 4, 5] });
        expect(parse('0 0 * * 5-7').dayOfWeek).toEqual({ kind: 'list', values: [0, 5, 6] });
    });
    it('覆盖全域的写法归一为 every', () => {
        expect(parse('0-59 * * * *').minute).toEqual({ kind: 'every' });
        expect(parse('*/1 * * * *').minute).toEqual({ kind: 'every' });
        expect(parse('0 0 * * 1-7').dayOfWeek).toEqual({ kind: 'every' });
    });
    it('容忍首尾与中间的多余空白', () => {
        expect(parse('  0   9 * *  1 ').hour).toEqual({ kind: 'list', values: [9] });
    });
    it('拒绝非法表达式', () => {
        const illegal = [
            '',
            '* * * *',
            '* * * * * *',
            '60 * * * *',
            '* 24 * * *',
            '* * 0 * *',
            '* * 32 * *',
            '* * * 13 *',
            '* * * * 8',
            '5-1 * * * *',
            '*/0 * * * *',
            'a * * * *',
            '1,,2 * * * *',
            '1- * * * *',
            '1/2/3 * * * *',
        ];
        for (const expr of illegal) {
            expect(parseCron(expr)).toBeNull();
        }
    });
});
describe('formatCron', () => {
    it('从解析结果还原标准表达式', () => {
        expect(formatCron(parse('*/15 9-18 1,15 * 1-5'))).toBe('*/15 9-18 1,15 * 1-5');
    });
    it('归一化非标准写法', () => {
        expect(formatCron(parse('0 0 * JAN 7'))).toBe('0 0 * 1 0');
        expect(formatCron(parse('*/1 0-23 * * 1-7'))).toBe('* * * * *');
    });
    it('步进起点等于域下界时用 * 形态,否则用起点形态', () => {
        expect(formatCronField({ kind: 'step', from: 0, step: 5 }, 'minute')).toBe('*/5');
        expect(formatCronField({ kind: 'step', from: 3, step: 5 }, 'minute')).toBe('3/5');
    });
    it('空列表按 * 产出,乱序列表排序产出', () => {
        expect(formatCronField({ kind: 'list', values: [] }, 'minute')).toBe('*');
        expect(formatCronField({ kind: 'list', values: [30, 5] }, 'minute')).toBe('5,30');
    });
});
describe('nextOccurrences', () => {
    const from = new Date(2026, 0, 1, 0, 0, 0);
    it('每分钟:从下一分钟起逐分钟推进', () => {
        const result = nextOccurrences(parse('* * * * *'), from, 3);
        expect(result.map((d) => d.getTime())).toEqual([
            new Date(2026, 0, 1, 0, 1).getTime(),
            new Date(2026, 0, 1, 0, 2).getTime(),
            new Date(2026, 0, 1, 0, 3).getTime(),
        ]);
    });
    it('每天固定时刻', () => {
        const result = nextOccurrences(parse('30 9 * * *'), from, 2);
        expect(result).toEqual([new Date(2026, 0, 1, 9, 30), new Date(2026, 0, 2, 9, 30)]);
    });
    it('跨年寻找闰日', () => {
        const result = nextOccurrences(parse('0 0 29 2 *'), new Date(2026, 2, 1), 1);
        expect(result).toEqual([new Date(2028, 1, 29, 0, 0)]);
    });
    it('日与周同时受限时取并集(标准 cron 语义)', () => {
        // 2026-07-21 是周二;下个周一为 07-27,早于下个 1 日(08-01)
        const result = nextOccurrences(parse('0 0 1 * 1'), new Date(2026, 6, 21, 12, 0), 2);
        expect(result).toEqual([new Date(2026, 6, 27, 0, 0), new Date(2026, 7, 1, 0, 0)]);
    });
    it('匹配不到任何时间时返回空数组而非死循环', () => {
        expect(nextOccurrences(parse('0 0 30 2 *'), from, 1)).toEqual([]);
    });
});
describe('describeCron', () => {
    const cases: Array<[
        string,
        string
    ]> = [
        ['* * * * *', '每分钟'],
        ['30 9 * * *', '每天 09:30'],
        ['0 9,18 * * 1-5', '周一至周五 09:00、18:00'],
        ['*/15 * * * *', '每 15 分钟'],
        ['30 * * * *', '每小时第 30 分钟'],
        ['0 0 1 1 *', '1 月 1 日 00:00'],
        ['0 */2 * * *', '每 2 小时的第 0 分钟'],
        ['* 9-18 * * *', '9 时至 18 时的每分钟'],
    ];
    it.each(cases)('%s → %s', (expr, expected) => {
        expect(describeCron(parse(expr))).toBe(expected);
    });
});
