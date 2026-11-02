import light from 'react-syntax-highlighter/dist/cjs/prism-light.js';
import javascript from 'react-syntax-highlighter/dist/cjs/languages/prism/javascript.js';
import typescript from 'react-syntax-highlighter/dist/cjs/languages/prism/typescript.js';
import tsx from 'react-syntax-highlighter/dist/cjs/languages/prism/tsx.js';
import css from 'react-syntax-highlighter/dist/cjs/languages/prism/css.js';
import json from 'react-syntax-highlighter/dist/cjs/languages/prism/json.js';
import python from 'react-syntax-highlighter/dist/cjs/languages/prism/python.js';

// Deep CommonJS entry points work with both published formats. Native ESM
// exposes Babel's default wrapper; the library compiler unwraps it directly.
export const LightPrism = typeof light === 'function' ? light : light.default;
export const lightLanguages = new Set(['text']);

for (const entry of [javascript, typescript, tsx, css, json, python]) {
    const language = typeof entry === 'function' ? entry : entry.default;
    LightPrism.registerLanguage(language.displayName, language);
    lightLanguages.add(language.displayName);
    for (const alias of language.aliases ?? []) lightLanguages.add(alias);
}
