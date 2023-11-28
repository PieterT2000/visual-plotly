import { Data } from "plotly.js";
import React from "react";
import Plot from "react-plotly.js";

interface BarChartProps {
  data: { [key: string]: number | string }[];
  xAxisKey?: string;
  yAxisKey?: string;
}

const BarChart: React.FC<BarChartProps> = ({ data, xAxisKey, yAxisKey }) => {
  if (!xAxisKey || !yAxisKey) return null;

  // Extract x and y values from the data array
  const xValues = data.map((item) => item[xAxisKey]);
  const yValues = data.map((item) => item[yAxisKey]);

  const plotData: Data[] = [
    {
      type: "bar",
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
        title: `2D Bar Chart (${xAxisKey} vs ${yAxisKey})`,
        xaxis: { title: xAxisKey },
        yaxis: { title: yAxisKey },
      }}
    />
  );
};

export default BarChart;
