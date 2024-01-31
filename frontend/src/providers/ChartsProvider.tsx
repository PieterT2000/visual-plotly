import { nanoid } from "nanoid";
import React, { useState, useEffect, useMemo, useCallback } from "react";
import {
  ChartTypeOption,
  Charts,
  ChartsContext,
  IChartsContext,
  defaultChart,
} from "./context/ChartsContext";

const emptyChart = {
  traces: [],
  id: "dummy",
  name: "",
  image: "",
  xAxisLabel: "",
  yAxisLabel: "",
};

const defaultPlotlyColors = [
  "#1f77b4", // muted blue
  "#ff7f0e", // safety orange
  "#2ca02c", // cooked asparagus green
  "#d62728", // brick red
  "#9467bd", // muted purple
  "#8c564b", // chestnut brown
  "#e377c2", // raspberry yogurt pink
  "#7f7f7f", // middle gray
  "#bcbd22", // curry yellow-green
  "#17becf", // blue-teal
];

function getRandomPlotlyColor() {
  return defaultPlotlyColors[
    Math.floor(Math.random() * defaultPlotlyColors.length)
  ];
}

const emptyTrace = {
  selectedDataKey: "",
  xAxisKey: "",
  yAxisKey: "",
  chartType: [] as ChartTypeOption[],
  color: "",
  lineColor: "",
  label: "",
  id: "dummy-trace",
};

interface ChartsProviderProps {
  files: string[];
  children: React.ReactNode;
}

const ChartsProvider = ({ children, files }: ChartsProviderProps) => {
  // eslint-disable-next-line
  const [data, setData] = useState<any>();
  const [charts, setCharts] = useState<Charts>([defaultChart]);
  const [activeChartId, setActiveChartId] = useState(defaultChart.id);
  const [activeTraceId, setActiveTraceId] = useState(defaultChart.traces[0].id);
  const [chartThumbs, setChartThumbs] = useState<IChartsContext["chartThumbs"]>(
    {}
  );

  const activeChart = useMemo(
    () => charts.find((state) => state.id === activeChartId),
    [charts, activeChartId]
  );

  const activeTrace = useMemo(
    () => activeChart?.traces.find((trace) => trace.id === activeTraceId),
    [activeChart?.traces, activeTraceId]
  );

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
    setCharts([
      ...charts,
      {
        ...emptyChart,
        id: newChartId,
        traces: [
          {
            ...emptyTrace,
            id: newTraceId,
            color: getRandomPlotlyColor(),
            lineColor: getRandomPlotlyColor(),
          },
        ],
      },
    ]);
    setActiveChartId(newChartId);
    setActiveTraceId(newTraceId);
  }, [charts]);

  const handleUpdateChart = useCallback(
    (value: Partial<typeof defaultChart>, id: string = activeChartId) => {
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

  const handleAddTrace = useCallback(() => {
    const newTraceId = nanoid();
    handleUpdateChart({
      traces: [
        ...(activeChart?.traces ?? []),
        {
          ...emptyTrace,
          id: newTraceId,
          color: getRandomPlotlyColor(),
          lineColor: getRandomPlotlyColor(),
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
      handleUpdateTrace,
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
      handleUpdateTrace,
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