import get from "lodash.get";
import { Data } from "plotly.js-cartesian-dist-min";
import { useMemo } from "react";
import {
  Chart,
  ChartType,
  Trace,
  useChartsContext,
} from "src/providers/context/ChartsContext";
import { defaultResColors } from "src/utils/colorsRES";

type DataToBePlotted = { [key: string]: number | string }[];

type PlotDataSelector = (
  data: DataToBePlotted,
  traceConfig: Trace
) => Data & { extra: { [k: string]: any } };

const plotDataSelectors: Record<ChartType, PlotDataSelector> = {
  bar: (data, trace: Trace) => {
    const xValues = data.map((item) => get(item, trace.xAxisKey));
    const yValues = data.map((item) => get(item, trace.yAxisKey));
    return {
      type: "bar",
      x: xValues,
      y: yValues,
      marker: {
        color: trace.barColor,
      },
      name: trace.label,
      extra: {
        aspect: 4 / 3,
      },
    };
  },
  pie: (data, trace: Trace) => {
    const labels = data.map((item) => get(item, trace.xAxisKey));
    const values = data.map((item) => get(item, trace.yAxisKey));

    return {
      type: "pie",
      labels,
      marker: {
        colors: defaultResColors,
      line: {
        color: "black",
        width: 0.4,
      },
      },
      automargin: true,
      values,
      extra: {
        aspect: 1,
      },
    };
  },
  scatter: (data, trace: Trace) => {
    const xValues = data.map((item) => get(item, trace.xAxisKey));
    const yValues = data.map((item) => get(item, trace.yAxisKey));
    return {
      type: "scatter",
      x: xValues,
      y: yValues,
      mode: "markers",
      name: trace.label,
      marker: {
        color: trace.markerColor,
      },
      extra: {
        aspect: 4 / 3,
      },
    };
  },
  line: (data, trace: Trace) => {
    const xValues = data.map((item) => get(item, trace.xAxisKey));
    const yValues = data.map((item) => get(item, trace.yAxisKey));
    return {
      type: "scatter",
      x: xValues,
      y: yValues,
      mode: "lines",
      line: {
        color: trace.lineColor,
      },
      name: trace.label,
      extra: {
        aspect: 4 / 3,
      },
    };
  },
};

export function getPlotlyChartDataOptions(
  jsonData: any,
  charts: Chart[],
  chartId: string
) {
  const chartState = charts.find((chart) => chart.id === chartId);
  const dataToPlot =
    chartState?.traces.map((trace) =>
      get(jsonData, trace.selectedDataKey, [])
    ) ?? [];

  const plotDataOptions = chartState?.traces.reduce(
    (acc: ReturnType<PlotDataSelector>[], traceConfig, idx) => {
      const { chartType } = traceConfig;
      if (!chartType || dataToPlot.length === 0) return acc;
      const plotData = plotDataSelectors[chartType](
        dataToPlot[idx],
        traceConfig
      );
      acc.push(plotData);
      return acc;
    },
    []
  );

  return plotDataOptions;
}

export function usePlotlyChartData(chartId: string) {
  const { charts, data: chartsData } = useChartsContext();

  return useMemo(
    () => getPlotlyChartDataOptions(chartsData, charts, chartId),
    [chartId, charts, chartsData]
  );
}

export const plotlyGlobalConfig = {
  displayModeBar: false,
  staticPlot: true,
  showEditInChartStudio: false,
};
