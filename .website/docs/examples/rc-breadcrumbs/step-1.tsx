import Breadcrumbs from "@crab-dev/rc-breadcrumbs";
export default function Example() {
    return (
        <Breadcrumbs
            items={[
                {
                    key: "home",
                    title: "工作区",
                },
                {
                    key: "users",
                    title: "成员",
                },
                {
                    key: "detail",
                    title: "成员详情",
                },
            ]}
        />
    );
}
