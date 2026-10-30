import { chromium } from '@playwright/test';
import { access, symlink } from 'node:fs/promises';
import { linuxVisualImage } from './environment.mjs';

// Wake's retained browser suites discover the conventional executable path.
// Only provision it inside our pinned disposable container, from Playwright's
// own versioned browser path. No second browser download or host mutation.
if (process.platform !== 'linux' || process.env.CRAB_VISUAL_IMAGE !== linuxVisualImage) throw Error('Browser provisioning is limited to the pinned local Linux container.');
const executable = chromium.executablePath();
await access(executable);
try { await symlink(executable, '/usr/bin/chromium'); }
catch (error) { if (error.code !== 'EEXIST') throw error; }
