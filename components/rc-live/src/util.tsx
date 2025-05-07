import { type ComponentType } from "react";
import { transform } from 'sucrase';
import {jsxDEV as _jsxDEV} from "react/jsx-dev-runtime";

const evalCode = (code: string, _scope: any = {}): ComponentType => {
    const scope = {_jsxDEV, ..._scope};
    const scopeKeys = Object.keys(scope);
    const scopeValues = scopeKeys.map((key) => scope[key]);
    const importReg = /import.*from.*;/g;

    return new Function(
        ...scopeKeys,
        code.replace(importReg, '').replace('export default', 'return').trim(),
    )(...scopeValues);
}

/**
 * 将代码转换成为 React 组件
 * @param code   要转换的代码信息
 * @param scopes 对应的依赖作用域
 * @returns 
 */
export const transformCode = (code: string, scopes: any) => {
    if (!scopes) {
        return <></>;
    }

    const AnyComponent = evalCode(
        transform(code, {
            transforms: ['typescript', 'jsx'],
            jsxRuntime: 'automatic'
        }).code, scopes
    );

    return <AnyComponent />
}
