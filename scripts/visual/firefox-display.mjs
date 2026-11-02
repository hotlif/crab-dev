import { createHash } from 'node:crypto';
import { chmod, mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { linuxVisualImage } from './environment.mjs';

const wrapperSource = `#!/usr/bin/env bash
set -eu
: "\${CRAB_VISUAL_FIREFOX_EXECUTABLE:?Missing managed Firefox executable}"
exec xvfb-run -a --server-args="-screen 0 1920x1080x24 -nolisten tcp" "$CRAB_VISUAL_FIREFOX_EXECUTABLE" "$@"
`;

/** Headful Firefox workers need independent pointers and window focus. */
export async function prepareFirefoxDisplay({ root, platform = process.platform, image = process.env.CRAB_VISUAL_IMAGE }) {
    if (platform !== 'linux' || image !== linuxVisualImage) return undefined;
    const digest = createHash('sha256').update(wrapperSource).digest('hex').slice(0, 16);
    const directory = path.join(root, '.cache/visual-runtime');
    const file = path.join(directory, `firefox-display-${digest}.sh`);
    await mkdir(directory, { recursive: true });
    await writeFile(file, wrapperSource, { mode: 0o700 });
    await chmod(file, 0o700);
    return file;
}
