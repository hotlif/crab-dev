import { describe, expect, it } from '@crab-dev/wake/test';
import token, { vars } from '../token.js';
import { TokenVars } from '../index.js';

describe('Virtual token contract', () => {
    it('从包根公开 virtual 前缀的 L3 CSS 变量', () => {
        expect(TokenVars).toBe(vars);
        expect(TokenVars['scrollbar.thumb.background-color']).toBe(
            '--virtual-scrollbar-thumb-background-color',
        );
    });

    it('滚动条 thumb 通过 L2 文本色回退链随主题变化', () => {
        expect(token.scrollbar.thumb['background-color']).toContain(
            '--token-semantic-color-text-primary',
        );
    });
});
