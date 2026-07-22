import Realm from './realm.js';

export type {
    RealmProps,
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
export { vars } from './token.js';
export default Realm;
