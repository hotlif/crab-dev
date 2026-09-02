import { describe, expect, it } from '@crab-dev/wake/test';
import token from '../token.js';

describe('Tree drag token roles', () => {
    it('separates structural borders from the solid drag badge', () => {
        expect(token.node.drag.indicator['background-color']).toContain(
            '--token-semantic-color-feedback-info-border',
        );
        expect(token.node.drag.inside['border-color']).toContain(
            '--token-semantic-color-feedback-info-border',
        );
        expect(token.node.drag.badge['background-color']).toContain(
            '--token-semantic-color-feedback-info-solid',
        );
        expect(token.node.drag.badge.color).toContain(
            '--token-semantic-color-feedback-info-on-solid',
        );
    });
});
