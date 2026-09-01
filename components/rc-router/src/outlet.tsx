import { OutletContext } from './contexts.js';
import { useOutlet } from './hooks.js';
import type { OutletProps } from './types.js';

function Outlet({ context }: OutletProps) {
    const outlet = useOutlet();
    if (outlet === null) {
        return null;
    }
    return <OutletContext value={context}>{outlet}</OutletContext>;
}

export default Outlet;
