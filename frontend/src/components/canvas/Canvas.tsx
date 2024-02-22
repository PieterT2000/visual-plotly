import React, { useEffect, Children, useRef, CSSProperties } from "react";
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
import { defaultChartHeight } from "../charts/BasicChart";
import { InvisibleNode } from "./InvisibleNode";

interface CanvasProps {
  /** All passed children as assumed to be chart components  */
  children: React.ReactNode;
  activeNodeIdx: number;
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

export default function Canvas({
  children = [],
  activeNodeIdx,
  chartIds,
}: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState<
    ChartNodeData | { style: CSSProperties }
  >(initialNodes);
  const [edges, _, onEdgesChange] = useEdgesState(borderEdges);
  const flowInstance = useRef<ReactFlowInstance>();

  useEffect(() => {
    if (!children) return;
    const childrenArr = Children.toArray(children);
    if (chartIds.length !== childrenArr.length) {
      console.error("chartIds and children length mismatch");
      return;
    }

    // find nodes not yet added
    const addedNodesIds = nodes.map((node) => node.id);
    const notAddedChildrenIndices = childrenArr
      .map((_, index) => {
        if (!addedNodesIds.includes(chartIds[index])) {
          return index;
        }
        return null;
      })
      .filter((index) => index !== null) as number[];

    if (notAddedChildrenIndices.length == 0) return;

    const newNodes = [...nodes];

    notAddedChildrenIndices.forEach((index) => {
      const newNode = {
        id: chartIds[index],
        type: "chart",
        position: { x: 0, y: index * defaultChartHeight * 1.5 }, // TODO: calculate position in a better way
        data: {
          children: childrenArr[index] as React.ReactNode,
          chartId: chartIds[index],
        },
      };
      newNodes.splice(index, 0, newNode);
    });

    setNodes(newNodes);
  }, [children]);

  useEffect(() => {
    if (activeNodeIdx === -1 || !flowInstance.current) return;
    const node = nodes[activeNodeIdx];
    if (!node) return;
    // Hack: when a new node is added in state, it's not yet in the DOM, so we need to wait a bit until its width/height parameters are set
    setTimeout(() => {
      setNodes((prevNodes) => {
        if (!flowInstance.current) return prevNodes;
        const node = prevNodes[activeNodeIdx];
        flowInstance.current.fitView({ nodes: [node], duration: 500 });

        return prevNodes;
      });
    }, 50);
  }, [activeNodeIdx, nodes.length, flowInstance.current]);

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
