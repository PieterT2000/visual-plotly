import React, { useEffect, useMemo, useRef, useState } from "react";
import { NodeProps } from "reactflow";
import { TypographyH3, TypographyP } from "../ui";
import { useChartsContext } from "src/providers/context/ChartsContext";

export interface ChartNodeData {
  children: React.ReactNode;
  chartId: string;
}

export const ChartNode = ({ data }: NodeProps<ChartNodeData>) => {
  const [width, setWidth] = useState();
  const { charts } = useChartsContext();
  const chart = useMemo(
    () => charts.find((chart) => chart.id === data.chartId),
    [charts, data.chartId]
  );
  console.log(data.chartId);
  const chartRef = useRef(null);

  useEffect(() => {
    if (!chartRef.current) return;
    setWidth((chartRef.current as any).props.style.width);
  }, [chartRef.current]);

  return (
    <div className="bg-white">
      <div style={{ maxWidth: width }}>
        <TypographyH3>{chart?.title}</TypographyH3>
        <TypographyP className="w-full">{chart?.description}</TypographyP>
      </div>
      {React.cloneElement(data.children as React.ReactElement, {
        ref: chartRef,
      })}
    </div>
  );
};
