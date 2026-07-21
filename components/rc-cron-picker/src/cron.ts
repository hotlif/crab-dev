/**
 * 五段式(分 时 日 月 周)cron 表达式的解析、格式化、匹配与中文描述。
 *
 * 遵循"宽进严出"(§5 限制):
 * - 解析宽容 —— 接受月/周英文缩写(JAN-DEC / SUN-SAT)、周日的 7 写法、任意空白分隔,
 *   以及复合形态(如 "1,2-5"、"1-10/2"),复合形态统一展开归一为值列表;
 * - 产出严格 —— 格式化只输出数字与四种标准形态:* 、步进(斜杠)、区间(a-b)、列表(a,b,c)。
 */

export type CronFieldKind = 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';

export type CronFieldValue =
    | { kind: 'every' }
    | { kind: 'step'; from: number; step: number }
    | { kind: 'range'; from: number; to: number }
    | { kind: 'list'; values: number[] };

export interface CronValue {
    minute: CronFieldValue;
    hour: CronFieldValue;
    dayOfMonth: CronFieldValue;
    month: CronFieldValue;
    dayOfWeek: CronFieldValue;
}

export interface CronFieldSpec {
    /** 域下界(含) */
    min: number;
    /** 域上界(含);dayOfWeek 解析时额外接受 7 并归一为 0(周日) */
    max: number;
    /** 解析时接受的英文缩写,下标对应从 min 起的偏移 */
    names?: readonly string[];
}

export const CRON_FIELD_ORDER = ['minute', 'hour', 'dayOfMonth', 'month', 'dayOfWeek'] as const;

export const CRON_FIELD_SPECS: Record<CronFieldKind, CronFieldSpec> = {
    minute: { min: 0, max: 59 },
    hour: { min: 0, max: 23 },
    dayOfMonth: { min: 1, max: 31 },
    month: {
        min: 1,
        max: 12,
        names: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG', 'SEP', 'OCT', 'NOV', 'DEC'],
    },
    dayOfWeek: {
        min: 0,
        max: 6,
        names: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    },
};

export const DEFAULT_CRON_EXPRESSION = '* * * * *';

export const createDefaultCronValue = (): CronValue => ({
    minute: { kind: 'every' },
    hour: { kind: 'every' },
    dayOfMonth: { kind: 'every' },
    month: { kind: 'every' },
    dayOfWeek: { kind: 'every' },
});

// ─── 解析 ────────────────────────────────────────────────────────────────────

/**
 * 把单个数字/名字 token 解析到域内数值。dayOfWeek 在解析阶段临时接受 0-7
 * (7 与 0 均表示周日,展开后统一归一为 0),其余字段严格限制在 [min, max]。
 */
const resolveNumber = (raw: string, spec: CronFieldSpec, isDayOfWeek: boolean): number | null => {
    if (spec.names) {
        const index = spec.names.indexOf(raw.toUpperCase());

        if (index >= 0) {
            return spec.min + index;
        }
    }

    if (!/^\d+$/.test(raw)) {
        return null;
    }

    const n = Number(raw);
    const max = isDayOfWeek ? 7 : spec.max;

    return n >= spec.min && n <= max ? n : null;
};

/** 解析出的单个逗号项:from 为 null 表示 '*';step / to 缺省表示无 */
interface CronAtom {
    from: number | null;
    to: number | null;
    step: number | null;
}

const parseAtom = (raw: string, spec: CronFieldSpec, isDayOfWeek: boolean): CronAtom | null => {
    const [body, stepText, ...extra] = raw.split('/');

    if (extra.length > 0 || body === '' || stepText === '') {
        return null;
    }

    let step: number | null = null;

    if (stepText !== undefined) {
        if (!/^\d+$/.test(stepText)) {
            return null;
        }

        step = Number(stepText);

        if (step < 1) {
            return null;
        }
    }

    if (body === '*') {
        return { from: null, to: null, step };
    }

    const [fromText, toText, ...rangeExtra] = body.split('-');

    if (rangeExtra.length > 0 || fromText === '' || toText === '') {
        return null;
    }

    const from = resolveNumber(fromText, spec, isDayOfWeek);

    if (from === null) {
        return null;
    }

    if (toText === undefined) {
        return { from, to: null, step };
    }

    const to = resolveNumber(toText, spec, isDayOfWeek);

    if (to === null || from > to) {
        return null;
    }

    return { from, to, step };
};

/** 把一个原子项展开为具体值集合(dayOfWeek 的 7 归一为 0) */
const expandAtom = (atom: CronAtom, spec: CronFieldSpec, isDayOfWeek: boolean): number[] => {
    const start = atom.from ?? spec.min;
    const end = atom.to ?? (atom.from !== null && atom.step === null ? atom.from : isDayOfWeek ? 7 : spec.max);
    const step = atom.step ?? 1;
    const values: number[] = [];

    // 单值步进(如 "3/5")语义为"从 3 起到域上界":有 step 无 to 时结束点取域上界
    const stop = atom.step !== null && atom.to === null && atom.from !== null ? (isDayOfWeek ? 7 : spec.max) : end;

    for (let n = start; n <= stop; n += step) {
        values.push(isDayOfWeek && n === 7 ? 0 : n);
    }

    return values;
};

const parseField = (raw: string, kind: CronFieldKind): CronFieldValue | null => {
    const spec = CRON_FIELD_SPECS[kind];
    const isDayOfWeek = kind === 'dayOfWeek';
    const atomTexts = raw.split(',');

    if (atomTexts.some((text) => text === '')) {
        return null;
    }

    const atoms: CronAtom[] = [];

    for (const text of atomTexts) {
        const atom = parseAtom(text, spec, isDayOfWeek);

        if (atom === null) {
            return null;
        }

        atoms.push(atom);
    }

    // 单项且为标准形态时保留原始结构,便于 UI 回填对应模式
    if (atoms.length === 1) {
        const atom = atoms[0];
        const isPlainDayOfWeekValue = !isDayOfWeek || (atom.from !== 7 && atom.to !== 7);

        if (atom.from === null && atom.step === null) {
            return { kind: 'every' };
        }

        if (atom.from === null && atom.step !== null) {
            return atom.step === 1 ? { kind: 'every' } : { kind: 'step', from: spec.min, step: atom.step };
        }

        if (atom.from !== null && atom.to === null && atom.step === null) {
            return { kind: 'list', values: [isDayOfWeek && atom.from === 7 ? 0 : atom.from] };
        }

        if (atom.from !== null && atom.to === null && atom.step !== null && isPlainDayOfWeekValue) {
            return atom.step === 1
                ? { kind: 'list', values: [atom.from] }
                : { kind: 'step', from: atom.from, step: atom.step };
        }

        if (atom.from !== null && atom.to !== null && atom.step === null && isPlainDayOfWeekValue) {
            if (atom.from === spec.min && atom.to === spec.max) {
                return { kind: 'every' };
            }

            return atom.from === atom.to
                ? { kind: 'list', values: [atom.from] }
                : { kind: 'range', from: atom.from, to: atom.to };
        }
    }

    // 复合形态(多项、带步进的区间、含 7 的周区间)统一展开归一为值列表
    const merged = new Set<number>();

    for (const atom of atoms) {
        for (const n of expandAtom(atom, spec, isDayOfWeek)) {
            merged.add(n);
        }
    }

    const values = [...merged].sort((a, b) => a - b);
    const domainSize = spec.max - spec.min + 1;

    return values.length >= domainSize ? { kind: 'every' } : { kind: 'list', values };
};

/** 解析五段式 cron 表达式;非法时返回 null */
export const parseCron = (expression: string): CronValue | null => {
    const fields = expression.trim().split(/\s+/);

    if (fields.length !== CRON_FIELD_ORDER.length) {
        return null;
    }

    const result = createDefaultCronValue();

    for (let i = 0; i < CRON_FIELD_ORDER.length; i += 1) {
        const kind = CRON_FIELD_ORDER[i];
        const parsed = parseField(fields[i], kind);

        if (parsed === null) {
            return null;
        }

        result[kind] = parsed;
    }

    return result;
};

// ─── 格式化 ──────────────────────────────────────────────────────────────────

export const formatCronField = (value: CronFieldValue, kind: CronFieldKind): string => {
    const spec = CRON_FIELD_SPECS[kind];

    switch (value.kind) {
        case 'every':
            return '*';

        case 'step':
            return value.from === spec.min ? `*/${value.step}` : `${value.from}/${value.step}`;

        case 'range':
            return `${value.from}-${value.to}`;

        case 'list':
            // 空列表视同"不限制",按 * 产出,避免生成非法表达式(§5 防错优于报错)
            return value.values.length === 0 ? '*' : [...value.values].sort((a, b) => a - b).join(',');
    }
};

export const formatCron = (value: CronValue): string =>
    CRON_FIELD_ORDER.map((kind) => formatCronField(value[kind], kind)).join(' ');

// ─── 匹配与下次执行时间 ──────────────────────────────────────────────────────

const fieldMatches = (value: CronFieldValue, n: number): boolean => {
    switch (value.kind) {
        case 'every':
            return true;

        case 'step':
            return n >= value.from && (n - value.from) % value.step === 0;

        case 'range':
            return n >= value.from && n <= value.to;

        case 'list':
            return value.values.length === 0 || value.values.includes(n);
    }
};

/** 字段是否构成实际限制(every 与空列表均视为不限制) */
const isRestricted = (value: CronFieldValue): boolean =>
    value.kind !== 'every' && !(value.kind === 'list' && value.values.length === 0);

/**
 * 日期是否匹配"日 / 周"两个字段。遵循标准 cron 语义:
 * 两者都受限时取并集(或),否则由受限的一方决定。
 */
const dayMatches = (value: CronValue, date: Date): boolean => {
    const domRestricted = isRestricted(value.dayOfMonth);
    const dowRestricted = isRestricted(value.dayOfWeek);
    const domMatched = fieldMatches(value.dayOfMonth, date.getDate());
    const dowMatched = fieldMatches(value.dayOfWeek, date.getDay());

    if (domRestricted && dowRestricted) {
        return domMatched || dowMatched;
    }

    return domMatched && dowMatched;
};

/**
 * 逐字段跳进式搜索,单次调用总迭代上限 5000:足够覆盖最坏的合法场景
 * (如 2 月 29 日需跨最多 8 年,约 300 次迭代),同时保证永不匹配的组合
 * (如 2 月 30 日)不会死循环 —— 此时返回已找到的部分结果(可能为空数组)。
 */
export const nextOccurrences = (value: CronValue, from: Date, count: number): Date[] => {
    const result: Date[] = [];

    if (count <= 0) {
        return result;
    }

    const cursor = new Date(from.getTime());
    cursor.setSeconds(0, 0);
    cursor.setMinutes(cursor.getMinutes() + 1);

    for (let guard = 0; guard < 5000; guard += 1) {
        if (!fieldMatches(value.month, cursor.getMonth() + 1)) {
            cursor.setMonth(cursor.getMonth() + 1, 1);
            cursor.setHours(0, 0, 0, 0);
            continue;
        }

        if (!dayMatches(value, cursor)) {
            cursor.setDate(cursor.getDate() + 1);
            cursor.setHours(0, 0, 0, 0);
            continue;
        }

        if (!fieldMatches(value.hour, cursor.getHours())) {
            cursor.setHours(cursor.getHours() + 1, 0, 0, 0);
            continue;
        }

        if (!fieldMatches(value.minute, cursor.getMinutes())) {
            cursor.setMinutes(cursor.getMinutes() + 1);
            continue;
        }

        result.push(new Date(cursor.getTime()));

        if (result.length >= count) {
            return result;
        }

        cursor.setMinutes(cursor.getMinutes() + 1);
    }

    return result;
};

// ─── 中文描述 ────────────────────────────────────────────────────────────────

export const DOW_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'] as const;

export const pad2 = (n: number): string => String(n).padStart(2, '0');

/** step 在小域(月 / 周)上直接展开为值列表描述,比"每 N 个"短语更直白 */
const expandStepValues = (value: Extract<CronFieldValue, { kind: 'step' }>, spec: CronFieldSpec): number[] => {
    const values: number[] = [];

    for (let n = value.from; n <= spec.max; n += value.step) {
        values.push(n);
    }

    return values;
};

const monthPhrase = (value: CronFieldValue): string => {
    switch (value.kind) {
        case 'every':
            return '';

        case 'range':
            return `${value.from} 月至 ${value.to} 月`;

        case 'step':
            return expandStepValues(value, CRON_FIELD_SPECS.month).map((n) => `${n} 月`).join('、');

        case 'list':
            return value.values.map((n) => `${n} 月`).join('、');
    }
};

const dayOfMonthPhrase = (value: CronFieldValue): string => {
    switch (value.kind) {
        case 'every':
            return '';

        case 'range':
            return `${value.from} 日至 ${value.to} 日`;

        case 'step':
            return value.from === CRON_FIELD_SPECS.dayOfMonth.min
                ? `每 ${value.step} 天`
                : `从 ${value.from} 日起每 ${value.step} 天`;

        case 'list':
            return value.values.map((n) => `${n} 日`).join('、');
    }
};

const dayOfWeekPhrase = (value: CronFieldValue): string => {
    switch (value.kind) {
        case 'every':
            return '';

        case 'range':
            return `${DOW_LABELS[value.from]}至${DOW_LABELS[value.to]}`;

        case 'step':
            return expandStepValues(value, CRON_FIELD_SPECS.dayOfWeek).map((n) => DOW_LABELS[n]).join('、');

        case 'list':
            return value.values.map((n) => DOW_LABELS[n]).join('、');
    }
};

const hourPhrase = (value: CronFieldValue): string => {
    switch (value.kind) {
        case 'every':
            return '';

        case 'range':
            return `${value.from} 时至 ${value.to} 时`;

        case 'step':
            return value.from === CRON_FIELD_SPECS.hour.min ? `每 ${value.step} 小时` : `从 ${value.from} 时起每 ${value.step} 小时`;

        case 'list':
            return value.values.map((n) => `${n} 时`).join('、');
    }
};

const minutePhrase = (value: CronFieldValue): string => {
    switch (value.kind) {
        case 'every':
            return '每分钟';

        case 'range':
            return `第 ${value.from} 至 ${value.to} 分钟`;

        case 'step':
            return value.from === CRON_FIELD_SPECS.minute.min
                ? `每 ${value.step} 分钟`
                : `从第 ${value.from} 分钟起每 ${value.step} 分钟`;

        case 'list':
            return `第 ${value.values.join('、')} 分钟`;
    }
};

/** isClock 表示结果是 "09:30" 这类具体时刻,决定外层是否需要补 "每天" 语境 */
const timePhrase = (value: CronValue): { text: string; isClock: boolean } => {
    const { minute, hour } = value;
    const singleMinute = minute.kind === 'list' && minute.values.length === 1 ? minute.values[0] : null;

    if (singleMinute !== null && hour.kind === 'list' && hour.values.length > 0) {
        return { text: hour.values.map((h) => `${pad2(h)}:${pad2(singleMinute)}`).join('、'), isClock: true };
    }

    if (!isRestricted(hour)) {
        if (!isRestricted(minute)) {
            return { text: '每分钟', isClock: false };
        }

        // 步进短语("每 15 分钟")自带全局周期语义;列表 / 区间才需要"每小时"限定语境
        if (minute.kind === 'step') {
            return { text: minutePhrase(minute), isClock: false };
        }

        return { text: `每小时${minutePhrase(minute)}`, isClock: false };
    }

    if (!isRestricted(minute)) {
        return { text: `${hourPhrase(hour)}的每分钟`, isClock: false };
    }

    return { text: `${hourPhrase(hour)}的${minutePhrase(minute)}`, isClock: false };
};

/** 生成表达式的简明中文描述,如 "每天 09:30"、"周一至周五 09:00、18:00" */
export const describeCron = (value: CronValue): string => {
    const parts: string[] = [];
    const month = monthPhrase(isRestricted(value.month) ? value.month : { kind: 'every' });

    if (month !== '') {
        parts.push(month);
    }

    const domRestricted = isRestricted(value.dayOfMonth);
    const dowRestricted = isRestricted(value.dayOfWeek);

    if (domRestricted && dowRestricted) {
        parts.push(`${dayOfMonthPhrase(value.dayOfMonth)}或${dayOfWeekPhrase(value.dayOfWeek)}`);
    } else if (domRestricted) {
        parts.push(dayOfMonthPhrase(value.dayOfMonth));
    } else if (dowRestricted) {
        parts.push(dayOfWeekPhrase(value.dayOfWeek));
    }

    const time = timePhrase(value);

    if (parts.length === 0) {
        return time.isClock ? `每天 ${time.text}` : time.text;
    }

    parts.push(time.text);

    return parts.join(' ');
};
