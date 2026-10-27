import type { ConfigProviderProps } from '@crab-dev/rc-config-provider';
import type { PdfEditorElement } from '../web-component-types.js';

/** Type-only regression: this function is checked, never executed by the test runner. */
export function verifyPdfWebComponentConfig(element: PdfEditorElement, config: ConfigProviderProps): string {
    element.designSystem = config.designSystem;
    element.colorMode = config.colorMode;
    element.brandColor = config.brandColor;
    element.size = config.size;
    element.density = config.density;
    element.locale = config.locale;
    element.direction = config.direction;
    element.brandColor = null;
    element.brandColor = undefined;
    element.nonce = 'native-html-nonce';
    const nonce: string = element.nonce;

    // @ts-expect-error The legacy theme API is removed; use colorMode.
    element.theme = 'dark';
    // @ts-expect-error Legacy design IDs are not part of the public contract.
    element.designSystem = 'material';
    // @ts-expect-error Apple is not exposed under the old macos ID.
    element.designSystem = 'macos';
    // @ts-expect-error colorMode accepts an already resolved light/dark value.
    element.colorMode = 'system';
    // @ts-expect-error Universal control size does not use Button's dedicated xs scale.
    element.size = 'xs';
    // @ts-expect-error Preview's regular density is not a global density value.
    element.density = 'regular';
    // @ts-expect-error Only the supported locale union is accepted.
    element.locale = 'fr-FR';
    // @ts-expect-error direction is the ltr/rtl configuration, not native dir=auto.
    element.direction = 'auto';
    // @ts-expect-error nonce retains HTMLElement's native string property.
    element.nonce = undefined;
    return nonce;
}
