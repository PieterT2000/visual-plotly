import Plotly from "plotly.js-cartesian-dist-min";
import { Data } from "plotly.js-cartesian-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { PlotParams } from "react-plotly.js";
import { forwardRef, useMemo, useRef } from "react";
import {
  Trace,
  ChartType,
  useChartsContext,
} from "src/providers/context/ChartsContext";
import { useChartImageCapture } from "src/hooks/useChartImageCapture";
import get from "lodash.get";
import { defaultChartWidth } from "../consts";

// Use custom Plotly build
const Plot = createPlotlyComponent(Plotly) as React.ComponentClass<PlotParams>;

export interface BasicChartProps {
  chartId: string;
  width: number;
}

type DataToBePlotted = { [key: string]: number | string }[];

type PlotDataSelector = (
  data: DataToBePlotted,
  traceConfig: Trace
) => Data & { extra: object };

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
      name: trace.label,
      extra: {
        aspect: 4 / 3,
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
      extra: {
        aspect: 1,
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
      name: trace.label,
      extra: {
        aspect: 4 / 3,
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
      name: trace.label,
      extra: {
        aspect: 4 / 3,
      },
    };
  },
};

export const defaultChartHeight = 400;

const BasicChart = forwardRef(
  (
    { chartId, width = defaultChartWidth }: BasicChartProps,
    ref: React.Ref<any>
  ) => {
    const localRef = useRef(null);
    const chartRef = ref || localRef;
    // chartsData
    const { charts, data: chartsData } = useChartsContext();

    const chartConfig = useMemo(() => {
      return charts.find((chart) => chart.id === chartId);
    }, [chartId, charts]);

    // Data are the values to be plotted
    const data = useMemo(() => {
      return (
        chartConfig?.traces.map((trace) =>
          get(chartsData, trace.selectedDataKey, [])
        ) ?? []
      );
    }, [chartConfig, chartsData]);

    const plotData = useMemo(() => {
      if (!chartConfig) return [];
      return chartConfig.traces.reduce(
        (acc: ReturnType<PlotDataSelector>[], traceConfig, idx) => {
          const { chartType } = traceConfig;
          if (chartType.length === 0 || data.length === 0) return acc;
          const plotData = plotDataSelectors[chartType[0].value](
            data[idx],
            traceConfig
          );
          acc.push(plotData);
          return acc;
        },
        []
      );
    }, [data, chartConfig]);

    useChartImageCapture(plotData, chartId);

    const dimensions = useMemo(() => {
      // @ts-ignore
      const aspect = plotData[0]?.aspect ?? 4 / 3;
      return {
        width: Math.round(width),
        height: Math.round(width / aspect),
      };
    }, [width]);

    const filteredPlotData = useMemo(
      () => plotData.filter((data) => removeObjectKeys(data, ["extra"])),
      [plotData]
    );

    return (
      <Plot
        ref={chartRef}
        useResizeHandler
        style={dimensions}
        data={filteredPlotData}
        layout={{
          autosize: true,
          title: chartConfig?.name,
          xaxis: { title: chartConfig?.xAxisLabel },
          yaxis: { title: chartConfig?.yAxisLabel },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
        }}
      />
    );
  }
);

export default BasicChart;

function removeObjectKeys<T extends Record<string, any>>(
  obj: T,
  keys: (keyof T)[]
): Partial<T> {
  return Object.fromEntries(
    Object.entries(obj).filter(([key]) => !keys.includes(key))
  ) as Partial<T>;
}
