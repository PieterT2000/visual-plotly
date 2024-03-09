import { CoordinateExtent } from "reactflow";

export const defaultChartWidth = 350

export const a4Extent = [
  [0, 0],
  [446, 631],
].map((arr) => arr.map((i) => i * 2)) as CoordinateExtent;

// Margin inside the A4 sheet on which nodes can be placed
export const innerMargin = 10;
// add inner padding to node extent
export const nodeExtent = [
  [a4Extent[0][0] + innerMargin, a4Extent[0][1] + innerMargin],
  [a4Extent[1][0] - innerMargin, a4Extent[1][1] - innerMargin],
] as CoordinateExtent;