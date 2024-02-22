import { useEffect, useRef, CSSProperties } from "react";
import ReactFlow, {
  useNodesState,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowInstance,
  CoordinateExtent,
  Node,
  Edge,
  useEdgesState,
} from "reactflow";

import "reactflow/dist/style.css";
import { ChartNode, ChartNodeData } from "./ChartNode";
import { InvisibleNode } from "./InvisibleNode";
import { defaultChartWidth } from "../consts";

interface CanvasProps {
  activeChartId?: string;
  /** Should be passed in same order as children */
  chartIds: string[];
}

const nodeTypes = { chart: ChartNode, invisible: InvisibleNode };

const a4Extent = [
  [0, 0],
  [446, 631],
].map((arr) => arr.map((i) => i * 2)) as CoordinateExtent;

export const innerMargin = 10;
const outerXMargin = 100;
const outerYMargin = 50;
// add inner padding to node extent
export const nodeExtent = [
  [a4Extent[0][0] + innerMargin, a4Extent[0][1] + innerMargin],
  [a4Extent[1][0] - innerMargin, a4Extent[1][1] - innerMargin],
] as CoordinateExtent;

// add padding to extent
const extent = [
  [nodeExtent[0][0] - outerXMargin, nodeExtent[0][1] - outerYMargin],
  [nodeExtent[1][0] + outerXMargin, nodeExtent[1][1] + outerYMargin],
] as CoordinateExtent;

const commonNodeProps = {
  type: "invisible",
  draggable: false,
};
const invisibleExtentCornerNodes: Record<
  string,
  Node<{ style: CSSProperties }>
> = Object.fromEntries(
  Object.entries({
    topLeft: {
      id: "tl",
      position: { x: a4Extent[0][0], y: a4Extent[0][1] },
      data: {
        style: {
          top: "0",
          left: "0",
          bottom: "unset",
          right: "unset",
        },
      },
    },
    topRight: {
      id: "tr",
      position: { x: a4Extent[1][0], y: a4Extent[0][1] },
      data: {
        style: {
          top: "0",
          right: "0",
          bottom: "unset",
          left: "unset",
        },
      },
    },
    bottomRight: {
      id: "br",
      position: { x: a4Extent[1][0], y: a4Extent[1][1] },
      data: {
        style: {
          bottom: "0",
          right: "0",
          top: "unset",
          left: "unset",
        },
      },
    },
    bottomLeft: {
      id: "bl",
      position: { x: a4Extent[0][0], y: a4Extent[1][1] },
      data: {
        style: {
          bottom: "0",
          left: "0",
          top: "unset",
          right: "unset",
        },
      },
    },
  }).map(([key, value]) => [key, { ...commonNodeProps, ...value }])
);

const initialNodes = Object.values(invisibleExtentCornerNodes);
const borderEdges: Edge[] = [
  {
    id: "tl->tr",
    source: "tl",
    target: "tr",
    type: "straight",
  },
  {
    id: "tr->br",
    source: "tr",
    target: "br",
    type: "straight",
  },
  {
    id: "br->bl",
    source: "br",
    target: "bl",
    type: "straight",
  },
  {
    id: "bl->tl",
    source: "bl",
    target: "tl",
    type: "straight",
  },
];

function getXYDefaultPlacement(index: number) {
  const maxChartsPerColumn = Math.floor(
    (nodeExtent[1][1] - nodeExtent[0][1]) / defaultChartWidth
  );
  if (index >= maxChartsPerColumn) {
    return {
      x: nodeExtent[1][0] - defaultChartWidth - innerMargin,
      y: (index % maxChartsPerColumn) * (defaultChartWidth + 70),
    };
  } else {
    return { x: 0, y: index * (defaultChartWidth + 70) };
  }
}

export default function Canvas({ activeChartId, chartIds }: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<
    ChartNodeData | { style: CSSProperties }
  >(initialNodes);
  const [edges, _, onEdgesChange] = useEdgesState(borderEdges);
  const flowInstance = useRef<ReactFlowInstance>();

  useEffect(() => {
    if (!chartIds) return;

    const newNodes = chartIds.map((id, index) => ({
      id,
      type: "chart",
      position: getXYDefaultPlacement(index), // TODO: calculate position in a better way
      data: {
        chartId: id,
      },
    }));

    setNodes([...initialNodes, ...newNodes]);
  }, [chartIds]);

  useEffect(() => {
    if (!activeChartId || !flowInstance.current) return;
    const node = nodes.find((node) => node.id === activeChartId);
    if (!node) return;
    // Hack: when a new node is added in state, it's not yet in the DOM, so we need to wait a bit until its width/height parameters are set
    setTimeout(() => {
      setNodes((prevNodes) => {
        if (!flowInstance.current) return prevNodes;
        const node = prevNodes.find((node) => node.id === activeChartId);
        if (!node) return prevNodes;
        flowInstance.current.fitView({ nodes: [node], duration: 500 });

        return prevNodes;
      });
    }, 50);
  }, [activeChartId, nodes.length, flowInstance.current]);

  return (
    <div className="h-full">
      <ReactFlow
        onInit={(instance) => (flowInstance.current = instance)}
        nodes={nodes}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        nodeDragThreshold={1}
        translateExtent={extent}
        nodeExtent={nodeExtent}
        edgesFocusable={false}
        // fitView
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
