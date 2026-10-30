import ConfigProvider from '@crab-dev/rc-config-provider';
import WorkbenchPreview, { type WorkbenchPreviewProps } from '../../../.website/docs/site/workbenchPreview.js';

// Wake 0.1.45 resolves an owner package's public self-import to source, while
// the shared preview resolves it to published ESM. Inject the owner identity
// so both read the same React context. Remove this adapter after Wake unifies
// those module identities and the real owner-workbench matrix proves it.
export default function Preview(props: WorkbenchPreviewProps) {
    return <WorkbenchPreview {...props} boundary={ConfigProvider} />;
}
