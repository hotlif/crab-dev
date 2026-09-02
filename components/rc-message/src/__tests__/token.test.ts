import { describe, expect, it } from '@crab-dev/wake/test';
import token from '../token.js';

describe('Message token roles', () => {
    it('uses a neutral brand gradient for timeout progress', () => {
        expect(token.progress.start.color).toContain(
            '--token-semantic-color-brand-primary',
        );
        expect(token.progress.end.color).toContain(
            '--token-semantic-color-brand-primary-hover',
        );
        expect(token.progress.start.color).not.toContain(
            '--token-semantic-color-feedback-success',
        );
        expect(token.progress.end.color).not.toContain(
            '--token-semantic-color-feedback-success',
        );
    });
});
