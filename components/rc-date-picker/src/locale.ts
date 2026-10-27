import { localeMessages, useLocale } from '@crab-dev/rc-config-provider';

/** Local locale overrides formatting and built-in messages together. */
export function usePickerLocale(override?: string) {
    const configured = useLocale();
    const locale = override ?? configured.locale;
    const messages = override ? localeMessages[locale.startsWith('zh') ? 'zh-CN' : 'en-US'].datePicker : configured.messages.datePicker;
    return { locale, messages };
}
