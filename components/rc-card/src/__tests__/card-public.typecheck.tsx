import { createRef, type ComponentProps, type ReactNode } from 'react';
import Card, { type CardComponent, type CardProps } from '@crab-dev/rc-card';

// This fixture is checked through the published package entry here and copied
// byte-for-byte into the independent packed PnP consumer by check-consumer.
const compound: CardComponent = Card;
const rootRef = createRef<HTMLDivElement>();
const partRef = createRef<HTMLDivElement>();
const loadingValues: ReactNode[] = [undefined, null, false, 0, 'Loading', <span key="loading" />];

export const publicCardContract = loadingValues.map(loadingContent => (
    <Card key={String(loadingContent)} ref={rootRef} loading loadingContent={loadingContent} size="medium">
        <Card.Cover ref={partRef} aria-label="Cover"><img alt="Cover" /></Card.Cover>
        <Card.Header ref={partRef} title={<span>Title</span>} extra={<button type="button">More</button>} />
        <Card.Body ref={partRef}>
            <Card.Meta ref={partRef} avatar={<span>A</span>} title="Title" description={<span>Description</span>} />
        </Card.Body>
        <Card.Footer ref={partRef}><button type="button">Action</button></Card.Footer>
    </Card>
));

const rootProps: ComponentProps<typeof Card> = { loading: true, loadingContent: <Card.Body>Loading</Card.Body> };
const checkedProps: CardProps = rootProps;
void compound;
void checkedProps;

// @ts-expect-error Card keeps its three supported sizes in published declarations.
export const invalidCardSize = <Card size="giant" />;
// @ts-expect-error A plain object is not a valid loading ReactNode.
export const invalidLoadingContent = <Card loadingContent={{ message: 'Loading' }} />;
// @ts-expect-error Compound child props must retain their public constraints.
export const invalidCoverProp = <Card.Cover loadingContent="Loading" />;
// @ts-expect-error Header exposes content props, not native input value state.
export const invalidHeaderProp = <Card.Header value="Title" />;
// @ts-expect-error Body keeps its HTMLDivElement ref contract.
export const invalidBodyRef = <Card.Body ref={createRef<SVGSVGElement>()} />;
// @ts-expect-error Footer is a layout element and has no disabled prop.
export const invalidFooterProp = <Card.Footer disabled />;
// @ts-expect-error Meta has no native button type.
export const invalidMetaProp = <Card.Meta type="button" />;
