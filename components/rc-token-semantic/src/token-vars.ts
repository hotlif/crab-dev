import { vars as generatedVars } from './token.js';

type LegacyFeedbackKey =
    | 'color.feedback.error'
    | 'color.feedback.error-background'
    | 'color.feedback.success'
    | 'color.feedback.success-background'
    | 'color.feedback.warning'
    | 'color.feedback.warning-background'
    | 'color.feedback.info'
    | 'color.feedback.info-background';

/** Canonical flat variable map generated from token.toml. */
export const TokenVars: typeof generatedVars = generatedVars;

/**
 * Public variable map with aliases for the pre-role feedback contract.
 * New code should prefer TokenVars and the nested feedback role keys.
 */
export const vars: typeof generatedVars & Readonly<Record<LegacyFeedbackKey, string>> = {
    ...generatedVars,
    'color.feedback.error': '--token-semantic-color-feedback-error',
    'color.feedback.error-background': generatedVars['color.feedback.error.background'],
    'color.feedback.success': '--token-semantic-color-feedback-success',
    'color.feedback.success-background': generatedVars['color.feedback.success.background'],
    'color.feedback.warning': '--token-semantic-color-feedback-warning',
    'color.feedback.warning-background': generatedVars['color.feedback.warning.background'],
    'color.feedback.info': '--token-semantic-color-feedback-info',
    'color.feedback.info-background': generatedVars['color.feedback.info.background'],
};
