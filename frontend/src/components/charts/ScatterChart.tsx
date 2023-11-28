import React from "react";
import Plot from "react-plotly.js";
import { Data } from "plotly.js";

interface ScatterChartProps {
  data: { [key: string]: number | string }[];
  xAxisKey?: string;
  yAxisKey?: string;
  showLine?: boolean;
}

const ScatterChart: React.FC<ScatterChartProps> = ({
  data,
  xAxisKey,
  yAxisKey,
  showLine,
}) => {
  if (!xAxisKey || !yAxisKey) return null;

  const xValues = data.map((item) => item[xAxisKey]);
  const yValues = data.map((item) => item[yAxisKey]);

  const plotData: Data[] = [
    {
      type: "scatter",
      mode: showLine ? "lines" : "markers",
      x: xValues,
      y: yValues,
    },
  ];

  return (
    <Plot
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
      data={plotData}
      layout={{
        autosize: true,
        title: showLine ? "Line Chart" : "Scatter Chart",
        xaxis: { title: xAxisKey },
        yaxis: { title: yAxisKey },
      }}
    />
  );
};

export default ScatterChart;
