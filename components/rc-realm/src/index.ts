import Realm from './realm.js';
import type { RealmProps as ComponentRealmProps, RealmRemoteProps } from './types.js';

// Wake 0.1.45 docgen cannot resolve a defaulted generic type alias in implementation props.
// Restore the default in types.ts and a direct re-export when docgen supports that syntax.
export type RealmProps<P extends RealmRemoteProps = RealmRemoteProps> = ComponentRealmProps<P>;

export type {
    RealmRemoteProps,
    RealmErrorCode,
    MountLifecycle,
    RemoteContainer,
    ShareScope,
    SharedVersionEntry,
    SharedConfig,
    SharedEntryConfig,
} from './types.js';
export { RealmError } from './types.js';
export { loadRemoteModule, preloadRemote, clearRemoteCache } from './loader.js';
export type { LoadRemoteOptions } from './loader.js';
export { vars as TokenVars } from './token.js';
export { vars } from './token.js';
export default Realm;
