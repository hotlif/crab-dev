import { createRef } from 'react';
import Button from '../button.js';

export function checkButtonTypes() {
    const link = <Button href='/report' ref={createRef<HTMLAnchorElement>()} download onClick={e => { e.currentTarget.href = '/report'; }}>Report</Button>;
    const button = <Button ref={createRef<HTMLButtonElement>()} onClick={e => { e.currentTarget.disabled = true; }}>Save</Button>;
    // @ts-expect-error 链接 ref 必须对应 HTMLAnchorElement。
    const wrongRef = <Button href='/report' ref={createRef<HTMLButtonElement>()}>Report</Button>;
    // @ts-expect-error 原生按钮不支持 download。
    const wrongAttribute = <Button download>Report</Button>;
    return { link, button, wrongRef, wrongAttribute };
}
