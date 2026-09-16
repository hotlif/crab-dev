import Preview from "@crab-dev/rc-component-preview";
import "@crab-dev/rc-component-preview/css/index.css";
import "@crab-dev/rc-button/css/index.css";
export default function Example() {
    return (
        <Preview title="欢迎信息" sourceCode={"<p>欢迎学习 Crab UI</p>"} defaultExpanded>
            <p>欢迎学习 Crab UI</p>
        </Preview>
    );
}
