import { createContext, useContext } from "react";

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
    barColor?: string;
    lineColor?: string;
    markerColor?: string;
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
