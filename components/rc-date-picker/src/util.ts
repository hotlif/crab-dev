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
    weekStartDay: 1 | 2 | 3 | 4 | 5 | 6 | 7 = 1
) => {
    const startOfMonth = Temporal.PlainDate.from({
        year,
        month,
        day: 1
    });
    const startOffset = (startOfMonth.dayOfWeek - weekStartDay + 7) % 7;
    const startDate = startOfMonth.subtract({ days: startOffset });
    return Array.from({ length: 42 }).map((_, index) => startDate.add({ days: index }))
}


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
) => {
    const startOfMonth = Temporal.PlainDate.from({
        year,
        month,
        day: 1
    });
    const offset = (weekStartDay - startOfMonth.dayOfWeek + 7) % 7;
    const startDate = startOfMonth.add({ days: offset });
    return Array.from({ length: 7 }).map((_, i) => {
        const date = startDate.add({ days: i });
        return date.toLocaleString(locale, { weekday: 'narrow' })
    });
};