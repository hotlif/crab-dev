import { describe, expect, it } from '@crab-dev/wake/test';
import { createBuiltinRealmError, getRealmErrorMessage } from '../errorMessages.js';
import { RealmError } from '../types.js';

const entry = 'https://cdn.example.com/remoteEntry.js';
const scope = 'orders';

describe('Realm built-in error provenance', () => {
    it('formats parameterized UI text without changing the public diagnostic or cause', () => {
        const cause = new Error('remote-owned details');
        const error = createBuiltinRealmError(entry, scope, { id: 'timeout', timeout: 15_000 }, { cause });
        const diagnostic = error.message;
        expect(error).toBeInstanceOf(RealmError);
        expect(error.code).toBe('timeout');
        expect(error.entry).toBe(entry);
        expect(error.scope).toBe(scope);
        expect(error.cause).toBe(cause);
        expect(diagnostic).toBe('远程模块加载超过 15000ms 期限');
        expect(getRealmErrorMessage(error, 'en-US')).toContain('15,000 ms');
        expect(getRealmErrorMessage(error, 'zh-CN')).toContain('15,000ms');
        expect(error.message).toBe(diagnostic);
        expect(error.cause).toBe(cause);
    });

    it('does not infer library ownership from an identical public code or message', () => {
        const builtin = createBuiltinRealmError(entry, scope, { id: 'script-load' });
        const custom = new RealmError(builtin.code, builtin.entry, builtin.scope, builtin.message);
        expect(getRealmErrorMessage(custom, 'en-US')).toBe(custom.message);
        expect(getRealmErrorMessage(builtin, 'en-US')).not.toBe(builtin.message);
    });

    it('honors an explicit caller message override on a built-in error', () => {
        const error = createBuiltinRealmError(entry, scope, { id: 'module-get', module: './Orders' });
        error.message = '宿主指定的错误说明';
        expect(getRealmErrorMessage(error, 'en-US')).toBe('宿主指定的错误说明');
        expect(getRealmErrorMessage(error, 'zh-CN')).toBe('宿主指定的错误说明');
    });
});
