import { nanoid } from "nanoid";
import { createContext, useContext } from "react";

export const defaultChart = {
  traces: [
    {
      selectedDataKey: "month.downtimes.dailyLosses",
      xAxisKey: "date",
      yAxisKey: "hours",
      chartType: "bar" as SupportedChartTypes,
      color: "#0693E3",
      lineColor: "#FF6900",
      marker: { color: "#EB144C" },
      label: "Trace A",
      id: nanoid(),
    },
  ],
  id: nanoid(),
  name: "Chart A",
  image: "",
  xAxisLabel: "X Axis",
  yAxisLabel: "Y Axis",
  title: "Daily Revenue",
  description:
    "The Daily Revenue Chart provides a visual representation of the revenue generated each day.",
};

const defaultContext = {
  charts: [],
  data: {},
  chartThumbs: {},
  handleAddChart: () => {},
  handleAddTrace: () => {},
  handleUpdateChart: () => {},
  handleDeleteChart: () => {},
  handleUpdateTrace: () => {},
  handleDeleteTrace: () => {},
  setActiveChartId: () => {},
  setActiveTraceId: () => {},
  setChartThumb: () => {},
};

type SupportedChartTypes = "bar" | "pie" | "scatter" | "line";
export type ChartType = SupportedChartTypes;
export interface Chart {
  id: string;
  name: string;
  image: string;
  xAxisLabel: string;
  yAxisLabel: string;
  title: string;
  description: string;
  traces: {
    selectedDataKey: string;
    xAxisKey: string;
    yAxisKey: string;
    chartType?: ChartType;
    color: string;
    lineColor: string;
    marker: { color: string };
    label: string;
    id: string;
  }[];
}
export type Charts = Chart[];
export type Trace = Chart["traces"][0];

export interface IChartsContext {
  charts: Charts;
  activeChart?: Chart;
  activeTrace?: Trace;
  // eslint-disable-next-line
  /** The data dict uploaded from the JSON file */
  data: any;
  chartThumbs: { [key: string]: string };
  handleAddChart: () => void;
  handleAddTrace: () => void;
  handleUpdateChart: (value: Partial<Chart>, id?: string) => void;
  handleDeleteChart: (id: string) => void;
  handleUpdateTrace: (value: Partial<Trace>) => void;
  handleDeleteTrace: (id: string, chartId: string) => void;
  setActiveChartId: (id: string) => void;
  setActiveTraceId: (id: string) => void;
  setChartThumb: (id: string, thumb: string) => void;
}
export const ChartsContext = createContext<IChartsContext>(defaultContext);

export const useChartsContext = () => useContext(ChartsContext);
