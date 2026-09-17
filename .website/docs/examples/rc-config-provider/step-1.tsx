import ConfigProvider from '@crab-dev/rc-config-provider';
import Button from '@crab-dev/rc-button';
import Empty from '@crab-dev/rc-empty';
import Card from '@crab-dev/rc-card';
import '@crab-dev/rc-card/css/index.css';
import '@crab-dev/rc-theme/css/index.css';
import '@crab-dev/rc-button/css/index.css';
import '@crab-dev/rc-empty/css/index.css';

export default function Example() {
    return (
        <ConfigProvider theme="dark" locale="en-US" size="large">
            <Card title="Application settings">
                <Empty action={<Button appearance="primary">Add item</Button>} />
            </Card>
        </ConfigProvider>
    );
}
