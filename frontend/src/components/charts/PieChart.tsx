import React from "react";
import Plot from "react-plotly.js";
import { Data } from "plotly.js";

interface PieChartProps {
  data: { [key: string]: number | string }[];
  labelKey?: string;
  valueKey?: string;
}

const PieChart: React.FC<PieChartProps> = ({ data, labelKey, valueKey }) => {
  if (!labelKey || !valueKey) return null;

  const labels = data.map((item) => item[labelKey]);
  const values = data.map((item) => item[valueKey]);

  const plotData: Data[] = [
    {
      type: "pie",
      labels,
      values,
    },
  ];

  return (
    <Plot
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
      data={plotData}
      layout={{
        autosize: true,
        title: "Pie Chart",
      }}
    />
  );
};

export default PieChart;
