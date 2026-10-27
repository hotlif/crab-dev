// Keep the public package command stable while sharing the isolated launcher.
process.argv.push('--package=.', '--fixture=src/__tests__/browser/forced-colors-fixture.tsx', '--api=__badgeForced');
await import('../../../scripts/test-published-forced-colors.mjs');
