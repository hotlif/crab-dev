import type { Temporal as _Temporal } from '@js-temporal/polyfill';

declare global {
    const Temporal: typeof _Temporal;

    namespace Temporal {
        type PlainDate = InstanceType<typeof _Temporal.PlainDate>;
        type PlainTime = InstanceType<typeof _Temporal.PlainTime>;
        type PlainDateTime = InstanceType<typeof _Temporal.PlainDateTime>;
        type ZonedDateTime = InstanceType<typeof _Temporal.ZonedDateTime>;
        type PlainYearMonth = InstanceType<typeof _Temporal.PlainYearMonth>;
        type PlainMonthDay = InstanceType<typeof _Temporal.PlainMonthDay>;
        type Instant = InstanceType<typeof _Temporal.Instant>;
        type Duration = InstanceType<typeof _Temporal.Duration>;
        type Now = typeof _Temporal.Now;
        type DurationLike = Parameters<typeof _Temporal.Duration.from>[0];
        type PlainDateLike = Parameters<typeof _Temporal.PlainDate.from>[0];
        type PlainTimeLike = Parameters<typeof _Temporal.PlainTime.from>[0];
        type PlainDateTimeLike = Parameters<typeof _Temporal.PlainDateTime.from>[0];
        type ZonedDateTimeLike = Parameters<typeof _Temporal.ZonedDateTime.from>[0];
        type PlainYearMonthLike = Parameters<typeof _Temporal.PlainYearMonth.from>[0];
        type PlainMonthDayLike = Parameters<typeof _Temporal.PlainMonthDay.from>[0];
        type DateUnit = 'year' | 'month' | 'week' | 'day';
        type TimeUnit = 'hour' | 'minute' | 'second' | 'millisecond' | 'microsecond' | 'nanosecond';
        type DateTimeUnit = DateUnit | TimeUnit;
        type ComparisonResult = -1 | 0 | 1;
        type RoundingMode =
            | 'ceil'
            | 'floor'
            | 'expand'
            | 'trunc'
            | 'halfCeil'
            | 'halfFloor'
            | 'halfExpand'
            | 'halfTrunc'
            | 'halfEven';
    }
}
