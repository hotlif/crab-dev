// Classify capture intent only. Playwright owns option validity and execution.
// Value arity follows the pinned CLI so a grep value such as "-u" is not a flag.
const required = new Set([
    '--add-reporter', '--browser', '--config', '--global-timeout', '--grep', '--grep-invert',
    '--last-failed-file', '--max-failures', '--output', '--package', '--project', '--repeat-each',
    '--reporter', '--retries', '--run-agents', '--shard', '--test-list', '--test-list-invert',
    '--timeout', '--trace', '--tsconfig', '--ui-host', '--ui-port', '--update-source-method', '--workers',
]);
const optional = new Set(['--debug', '--only-changed', '--shuffle', '--update-snapshots']);
const filters = new Set([
    '--grep', '--grep-invert', '--shard', '--last-failed', '--test-list', '--test-list-invert',
    '--only-changed', '--ui', '--ui-host', '--ui-port', '--debug', '--ignore-snapshots',
]);

export function visualArgumentIntent(args) {
    let update = false, filtered = false, packageScope = false, list = false;
    for (let index = 0; index < args.length; index++) {
        const arg = args[index];
        if (arg === '--') { filtered ||= index + 1 < args.length; break; }
        if (arg.startsWith('--')) {
            const name = arg.split('=', 1)[0], inline = arg.includes('=');
            filtered ||= filters.has(name);
            update ||= name === '--update-snapshots';
            packageScope ||= name === '--package';
            list ||= name === '--list';
            if (required.has(name)) {
                if (!inline) index++;
                if (name === '--project' && !inline) while (args[index + 1] && !args[index + 1].startsWith('-')) index++;
            } else if (optional.has(name) && !inline && args[index + 1] && !args[index + 1].startsWith('-')) index++;
            continue;
        }
        if (arg.startsWith('-') && arg.length > 1) {
            for (let offset = 1; offset < arg.length; offset++) {
                const option = arg[offset];
                if (option === 'x') continue;
                if (option === 'u') {
                    update = true;
                    if (offset + 1 === arg.length && args[index + 1] && !args[index + 1].startsWith('-')) index++;
                } else if (['c', 'g', 'G', 'j'].includes(option)) {
                    filtered ||= option === 'g' || option === 'G';
                    if (offset + 1 === arg.length) index++;
                }
                // A value consumes the remaining short token; unknown options
                // are rejected by the native CLI, not reinterpreted as clusters.
                break;
            }
        } else filtered = true;
    }
    return { update, filtered, packageScope, list };
}

/** One scope definition for native execution, matrix completeness and host budgets. */
export function visualCaptureScope(args) {
    const intent = visualArgumentIntent(args);
    return intent.list || intent.filtered ? 'filtered' : intent.packageScope ? 'package' : 'repository';
}
