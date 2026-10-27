import { engineMessages } from '../engine-messages.js';
import { componentMessages, type PdfMessageParameterNames } from '../pdf-messages.js';

type ParametersIn<Text extends string> = Text extends `${string}{${infer Name}}${infer Rest}` ? Name | ParametersIn<Rest> : never;
type Resources = typeof engineMessages & typeof componentMessages;
type ResourceParameters<Locale extends 'zh-CN' | 'en-US'> = {
    -readonly [Id in keyof Resources as [ParametersIn<Resources[Id][Locale]>] extends [never] ? never : Id]: ParametersIn<Resources[Id][Locale]>;
};
type Equal<Left, Right> = (<Value>() => Value extends Left ? 1 : 2) extends (<Value>() => Value extends Right ? 1 : 2) ? true : false;
type Assert<Condition extends true> = Condition;

/** New/removed/renamed placeholders in either real resource must update the declaration contract. */
export type VerifyPdfMessageParameters = [
    Assert<Equal<PdfMessageParameterNames, ResourceParameters<'zh-CN'>>>,
    Assert<Equal<PdfMessageParameterNames, ResourceParameters<'en-US'>>>,
];
