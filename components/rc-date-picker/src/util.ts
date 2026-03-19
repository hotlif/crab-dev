/**
 * 获取指定年月的日历矩阵数据
 * @param year - 年份
 * @param month - 月份 (1-12)
 * @param weekStartDay - 每周起始日 (1=周一, 2=周二, ..., 7=周日)，默认为 1（周一）
 * @returns 包含日期信息的数组
 */
export const getCalendarMatrix = (
    year: number,
    month: number,
    weekStartDay: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 1,
    timeZone: string,
) => {
    const startOfMonth = Temporal.ZonedDateTime.from({
        year,
        month,
        day: 1,
        timeZone,
    });
    const startOffset = (startOfMonth.dayOfWeek - weekStartDay + 7) % 7;
    const startDate = startOfMonth.subtract({ days: startOffset });
    return Array.from({ length: 42 }).map((_, index) => startDate.add({ days: index }));
};

/**
 * 获取动态星期表头数据
 * @param weekStartDay - 起始日 (1=周一, 2=周二, ..., 7=周日)
 * @param locale - 语言代码
 */
export const getWeekDaysHeader = (
    year: number,
    month: number,
    weekStartDay: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 1,
    locale: string,
    timeZone: string,
) => {
    const startOfMonth = Temporal.ZonedDateTime.from({
        year,
        month,
        day: 1,
        timeZone,
    });
    const offset = (weekStartDay - startOfMonth.dayOfWeek + 7) % 7;
    const startDate = startOfMonth.add({ days: offset });
    return Array.from({ length: 7 }).map((_, i) => {
        const date = startDate.add({ days: i });
        return date.toLocaleString(locale, { weekday: 'narrow' });
    });
};

/**
 * 完整版 Temporal.ZonedDateTime 格式化工具 (遵循 UTS #35 规范)
 * 支持常用的占位符、文本转义保护 (单引号)、以及自动补零。
 *
 * @param {Temporal.ZonedDateTime} zdt - Temporal 对象
 * @param {string} formatStr - 格式化字符串，如 'yyyy-MM-dd HH:mm:ss'
 * @returns {string} 格式化后的最终字符串
 */
export function formatTemporal(zdt: Temporal.ZonedDateTime | null, formatStr: string) {
    if (zdt === null) {
        return '';
    }
    const pad = (n: number, len = 2) => String(n).padStart(len, '0');

    // 解构出所有需要的时间组件
    const { year, month, day, hour, minute, second, millisecond, offset, timeZoneId, dayOfWeek } =
        zdt;

    // 占位符字典 (遵循 UTS #35 规范)
    const tokens = {
        // --- 年 ---
        yyyy: pad(year, 4),
        yy: String(year).slice(-2),
        y: year,

        // --- 月 ---
        MMMM: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December',
        ][month - 1],
        MMM: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][
            month - 1
        ],
        MM: pad(month),
        M: month,

        // --- 日 ---
        dd: pad(day),
        d: day,

        // --- 星期 (Temporal 中 1=周一, 7=周日) ---
        EEEE: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'][
            dayOfWeek - 1
        ],
        EEE: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][dayOfWeek - 1],
        E: dayOfWeek,

        // --- 上下午 ---
        a: hour >= 12 ? 'PM' : 'AM',
        aa: hour >= 12 ? 'PM' : 'AM',
        aaa: hour >= 12 ? 'pm' : 'am',

        // --- 小时 ---
        HH: pad(hour), // 24小时制 (00-23)
        H: hour, // 24小时制 (0-23)
        hh: pad(hour % 12 || 12), // 12小时制 (01-12)
        h: hour % 12 || 12, // 12小时制 (1-12)

        // --- 分钟 ---
        mm: pad(minute),
        m: minute,

        // --- 秒 ---
        ss: pad(second),
        s: second,

        // --- 毫秒 ---
        SSS: pad(millisecond, 3), // 3位数 (例如 042)
        SS: pad(Math.floor(millisecond / 10), 2), // 2位数
        S: Math.floor(millisecond / 100), // 1位数

        // --- 时区 ---
        xxx: offset, // +08:00
        xx: offset.replace(':', ''), // +0800
        x: offset.slice(0, 3), // +08
        z: timeZoneId, // Asia/Shanghai (非标准 UTS#35 符号，但在前端极度实用)
    } as const;

    type TokenKey = keyof typeof tokens;

    // 核心逻辑 1：按 token 长度降序排列。确保 'yyyy' 会优先于 'yy' 和 'y' 被匹配到
    const tokenKeys = Object.keys(tokens).sort((a, b) => b.length - a.length);
    const tokenRegexStr = tokenKeys.join('|');

    // 先全局替换连续两个单引号为一个单引号（不进入正则主替换流程）
    let fmt = formatStr.replace(/''/g, "\u0000"); // 用特殊字符临时占位，避免和普通单引号冲突

    // 主正则：匹配被单引号包裹的文本（转义保护），或合法 token
    const regex = new RegExp(`('[^']*')|(${tokenRegexStr})`, 'g');
    fmt = fmt.replace(regex, (match, quotedString, token) => {
        if (quotedString) return quotedString.slice(1, -1); // 转义文本，脱去外层单引号
        return tokens[token as TokenKey];
    });
    // 恢复所有单引号占位符
    return fmt.replace(/\u0000/g, "'");
}


export const isWithinDateRange = (
    target: Temporal.ZonedDateTime,
    range?: { start?: Temporal.ZonedDateTime; end?: Temporal.ZonedDateTime }
) => {
    if (!range) {
        return true;
    }

    const { start, end } = range;
    
    const targetDate = target.toPlainDate();
    const tz = target.timeZoneId; 

    if (start && end) {
        const startDate = start.withTimeZone(tz).toPlainDate();
        const endDate = end.withTimeZone(tz).toPlainDate();
        return Temporal.PlainDate.compare(targetDate, startDate) >= 0 && 
               Temporal.PlainDate.compare(targetDate, endDate) <= 0;
    }

    if (start) {
        const startDate = start.withTimeZone(tz).toPlainDate();
        return Temporal.PlainDate.compare(targetDate, startDate) >= 0;
    }

    if (end) {
        const endDate = end.withTimeZone(tz).toPlainDate();
        return Temporal.PlainDate.compare(targetDate, endDate) <= 0;
    }
    return true;
}