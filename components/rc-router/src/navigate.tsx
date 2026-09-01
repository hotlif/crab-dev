import { useEffect } from 'react';
import { useNavigate } from './hooks.js';
import type { NavigateProps } from './types.js';

function Navigate({ to, replace, state, relative }: NavigateProps) {
    const navigate = useNavigate();
    useEffect(() => {
        navigate(to, { replace, state, relative });
    }, [navigate, relative, replace, state, to]);
    return null;
}

export default Navigate;
