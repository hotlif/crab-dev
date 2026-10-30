import { mkdir, writeFile } from 'node:fs/promises';
import { collectPublishedStyles } from "../../../scripts/published-styles.mjs";

const styles = await collectPublishedStyles([...['rc-theme', 'rc-line-edit', 'rc-date-picker', 'rc-select', 'rc-form'].map(name => new URL(`../../${name}/`, import.meta.url))]);

await mkdir(new URL('../.cache/', import.meta.url), { recursive: true });
await writeFile(new URL('../.cache/browser-css.json', import.meta.url), `${JSON.stringify(styles.join('\n'))}\n`);
