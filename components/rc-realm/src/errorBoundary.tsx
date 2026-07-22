import { Component } from 'react';
import type { ReactNode } from 'react';

interface RealmErrorBoundaryProps {
    onRenderError: (error: unknown) => void;
    children: ReactNode;
}

interface RealmErrorBoundaryState {
    failed: boolean;
}

/**
 * 远程组件渲染期的错误边界——库内首个 class 组件, 属正当例外：React 19 至今没有
 * getDerivedStateFromError / componentDidCatch 的函数式等价物, React Compiler 自动
 * 跳过 class 组件, 与全局编译无冲突。
 *
 * 设计为"哑边界"：捕获后渲染 null 并把错误上抛给宿主, 错误 UI 单一来源于 realm.tsx
 * 的统一错误态；重试由外层换 key 重挂本组件, 内部 state 随之复位, 无需 reset API。
 */
export class RealmErrorBoundary extends Component<RealmErrorBoundaryProps, RealmErrorBoundaryState> {
    state: RealmErrorBoundaryState = { failed: false };

    static getDerivedStateFromError(): RealmErrorBoundaryState {
        return { failed: true };
    }

    componentDidCatch(error: unknown): void {
        this.props.onRenderError(error);
    }

    render(): ReactNode {
        return this.state.failed ? null : this.props.children;
    }
}
