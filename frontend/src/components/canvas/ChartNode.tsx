import { memo, useMemo, useRef, useState } from "react";
import { NodeProps, NodeResizer, ResizeParams } from "reactflow";
import { TypographyH3, TypographyP } from "../ui";
import { useChartsContext } from "src/providers/context/ChartsContext";
import { innerMargin, nodeExtent } from "./Canvas";
import { defaultChartWidth } from "../consts";
import BasicChart from "../charts/BasicChart";

export interface ChartNodeData {
  chartId: string;
}

export const ChartNode = memo(({ data }: NodeProps<ChartNodeData>) => {
  const [width, setWidth] = useState(defaultChartWidth);
  const { charts } = useChartsContext();
  const chart = useMemo(
    () => charts.find((chart) => chart.id === data.chartId),
    [charts, data.chartId]
  );
  const chartRef = useRef(null);

  // @ts-ignore
  const handleResize = (_, { width }: ResizeParams) => {
    if (!chartRef.current) return;
    const paddingAdjustedWidth = width - 16; // see p-2 class on chart wrapper below
    setWidth(paddingAdjustedWidth);
  };

  return (
    <div style={{ width: width + 16 }}>
      <div>
        <TypographyH3>{chart?.title}</TypographyH3>
        <TypographyP className="w-full">{chart?.description}</TypographyP>
      </div>
      <div className="relative p-2">
        {width !== undefined && (
          <NodeResizer
            minWidth={300}
            maxWidth={nodeExtent[1][0] - innerMargin}
            onResize={handleResize}
            keepAspectRatio
          />
        )}
        <div className="bg-transparent">
          <BasicChart chartId={data.chartId} width={width} ref={chartRef} />
        </div>
      </div>
    </div>
  );
});
