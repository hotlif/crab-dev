import { describe, expect, it } from '@crab-dev/wake/test';
import { TokenVars as semanticVars } from '@crab-dev/rc-token-semantic';
import token, { vars } from '../token.js';

describe('Breadcrumbs spacing contract', () => {
    it('keeps the public local override while inheriting the current density gap', () => {
        expect(token.root.gap).toContain(vars['root.gap']);
        expect(token.root.gap).toContain(semanticVars['density.gap']);
        expect(token.root.gap).not.toContain(semanticVars['space.inline-gap']);
    });
});
