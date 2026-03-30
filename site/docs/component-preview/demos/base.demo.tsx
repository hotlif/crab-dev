/**
 * title = "预览组件"
 * description = "生成一个预览组件的框"
 */

import Preview from "@crab-dev/rc-component-preview";

const PreviewDemo = () => {
    return (
        <Preview
            path=""
            title="按钮尺寸"
            description="通过 `size` 属性设置按钮尺寸"
            sourceCode="const data = 1"
        >
            <div> 这是一个要预览的组件信息</div>
        </Preview>
    )
}

export default PreviewDemo;
