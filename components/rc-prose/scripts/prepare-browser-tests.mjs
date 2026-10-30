import { mkdir, writeFile } from 'node:fs/promises';
import { collectPublishedStyles } from "../../../scripts/published-styles.mjs";

const styles = await collectPublishedStyles([new URL('../../rc-theme/', import.meta.url), new URL('../../rc-config-provider/', import.meta.url), new URL('../', import.meta.url)]);

await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
