import { useMemo, MouseEvent } from "react";
import { TypographyH3 } from "src/components/ui";
import { Button } from "src/components/ui/button";
import {
  ChartType,
  Trace,
  useChartsContext,
} from "src/providers/context/ChartsContext";
import { capitalize, cn } from "src/utils";
import ColorPicker from "./ColorPicker";
import SelectBox from "./SelectBox";
import { SelectItem } from "src/components/ui/select";
import { Input } from "src/components/ui/input";
import { Label } from "src/components/ui/label";
import { PlusIcon, X } from "lucide-react";
import { ColorResult } from "react-color";
import get from "lodash.get";
import DataKeySelectBox from "./DataKeySelectBox";
import { determineValidChartTypes, getFilteredObjectPaths } from "./data-utils";

// Maps the chart type to the color picker property
const colorPickerPropsMap = {
  bar: {
    stateKey: "barColor",
    label: "Bar Color",
  },
  line: {
    stateKey: "lineColor",
    label: "Line Color",
  },
  scatter: {
    stateKey: "markerColor",
    label: "Scatter Color",
  },
};

const chartTypesWithColorPickers = Object.keys(colorPickerPropsMap);

const TraceConfigFields = () => {
  const {
    data,
    activeChart,
    activeTrace,
    handleAddTrace,
    handleUpdateTrace,
    setActiveTraceId,
    handleUpdateChart,
    handleDeleteTrace,
  } = useChartsContext();
  const setXAxisKey = (value: string) => handleUpdateTrace({ xAxisKey: value });
  const setYAxisKey = (value: string) => handleUpdateTrace({ yAxisKey: value });
  const setChartType = (chartType: string) => {
    handleUpdateTrace({ chartType: chartType as ChartType });
  };

  const [xAxisKeys, yAxisKeys, chartTypeOptions] = useMemo(() => {
    if (!activeTrace) return [[], [], [], []];

    const { selectedDataKey, xAxisKey, yAxisKey } = activeTrace;

    const selectedData = get(data, `${selectedDataKey}.0`, {});
    // account for the case where the value of each axisKey is an object
    // in this case we want to use the keys of the object as the axis keys
    const axisKeys = getFilteredObjectPaths(selectedData, (obj, key) => {
      return typeof obj[key] === "number" || typeof obj[key] === "string";
    });

    const activeTraceData = get(data, selectedDataKey, []);
    const xAxisKeys = axisKeys.filter((key: string) => key !== yAxisKey);
    const yAxisKeys = axisKeys.filter((key: string) => key !== xAxisKey);

    const validChartTypes = determineValidChartTypes({
      // eslint-disable-next-line
      xValues: activeTraceData.map((item: any) => get(item, xAxisKey, [])),
      // eslint-disable-next-line
      yValues: activeTraceData.map((item: any) => get(item, yAxisKey, [])),
    });
    const chartTypeOptions = validChartTypes.map((chartType) => ({
      value: chartType,
      label: capitalize(chartType) + " Chart",
    }));

    return [xAxisKeys, yAxisKeys, chartTypeOptions];
  }, [activeTrace, data]);

  const onDeleteTrace = (evt: MouseEvent, traceId: string, chartId: string) => {
    evt.stopPropagation();
    handleDeleteTrace(traceId, chartId);
  };

  const isPieSelected = activeTrace?.chartType === "pie";

  /**
   * Returns the color picker props for the active trace - only works with chart types defined in `chartTypesWithColorPickers`
   */
  const getColorPickerProps = (trace: Trace) => {
    const { stateKey, label } =
      colorPickerPropsMap[trace.chartType as keyof typeof colorPickerPropsMap];
    return {
      label,
      color: trace[stateKey as keyof Trace],
      onChange: (color: ColorResult) =>
        handleUpdateTrace({ [stateKey]: color.hex }),
    };
  };

  return (
    <div className="px-2">
      <TypographyH3 className="mb-6">Traces Options</TypographyH3>
      <div className="border-dark border-b flex mx-2 mb-4 overflow-auto">
        {activeChart?.traces.map((trace, idx) => (
          <Button
            key={trace.id}
            className={cn(
              "relative px-2 w-[90px] justify-between border-none bg-transparent rounded-none text-black rounded-t-md hover:bg-cgray-hover ",
              trace.id === activeTrace?.id &&
                "text-white bg-dark hover:bg-dark hover:text-white"
            )}
            onClick={() => setActiveTraceId(trace.id)}
            variant="ghost"
          >
            <span className={cn("truncate")}>
              {trace.label || `Trace ${idx + 1}`}
            </span>

            {trace.id === activeTrace?.id && (
              <div
                onClick={(evt) => onDeleteTrace(evt, trace.id, activeChart!.id)}
                className="pl-2"
              >
                <X size={18} />
              </div>
            )}
          </Button>
        ))}
        <Button
          variant="ghost"
          onClick={handleAddTrace}
          className="hover:bg-cgray-hover rounded-none rounded-t-md p-2"
        >
          <PlusIcon />
        </Button>
      </div>
      <div className="px-4 space-y-2">
        {!isPieSelected && (
          <>
            <Label htmlFor="traceTitle">Trace Label</Label>
            <Input
              name="traceTitle"
              type="text"
              value={activeTrace?.label}
              onChange={(e) => handleUpdateTrace({ label: e.target.value })}
              className="shadow-sm border-none rounded-sm"
              placeholder="Enter trace label"
            />
          </>
        )}
        <DataKeySelectBox />
        <div className="flex w-full justify-between space-x-4">
          <SelectBox
            className="w-full"
            value={activeTrace?.xAxisKey ?? ""}
            onChange={setXAxisKey}
            placeholder="Select X axis key"
            label="X-Axis"
            disabled={!activeTrace?.selectedDataKey}
            name="xAxisKey"
          >
            {xAxisKeys.map((key: string) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectBox>
          <SelectBox
            className="w-full"
            value={activeTrace?.yAxisKey ?? ""}
            onChange={setYAxisKey}
            placeholder="Select Y-axis key"
            label="Y-Axis"
            disabled={!activeTrace?.selectedDataKey}
            name="yAxisKey"
          >
            {yAxisKeys.map((key: string) => (
              <SelectItem key={key} value={key}>
                {key}
              </SelectItem>
            ))}
          </SelectBox>
        </div>

        {!isPieSelected && (
          <div className="flex w-full justify-between space-x-4">
            <div className="flex-1">
              <Input
                id="XAxisLabel"
                type="text"
                className="shadow-sm border-none rounded-sm w-full"
                value={activeChart?.xAxisLabel ?? ""}
                onChange={(e) =>
                  handleUpdateChart({ xAxisLabel: e.target.value })
                }
                placeholder="Enter X-axis label"
              />
            </div>
            <div className="flex-1">
              <Input
                id="YAxisLabel"
                type="text"
                className="shadow-sm border-none rounded-sm w-full"
                value={activeChart?.yAxisLabel ?? ""}
                onChange={(e) =>
                  handleUpdateChart({ yAxisLabel: e.target.value })
                }
                placeholder="Enter Y-axis label"
              />
            </div>
          </div>
        )}

        <div className="space-y-1">
          <SelectBox
            className="w-full"
            placeholder="Select chart type"
            label="Chart Type"
            name="chartType"
            disabled={!(activeTrace?.xAxisKey && activeTrace?.yAxisKey)}
            value={activeTrace?.chartType ?? ""}
            onChange={setChartType}
          >
            {chartTypeOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="capitalize"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectBox>
        </div>

        {activeTrace?.chartType &&
          chartTypesWithColorPickers.includes(activeTrace?.chartType) && (
            <ColorPicker {...getColorPickerProps(activeTrace)} />
          )}
      </div>
    </div>
  );
};

export default TraceConfigFields;
