import AutoSizer from '@crab-dev/rc-auto-sizer';
import Tree, { LoadStateType, NodeType, type Node } from '@crab-dev/rc-tree';
import type { PdfObject } from './protocol.js';
import PdfIcon from './icon.js';
import BusyRegion from './busy-region.js';
import { objectTreeStyle } from './styles.js';
import { SHAPE_LABELS } from './drawing.js';

interface ObjectTreeProps {
    objects: PdfObject[];
    selected?: PdfObject;
    busy: boolean;
    onSelect: (object?: PdfObject) => void;
}

// 节点来自 PDF 的绘制顺序；未开放树内拖拽、加载和重命名。
function keepPdfOrder() {}

export default function ObjectTree({ objects, selected, busy, onSelect }: ObjectTreeProps) {
    const treeData: Node[] = objects.map((object, index) => {
        const label = object.shape ? `${SHAPE_LABELS[object.shape]} ${object.index + 1}` : object.kind === 'text' ? `文字：${object.text || '无法识别'}` : object.kind === 'image' ? `图片 ${object.index + 1}` : `其他对象 ${object.index + 1}`;
        return {
            id: object.index, parent: null, type: NodeType.FILE, loadState: LoadStateType.LOADING_COMPLETED,
            priority: index,
            icon: <PdfIcon name={object.shape ?? (object.kind === 'text' ? 'textObject' : object.kind === 'image' ? 'imageObject' : 'otherObject')} />,
            title: <span title={label}>{label}</span>,
        };
    });
    // 提交与跨页准备沿用上一份列表，拦截过期对象交互，保留焦点和选中外观。
    return <BusyRegion className={objectTreeStyle} busy={busy}>
        <AutoSizer defaultWidth={248} defaultHeight={160}>{({ width, height }) => <Tree
            aria-label="页面对象"
            defaultNodeHeight={40}
            width={width} height={height} treeData={treeData} onTreeNodeChange={keepPdfOrder}
            selectKeys={selected ? [selected.index] : []} onSelect={({ node, isSelect }) => {
                if (!busy) onSelect(isSelect ? objects.find(object => object.index === node.id) : undefined);
            }}
        />}</AutoSizer>
    </BusyRegion>;
}
