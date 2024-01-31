import Plotly, { Data } from "plotly.js-dist-min";
import { useEffect } from "react";
import { useChartsContext } from "src/providers/context/ChartsContext";

export function useChartImageCapture(plotData: Data[]) {
  const { activeChart: chartData, setChartThumb } = useChartsContext();

  useEffect(() => {
    if (!chartData) return;
    Plotly.toImage(
      { data: plotData },
      {
        format: "jpeg",
        height: 600,
        width: 600,
      }
    ).then((base64Str) => {
      setChartThumb(chartData.id, base64Str);
    })
    // eslint-disable-next-line
  }, [
    plotData
  ]);
}