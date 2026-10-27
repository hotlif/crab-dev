import { useLocale, type ConfigLocale } from '@crab-dev/rc-config-provider';
import type { CronFieldKind } from './cron.js';

/** Cron-specific language stays with its domain; the provider selects the locale. */
export function getCronLocale(locale: ConfigLocale) {
    const zh = locale === 'zh-CN';
    const number = new Intl.NumberFormat(locale);
    const names: Record<CronFieldKind, string> = zh
        ? { minute: '分钟', hour: '小时', dayOfMonth: '日期', month: '月份', dayOfWeek: '星期' }
        : { minute: 'Minute', hour: 'Hour', dayOfMonth: 'Day of month', month: 'Month', dayOfWeek: 'Weekday' };
    const units: Record<CronFieldKind, string> = zh
        ? { minute: '分钟', hour: '小时', dayOfMonth: '天', month: '个月', dayOfWeek: '' }
        : { minute: 'minutes', hour: 'hours', dayOfMonth: 'days', month: 'months', dayOfWeek: 'weekdays' };
    const suffixes: Record<CronFieldKind, string> = zh
        ? { minute: '分', hour: '时', dayOfMonth: '日', month: '月', dayOfWeek: '' }
        : { minute: '', hour: '', dayOfMonth: '', month: '', dayOfWeek: '' };
    const every: Record<CronFieldKind, string> = zh
        ? { minute: '每分钟', hour: '每小时', dayOfMonth: '每日', month: '每月', dayOfWeek: '不限星期' }
        : { minute: 'Every minute', hour: 'Every hour', dayOfMonth: 'Every day', month: 'Every month', dayOfWeek: 'Every weekday' };
    const weekdays = Array.from({ length: 7 }, (_, day) => new Intl.DateTimeFormat(locale, { weekday: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2023, 0, day + 1))));
    const field = (kind: CronFieldKind) => ({
        name: names[kind], unit: units[kind], suffix: suffixes[kind], everyLabel: every[kind],
        valueLabel: (value: number) => kind === 'dayOfWeek' ? weekdays[value]
            : kind === 'month' ? new Intl.DateTimeFormat(locale, { month: 'short', timeZone: 'UTC' }).format(new Date(Date.UTC(2023, value - 1, 1)))
                : number.format(value),
    });
    return {
        field, weekdays, names,
        label: zh ? 'Cron 表达式' : 'Cron expression',
        panel: zh ? 'Cron 表达式编辑面板' : 'Cron expression editor',
        fields: zh ? '时间字段' : 'Time fields',
        expression: zh ? '生成的 Cron 表达式' : 'Generated Cron expression',
        format: zh ? '格式：分 时 日 月 周。' : 'Format: minute hour day month weekday.',
        invalid: zh ? '请输入有效的五段式 Cron 表达式，例如 30 9 * * 1-5。' : 'Enter a valid five-field Cron expression, for example 30 9 * * 1-5.',
        step: zh ? '固定间隔' : 'Fixed interval',
        range: zh ? '连续范围' : 'Continuous range',
        specified: (name: string) => zh ? `指定${name}` : `Specific ${name.toLowerCase()}`,
        mode: (name: string) => zh ? `${name}设置方式` : `${name} mode`,
        unlimited: (name: string) => zh ? `${name}不设限制，使用全部${name}。` : `No restriction on ${name.toLowerCase()}.`,
        start: (name: string) => zh ? `起始${name}` : `Starting ${name.toLowerCase()}`,
        from: (name: string) => zh ? `开始${name}` : `First ${name.toLowerCase()}`,
        to: (name: string) => zh ? `结束${name}` : `Last ${name.toLowerCase()}`,
        interval: (unit: string) => zh ? `间隔（${unit}）` : `Interval (${unit})`,
        stepHint: (from: number, step: number, unit: string, suffix: string) => zh
            ? `从 ${number.format(from)}${suffix} 开始，每隔 ${number.format(step)} ${unit}执行；每个周期重新计数。`
            : `Start at ${number.format(from)} and repeat every ${number.format(step)} ${unit}; restart each period.`,
        rangeHint: (name: string) => zh ? `包含开始和结束值，范围内的每个${name}都适用。` : `Include every ${name.toLowerCase()} from the first through the last value.`,
        choose: (name: string) => zh ? `选择${name}` : `Choose ${name.toLowerCase()}`,
        selected: (count: number) => zh ? `已选 ${number.format(count)} 项 · 至少保留 1 项` : `${number.format(count)} selected · Keep at least one`,
        upcoming: (count: number) => zh ? `接下来 ${number.format(count)} 次执行` : `Next ${number.format(count)} executions`,
        localTime: zh ? '本地时间' : 'Local time',
        noOccurrences: zh ? '该表达式匹配不到任何执行时间' : 'No execution time matches this expression',
        formatDate: (date: Date) => new Intl.DateTimeFormat(locale, { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'short' }).format(date),
        formatTime: (date: Date) => new Intl.DateTimeFormat(locale, { hour: '2-digit', minute: '2-digit', hourCycle: 'h23' }).format(date),
    };
}

export function useCronLocale() {
    return getCronLocale(useLocale().locale);
}
