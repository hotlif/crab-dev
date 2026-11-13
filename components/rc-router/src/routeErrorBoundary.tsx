import { Component } from 'react';
import type { ComponentType, ReactNode } from 'react';
import type { RouteErrorBoundaryProps } from './types.js';

interface BoundaryProps {
    locationKey: string;
    fallback: ComponentType<RouteErrorBoundaryProps>;
    children: ReactNode;
}

interface BoundaryState {
    locationKey: string;
    failed: boolean;
    error: unknown;
}

// React error boundaries require a class lifecycle. Healthy children are not
// keyed by location, so navigation does not remount persistent layouts.
export default class RouteErrorBoundary extends Component<BoundaryProps, BoundaryState> {
    state: BoundaryState = { locationKey: this.props.locationKey, failed: false, error: undefined };

    static getDerivedStateFromProps(props: BoundaryProps, state: BoundaryState): Partial<BoundaryState> | null {
        return props.locationKey !== state.locationKey
            ? { locationKey: props.locationKey, failed: false, error: undefined }
            : null;
    }

    static getDerivedStateFromError(error: unknown): Partial<BoundaryState> {
        return { failed: true, error };
    }

    reset = (): void => {
        this.setState({ failed: false, error: undefined });
    };

    render(): ReactNode {
        const Fallback = this.props.fallback;
        return this.state.failed
            ? <Fallback error={this.state.error} reset={this.reset} />
            : this.props.children;
    }
}
