import { describe, expect, it } from '@crab-dev/wake/test';
import token from '../token.js';

describe('Menu token roles', () => {
    it('pairs collapsed tooltips with inverse background and text roles', () => {
        expect(token.vertical.tooltip['background-color']).toContain(
            '--token-semantic-color-background-inverse',
        );
        expect(token.vertical.tooltip.color).toContain(
            '--token-semantic-color-text-inverse',
        );
    });
});
