import React, { useEffect, Children, useRef } from "react";
import ReactFlow, {
  useNodesState,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowInstance,
} from "reactflow";

import "reactflow/dist/style.css";
import { ChartNode } from "./ChartNode";
import { defaultChartHeight } from "../charts/BasicChart";

interface CanvasProps {
  /** All passed children as assumed to be chart components  */
  children: React.ReactNode;
  activeNodeIdx: number;
  /** Should be passed in same order as children */
  chartIds: string[];
}

const nodeTypes = { chart: ChartNode };

export default function Canvas({
  children = [],
  activeNodeIdx,
  chartIds,
}: CanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
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

    if (!notAddedChildrenIndices.length) return;

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
      console.log(newNode.data.chartId);
      newNodes.splice(index, 0, newNode);
      console.log("add childNode #", index, "width id: ", newNode.id);
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
        onNodesChange={onNodesChange}
        nodeTypes={nodeTypes}
        nodesDraggable={true}
        nodeDragThreshold={1}
        // fitView
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
  );
}
