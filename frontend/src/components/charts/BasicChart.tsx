import Plotly from "plotly.js-cartesian-dist-min";
import createPlotlyComponent from "react-plotly.js/factory";
import { PlotParams } from "react-plotly.js";
import { forwardRef, useMemo, useRef } from "react";
import { useChartImageCapture } from "src/hooks/useChartImageCapture";
import {
  plotlyGlobalConfig,
  usePlotlyChartData,
} from "src/hooks/usePlotlyChartData";
import { useChartsContext } from "src/providers/context/ChartsContext";
import { removeObjectKeys } from "src/utils";

// Use custom Plotly build
const Plot = createPlotlyComponent(Plotly) as React.ComponentClass<PlotParams>;

export interface BasicChartProps {
  chartId: string;
  width: number;
}

const BasicChart = forwardRef(
  ({ chartId, width }: BasicChartProps, ref: React.Ref<any>) => {
    const localRef = useRef(null);
    const chartRef = ref ?? localRef;

    const { charts } = useChartsContext();
    const chartState = useMemo(() => {
      return charts.find((chart) => chart.id === chartId);
    }, [chartId, charts]);

    const plotDataOptions = usePlotlyChartData(chartId);

    useChartImageCapture(plotDataOptions, chartId);

    const dimensions = useMemo(() => {
      // @ts-ignore
      const aspect = plotDataOptions[0]?.extra.aspect ?? 4 / 3;
      return {
        width: Math.round(width),
        height: Math.round(width / aspect),
      };
    }, [width]);

    const filteredPlotData = useMemo(
      () =>
        plotDataOptions?.map((data) => removeObjectKeys(data, ["extra"])) ?? [],
      [plotDataOptions]
    );

    return (
      <Plot
        className="p-chart"
        ref={chartRef}
        useResizeHandler
        style={dimensions}
        data={filteredPlotData}
        layout={{
          autosize: false,
          title: chartState?.name,
          xaxis: { title: chartState?.xAxisLabel },
          yaxis: { title: chartState?.yAxisLabel },
          paper_bgcolor: "rgba(0,0,0,0)",
          plot_bgcolor: "rgba(0,0,0,0)",
          width: dimensions.width,
          height: dimensions.height,
        }}
        config={plotlyGlobalConfig}
      />
    );
  }
);

export default BasicChart;
