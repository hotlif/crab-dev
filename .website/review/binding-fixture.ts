import { css, cx as combine } from '@crab-dev/css';
const first = css`color: red;`;
const second = css`color: blue;`;
export function classes(selected: boolean) { return combine.call(undefined, first, selected && second); }
document.body.dataset.classes = classes(true);
