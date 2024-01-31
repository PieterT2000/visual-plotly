import Plot from "react-plotly.js";
import { Data } from "plotly.js-dist-min";
import { useMemo } from "react";
import {
  Trace,
  ChartType,
  useChartsContext,
} from "src/providers/context/ChartsContext";
import { useChartImageCapture } from "src/hooks/useChartImageCapture";

interface BasicChartProps {
  data: { [key: string]: number | string }[][];
}

type PlotDataSelector = (
  data: BasicChartProps["data"][0],
  traceConfig: Trace
) => Data;

const plotDataSelectors: Record<ChartType, PlotDataSelector> = {
  bar: (data, trace: Trace) => {
    const xValues = data.map((item) => item[trace.xAxisKey]);
    const yValues = data.map((item) => item[trace.yAxisKey]);
    return {
      type: "bar",
      x: xValues,
      y: yValues,
      marker: {
        color: trace.color,
      },
      title: {
        text: trace.label,
      },
    };
  },
  pie: (data, trace: Trace) => {
    const labels = data.map((item) => item[trace.xAxisKey]);
    const values = data.map((item) => item[trace.yAxisKey]);

    return {
      type: "pie",
      labels,
      values,
      title: {
        text: trace.label,
      },
    };
  },
  scatter: (data, trace: Trace) => {
    const xValues = data.map((item) => item[trace.xAxisKey]);
    const yValues = data.map((item) => item[trace.yAxisKey]);
    return {
      type: "scatter",
      x: xValues,
      y: yValues,
      mode: "markers",
      title: {
        text: trace.label,
      },
    };
  },
  line: (data, trace: Trace) => {
    const xValues = data.map((item) => item[trace.xAxisKey]);
    const yValues = data.map((item) => item[trace.yAxisKey]);
    return {
      type: "scatter",
      x: xValues,
      y: yValues,
      mode: "lines",
      line: {
        color: trace.lineColor,
      },
      title: {
        text: trace.label,
      },
    };
  },
};

const BasicChart = (props: BasicChartProps) => {
  const { activeChart: chartConfig } = useChartsContext();
  const { data } = props;
  const plotData = useMemo(() => {
    if (!chartConfig) return [];
    return chartConfig.traces.reduce((acc: Data[], traceConfig, idx) => {
      const { chartType } = traceConfig;
      if (chartType.length === 0 || data.length === 0) return acc;
      acc.push(plotDataSelectors[chartType[0].value](data[idx], traceConfig));
      return acc;
    }, []);
  }, [data, chartConfig]);

  useChartImageCapture(plotData);

  return (
    <Plot
      useResizeHandler
      style={{ width: "100%", height: "100%" }}
      data={plotData}
      layout={{
        autosize: true,
        title: chartConfig?.name,
        xaxis: { title: chartConfig?.xAxisLabel },
        yaxis: { title: chartConfig?.yAxisLabel },
      }}
    />
  );
};

export default BasicChart;
