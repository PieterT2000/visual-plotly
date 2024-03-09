import { useEffect, useRef, CSSProperties, useState, useMemo } from "react";
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

import "src/styles/reactflow.css";
import { ChartNode, ChartNodeData } from "./ChartNode";
import { InvisibleNode } from "./InvisibleNode";
import {
  a4Extent,
  defaultChartWidth,
  innerMargin,
  nodeExtent,
} from "../consts";

import ExportButton from "./ExportButton";
import ExportDialog from "./ExportDialog";
import { useExportCanvas } from "src/hooks/useExportCanvas";
import { Skeleton } from "../ui/skeleton";
import { useChartsContext } from "src/providers/context/ChartsContext";
import type { PlotParams } from "react-plotly.js";

const nodeTypes = { chart: ChartNode, invisible: InvisibleNode };

const outerXMargin = 100;
const outerYMargin = 50;

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
    style: {
      strokeDasharray: "5, 5",
    },
  },
  {
    id: "tr->br",
    source: "tr",
    target: "br",
    type: "straight",
    style: {
      strokeDasharray: "5, 5",
    },
  },
  {
    id: "br->bl",
    source: "br",
    target: "bl",
    type: "straight",
    style: {
      strokeDasharray: "5, 5",
    },
  },
  {
    id: "bl->tl",
    source: "bl",
    target: "tl",
    type: "straight",
    style: {
      strokeDasharray: "5, 5",
    },
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

const Canvas = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState<
    ChartNodeData | { style: CSSProperties }
  >(initialNodes);
  const [edges, _, onEdgesChange] = useEdgesState(borderEdges);
  const flowInstance = useRef<ReactFlowInstance>();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [pdfPreviewImage, setPdfPreviewImage] = useState<string | null>(null);
  const { charts, activeChart } = useChartsContext();

  const activeChartId = activeChart?.id;
  const chartIds = useMemo(() => {
    return charts.map((chart) => chart.id);
  }, [charts]);

  const handleExportButtonClick = () => {
    setDialogOpen(true);
  };

  const { downloadPdf, renderPreviewImage, isLoading } = useExportCanvas(
    flowInstance.current
  );
  const handleJsonExport = () => {
    const exportData = [] as {
      layout: PlotParams["layout"];
      data: PlotParams["data"];
    }[];
    const chartElements = document
      .querySelector(".react-flow__viewport")
      ?.querySelectorAll(".p-chart");
    chartElements?.forEach((el) => {
      const chartComponent = el as HTMLDivElement & PlotParams;
      exportData.push({
        layout: chartComponent.layout,
        data: chartComponent.data,
      });
    });

    // download the data as a JSON file
    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.download = "data.json";
    aTag.click();
  };

  const handleExportDialogSubmit = (selectedTab: "pdf" | "json") => {
    if (selectedTab === "pdf") {
      downloadPdf();
    } else if (selectedTab === "json") {
      handleJsonExport();
    }
    setDialogOpen(false);
  };

  useEffect(() => {
    if (!chartIds) return;

    // Delete nodes that are not in the chartIds
    const filteredNodes = nodes.filter(
      (node) => node.type === commonNodeProps.type || chartIds.includes(node.id)
    );

    // Add nodes that are in the chartIds but not in the nodes
    const newChartIds = chartIds.filter(
      (id) => !nodes.find((node) => node.id === id)
    );

    const nodesToBeAdded = newChartIds.map((id, index) => ({
      id,
      type: "chart",
      position: getXYDefaultPlacement(
        filteredNodes.length - initialNodes.length + index
      ), // TODO: calculate position in a better way
      data: {
        chartId: id,
      },
    }));

    if (filteredNodes.length === nodes.length && newChartIds.length === 0)
      return;

    const newNodes = [...filteredNodes, ...nodesToBeAdded];
    setNodes(newNodes);
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

  const proOptions = { hideAttribution: true };

  useEffect(() => {
    if (dialogOpen) {
      renderPreviewImage().then(
        (base64Image) => base64Image && setPdfPreviewImage(base64Image)
      );
    }
  }, [dialogOpen]);

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
        proOptions={proOptions}
      >
        <Controls />
        <ExportButton onClick={handleExportButtonClick} />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
      <ExportDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleExportDialogSubmit}
        isLoading={isLoading}
      >
        <div className="flex justify-center">
          {pdfPreviewImage ? (
            <img className=" w-[80%]" src={pdfPreviewImage} alt="PDF preview" />
          ) : (
            <div className="flex flex-col w-[80%] space-y-4 py-8">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[70%]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
              <Skeleton className="h-[125px] w-[80%] rounded-lg" />
            </div>
          )}
        </div>
      </ExportDialog>
    </div>
  );
};

export default Canvas;
