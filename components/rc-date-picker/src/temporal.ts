import { Temporal as TemporalPolyfill } from '@js-temporal/polyfill';

// The production dependency is local to this package. Never install a global:
// consumers may use native Temporal or an independently loaded compatible value.
// TypeScript 6's native declarations and polyfill 0.5.1 describe compatible
// runtime operations with different Duration.sign/Like annotations. Keep this
// single structural bridge limited to the constructors and clock we consume;
// normalize cross-implementation values through ISO strings below.
type PickerTemporalRuntime = Pick<typeof globalThis.Temporal, 'Instant' | 'ZonedDateTime' | 'PlainDate' | 'Now'>;
export function resolveTemporal(native: PickerTemporalRuntime | undefined): PickerTemporalRuntime {
    return (native ?? TemporalPolyfill) as PickerTemporalRuntime;
}
export const temporal: PickerTemporalRuntime = resolveTemporal(globalThis.Temporal);

/** Preserve the existing public value type while accepting explicit polyfill values. */
export function toPickerDateTime(value: string | { toString(): string }): Temporal.ZonedDateTime {
    return temporal.ZonedDateTime.from(value.toString());
}

/**
 * UI "now" has millisecond precision, matching the Date clock used by the host.
 * Only current-time defaults use it; supplied ZonedDateTime values keep their
 * original sub-millisecond precision and calendar/time-zone semantics.
 */
export function nowZonedDateTime(timeZone: string = temporal.Now.timeZoneId()): Temporal.ZonedDateTime {
    return temporal.Instant.fromEpochMilliseconds(Date.now()).toZonedDateTimeISO(timeZone);
}
