import { css } from "@crab-dev/css";
import token from "@crab-dev/rc-token-semantic";
import FlowDiagram, { FlowNode, FlowEdge } from "@crab-dev/rc-flow-diagram";
const layout = css`
    display: grid;
    gap: ${token.space["group-gap"]};
`;
const nodes = [
    {
        id: "start",
        width: 100,
        height: 50,
    },
    {
        id: "done",
        width: 100,
        height: 50,
    },
];
const edges = [
    {
        id: "review",
        source: "start",
        target: "done",
    },
];
export default function Example() {
    return (
        <div className={layout}>
            <FlowDiagram
                nodes={nodes}
                edges={edges}
                width={260}
                height={220}
                elkOptions={{
                    "elk.algorithm": "layered",
                    "elk.direction": "DOWN",
                }}
            >
                {({ nodeRects, routes, crossings }) => (
                    <>
                        {edges.map((edge) => {
                            const points = routes[edge.id]?.points;
                            return points && points.length > 1 ? (
                                <FlowEdge
                                    key={edge.id}
                                    points={points}
                                    crossings={crossings[edge.id]}
                                />
                            ) : null;
                        })}
                        {nodes.map((node) => {
                            const rect = nodeRects[node.id];
                            return rect ? (
                                <FlowNode
                                    key={node.id}
                                    x={rect.x}
                                    y={rect.y}
                                    width={rect.width}
                                    height={rect.height}
                                    label={node.id === "start" ? "提交申请" : "审核完成"}
                                />
                            ) : null;
                        })}
                    </>
                )}
            </FlowDiagram>
            <p>提交申请 → 审核完成</p>
        </div>
    );
}
