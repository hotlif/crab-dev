import { globalStyle } from '@crab-dev/css';
import token from '@crab-dev/rc-token-global';

// Restore each typography family at nested design boundaries. Font scale and
// component geometry stay independent, so switching typefaces never scales targets.
// eslint-disable-next-line @typescript-eslint/no-unused-expressions
globalStyle`
    :root, [data-crab-design='material'] {
        --token-semantic-font-family-body: ${token.font.family.material};
        --token-semantic-typography-display-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-caption-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-small-emphasized-font-family: var(--token-semantic-font-family-body);
        font-family: var(--token-semantic-font-family-body);
    }

    [data-crab-design='macos'] {
        --token-semantic-font-family-body: ${token.font.family.system};
        --token-semantic-typography-display-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-caption-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-small-emphasized-font-family: var(--token-semantic-font-family-body);
        font-family: var(--token-semantic-font-family-body);
    }

    [data-crab-design='shadcn'] {
        --token-semantic-font-family-body: ${token.font.family.sans};
        --token-semantic-typography-display-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-caption-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-display-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-headline-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-title-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-body-small-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-large-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-large-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-medium-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-medium-emphasized-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-small-font-family: var(--token-semantic-font-family-body);
        --token-semantic-typography-label-small-emphasized-font-family: var(--token-semantic-font-family-body);
        font-family: var(--token-semantic-font-family-body);
    }
`;
