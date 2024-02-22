import Plotly, { Data } from "plotly.js-cartesian-dist-min";
import { useEffect } from "react";
import { useChartsContext } from "src/providers/context/ChartsContext";

export function useChartImageCapture(plotData: Data[], chartId: string) {
  const { setChartThumb } = useChartsContext();

  useEffect(() => {
    if (!chartId) return;
    Plotly.toImage(
      { data: plotData },
      {
        format: "png",
        height: 600,
        width: 600,
      }
    ).then((base64Str) => {
      setChartThumb(chartId, base64Str);
    });
    // eslint-disable-next-line
  }, [plotData]);
}
