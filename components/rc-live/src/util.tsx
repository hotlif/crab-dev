import { type ComponentType } from "react";
import { transform } from 'sucrase';
import { jsxDEV as _jsxDEV, Fragment as _Fragment } from "react/jsx-dev-runtime";
import { generate } from 'astring';
import { Parser } from "acorn";

const evalCode = (code: string, _scope: any = {}): ComponentType => {
    const scope = {_jsxDEV, _Fragment, ..._scope};
    const scopeKeys = Object.keys(scope);
    const scopeValues = scopeKeys.map((key) => scope[key]);
    const ast = Parser.parse(code, {
        sourceType: 'module',
        ecmaVersion: "latest"
    });
    ast.body = ast.body.filter(node => node.type !== 'ImportDeclaration');
    let newCode = generate(ast);
    newCode = newCode.replace('export default', 'return').trim()
    return new Function(
        ...scopeKeys,
        newCode,
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

    const transformCodeResult =  transform(code, {
        transforms: ['typescript', 'jsx'],
        jsxRuntime: 'automatic'
    })

    const AnyComponent = evalCode(transformCodeResult.code, scopes);

    return <AnyComponent />
}
