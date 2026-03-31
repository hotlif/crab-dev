import { describe, it, expect, jest } from '@jest/globals';
import { Prefix, log } from '../util.js';

describe('util', () => {
    it('Prefix should contain package name', () => {
        expect(Prefix).toBe('[@crab-dev/packify]:');
    });

    it('log should print with prefix', () => {
        const spy = jest.spyOn(console, 'log').mockImplementation(() => {});
        log('hello');
        expect(spy).toHaveBeenCalledWith('[@crab-dev/packify]: hello');
        spy.mockRestore();
    });
});
