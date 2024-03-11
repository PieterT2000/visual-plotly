import { nanoid } from "nanoid";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  Chart,
  Charts,
  ChartsContext,
  IChartsContext,
} from "./context/ChartsContext";
import { getRandomPlotlyColor } from "src/utils/colors";

const emptyChart = {
  traces: [],
  id: "dummy",
  name: "",
  image: "",
  xAxisLabel: "",
  yAxisLabel: "",
  title: "",
  description: "",
};

const emptyTrace = {
  selectedDataKey: "",
  xAxisKey: "",
  yAxisKey: "",
  barColor: "",
  lineColor: "",
  markerColor: "",
  label: "",
  id: "dummy-trace",
};

interface ChartsProviderProps {
  files: string[];
  children: React.ReactNode;
}

function createInitialChartState(chartId = nanoid(), traceId = nanoid()) {
  return {
    ...emptyChart,
    id: chartId,
    traces: [
      {
        ...emptyTrace,
        id: traceId,
        barColor: getRandomPlotlyColor(),
        lineColor: getRandomPlotlyColor(),
        markerColor: getRandomPlotlyColor(),
      },
    ],
  };
}

function createInitialChartsState() {
  return [createInitialChartState()];
}

const ChartsProvider = ({ children, files }: ChartsProviderProps) => {
  // eslint-disable-next-line
  const [data, setData] = useState<any>();
  const [charts, setCharts] = useState<Charts>(createInitialChartsState);
  const [activeChartId, setActiveChartId] = useState(charts[0].id);
  const [activeTraceId, setActiveTraceId] = useState(charts[0].traces[0].id);
  // Thumb images for the chart tabs in the sidebar
  const [chartThumbs, setChartThumbs] = useState<IChartsContext["chartThumbs"]>(
    {}
  );

  const activeChart = useMemo(
    () => charts.find((state) => state.id === activeChartId),
    [charts, activeChartId]
  );

  const activeTrace = useMemo(() => {
    return activeChart?.traces.find((trace) => trace.id === activeTraceId);
  }, [activeChart?.traces, activeTraceId]);

  useEffect(() => {
    if (files.length === 0) return;
    fetch(files[0]).then((response) => {
      response.json().then(setData);
    });
  }, [files]);

  const setChartThumb = useCallback(
    (id: string, base64Img: string) => {
      setChartThumbs((prev) => ({ ...prev, [id]: base64Img }));
    },
    [setChartThumbs]
  );

  const handleAddChart = useCallback(() => {
    const newChartId = nanoid();
    const newTraceId = nanoid();
    setCharts((prevCharts) => [
      ...prevCharts,
      createInitialChartState(newChartId, newTraceId),
    ]);
    setActiveChartId(newChartId);
    setActiveTraceId(newTraceId);
  }, [charts]);

  const handleUpdateChart = useCallback(
    (value: Partial<Chart>, id: string = activeChartId) => {
      const updatedCharts = charts.map((chart) => {
        if (chart.id === id) {
          return { ...chart, ...value };
        }
        return chart;
      });
      setCharts(updatedCharts);
    },
    [charts, activeChartId]
  );

  const handleDeleteChart = useCallback(
    (id: string) => {
      const updatedCharts = charts.filter((chart) => chart.id !== id);
      setCharts(updatedCharts);

      if (updatedCharts.length === 0) {
        handleAddChart();
      } else {
        // If the active chart is deleted, set the first chart as active
        setActiveChartId(updatedCharts[0].id);
        setActiveTraceId(updatedCharts[0].traces[0].id);
      }
    },
    [charts, activeChartId]
  );

  const handleAddTrace = useCallback(() => {
    const newTraceId = nanoid();
    handleUpdateChart({
      traces: [
        ...(activeChart?.traces ?? []),
        {
          ...emptyTrace,
          id: newTraceId,
          barColor: getRandomPlotlyColor(),
          lineColor: getRandomPlotlyColor(),
          markerColor: getRandomPlotlyColor(),
        },
      ],
    });
    setActiveTraceId(newTraceId);
  }, [activeChart?.traces, handleUpdateChart]);

  const handleUpdateTrace = useCallback(
    (value: Partial<typeof emptyTrace>) => {
      const updatedTraces = activeChart?.traces.map((trace) => {
        if (trace.id === activeTraceId) {
          return { ...trace, ...value };
        }
        return trace;
      });
      handleUpdateChart({ traces: updatedTraces });
    },
    [activeChart?.traces, activeTraceId, handleUpdateChart]
  );

  const handleDeleteTrace = useCallback(
    (traceId: string, chartId: string) => {
      if (activeChart) {
        const updatedTraces = activeChart.traces.filter(
          (trace) => trace.id !== traceId
        );
        handleUpdateChart({ traces: updatedTraces }, chartId);

        if (updatedTraces.length === 0) {
          // reset last remaining trace tab to empty values
          handleUpdateChart({ traces: [{ ...emptyTrace }] }, chartId);
        } else {
          setActiveTraceId(updatedTraces[0].id);
        }
      }
    },
    [activeChart?.traces, activeTraceId, handleUpdateChart]
  );

  const contextValue = useMemo(
    () => ({
      charts,
      activeChart,
      activeTrace,
      data,
      chartThumbs,
      handleAddChart,
      handleAddTrace,
      handleUpdateChart,
      handleDeleteChart,
      handleUpdateTrace,
      handleDeleteTrace,
      setActiveChartId,
      setActiveTraceId,
      setChartThumb,
    }),
    [
      charts,
      activeChart,
      activeTrace,
      data,
      chartThumbs,
      handleAddChart,
      handleAddTrace,
      handleUpdateChart,
      handleDeleteChart,
      handleUpdateTrace,
      handleDeleteTrace,
      setChartThumb,
    ]
  );

  return (
    <ChartsContext.Provider value={contextValue}>
      {children}
    </ChartsContext.Provider>
  );
};

export default ChartsProvider;
