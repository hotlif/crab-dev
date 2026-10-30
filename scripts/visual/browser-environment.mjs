import { existsSync } from 'node:fs';
import path from 'node:path';
import { repositoryRoot } from '../library-manifest.mjs';

export const localBrowserCache = path.join(repositoryRoot, '.cache/playwright');

/** Project-local official caches also avoid Windows AppData SxS path failures. */
export function configureBrowserEnvironment({ install = false } = {}) {
    if (process.platform === 'win32' && !process.env.PLAYWRIGHT_BROWSERS_PATH && (install || existsSync(localBrowserCache))) process.env.PLAYWRIGHT_BROWSERS_PATH = localBrowserCache;
}
