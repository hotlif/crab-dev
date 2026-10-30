import { configureBrowserEnvironment } from './browser-environment.mjs';
import { resolveYarnEntry, runYarn } from '../package-manager.mjs';
import { repositoryRoot } from '../library-manifest.mjs';

configureBrowserEnvironment({ install: true });
const yarn = await resolveYarnEntry(process.env.npm_execpath);
const args = process.argv.slice(2);
process.exitCode = await runYarn(yarn, ['exec', 'playwright', 'install', ...(args.length ? args : ['chromium', 'firefox', 'webkit'])], { cwd: repositoryRoot });
