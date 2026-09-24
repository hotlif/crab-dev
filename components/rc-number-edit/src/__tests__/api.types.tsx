import NumberEdit from '../numberEdit.js';

export function checkStringMode() {
    // @ts-expect-error 尚未实现高精度字符串模式，不能接受 true 后静默忽略。
    return <NumberEdit stringMode />;
}
