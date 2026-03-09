import type { Temporal } from "@js-temporal/polyfill";

declare global {
    const Temporal: typeof Temporal;

    namespace Temporal {
        type PlainDate = InstanceType<typeof Temporal.PlainDate>;
        type PlainTime = InstanceType<typeof Temporal.PlainTime>;
        type PlainDateTime = InstanceType<typeof Temporal.PlainDateTime>;
        type ZonedDateTime = InstanceType<typeof Temporal.ZonedDateTime>;
        type PlainYearMonth = InstanceType<typeof Temporal.PlainYearMonth>;
        type PlainMonthDay = InstanceType<typeof Temporal.PlainMonthDay>;
        type Instant = InstanceType<typeof Temporal.Instant>;
        type Duration = InstanceType<typeof Temporal.Duration>;
        type Now = typeof Temporal.Now;
        type DurationLike = Parameters<typeof Temporal.Duration.from>[0];
        type PlainDateLike = Parameters<typeof Temporal.PlainDate.from>[0];
        type PlainTimeLike = Parameters<typeof Temporal.PlainTime.from>[0];
        type PlainDateTimeLike = Parameters<typeof Temporal.PlainDateTime.from>[0];
        type ZonedDateTimeLike = Parameters<typeof Temporal.ZonedDateTime.from>[0];
        type PlainYearMonthLike = Parameters<typeof Temporal.PlainYearMonth.from>[0];
        type PlainMonthDayLike = Parameters<typeof Temporal.PlainMonthDay.from>[0];
        type DateUnit = 'year' | 'month' | 'week' | 'day';
        type TimeUnit = 'hour' | 'minute' | 'second' | 'millisecond' | 'microsecond' | 'nanosecond';
        type DateTimeUnit = DateUnit | TimeUnit;
        type ComparisonResult = -1 | 0 | 1;
        type RoundingMode = 'ceil' | 'floor' | 'expand' | 'trunc' | 'halfCeil' | 'halfFloor' | 'halfExpand' | 'halfTrunc' | 'halfEven';
    }
}
