import { useMemo, useState } from "react";
import { SelectGroup, SelectItem, SelectLabel } from "components/ui/select";
import get from "lodash.get";
import { PlusIcon } from "lucide-react";
import MultiSelect, { MultiValue } from "react-select";
import ConfigurationSelect from "./ConfigurationSelect";
import { Button } from "src/components/ui/button";
import { capitalize, cn } from "src/utils";
import { Input } from "src/components/ui/input";
import { Label } from "components/ui/label";
import BasicChart from "../BasicChart";
import {
  useChartsContext,
  ChartType,
  ChartTypeOption,
} from "src/providers/context/ChartsContext";
import { TwitterPicker } from "react-color";
import Canvas from "src/components/canvas/Canvas";
import ChartConfigFields from "./ChartConfigFields";
import { TypographyH3 } from "src/components/ui";
import { defaultChartWidth } from "src/components/consts";

function renderDataKeyList(
  value: GroupedObject | string | string[],
  keyPath: string[] = [],
  depth = 0
): React.ReactNode {
  if (Array.isArray(value)) {
    return value.map((item: string) => (
      <SelectItem
        key={keyPath.join(".") + "." + item}
        value={keyPath.join(".") + "." + item}
      >
        {item}
      </SelectItem>
    ));
  } else if (typeof value === "object") {
    const entries = Object.entries(value);
    return entries.map(([key, childValue]) =>
      key === "elements" ? (
        renderDataKeyList(childValue, keyPath, depth)
      ) : (
        <SelectGroup key={key}>
          <SelectLabel>{`${Array(depth + 1).join("-")} ${key}`}</SelectLabel>
          {renderDataKeyList(childValue, [...keyPath, key], depth + 1)}
        </SelectGroup>
      )
    );
  } else {
    return null; // Handle other types as needed
  }
}

const ChartConfiguration = () => {
  /**
   * TODO: combine into one color picker
   */
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [lineColorPickerOpen, setLineColorPickerOpen] = useState(false);
  // const colorRef = useRef<HTMLDivElement>(null);
  // const lineColorRef = useRef<HTMLDivElement>(null);

  const {
    data,
    charts,
    activeChart,
    activeTrace,
    handleAddTrace,
    handleUpdateTrace,
    setActiveTraceId,
  } = useChartsContext();
  const dataKeys = findArrayPaths(data);
  const grouped = groupKeysToObject(dataKeys);
  const listItems = renderDataKeyList(grouped);

  const setDataKey = (value: string) =>
    handleUpdateTrace({
      selectedDataKey: value,
      xAxisKey: "",
      yAxisKey: "",
      chartType: [],
    });
  const setXAxisKey = (value: string) => handleUpdateTrace({ xAxisKey: value });
  const setYAxisKey = (value: string) => handleUpdateTrace({ yAxisKey: value });
  const setChartType = (
    options: MultiValue<{ value: ChartType; label: string }>
  ) => {
    handleUpdateTrace({ chartType: options as ChartTypeOption[] });
  };

  const [xAxisKeys, yAxisKeys, chartTypeOptions] = useMemo(() => {
    if (!activeTrace) return [[], [], [], []];

    const { selectedDataKey, xAxisKey, yAxisKey } = activeTrace;

    const axisKeys = Object.keys(get(data, `${selectedDataKey}.0`, {}));
    const activeTraceData = get(data, selectedDataKey, []);
    const xAxisKeys = axisKeys.filter((key: string) => key !== yAxisKey);
    const yAxisKeys = axisKeys.filter((key: string) => key !== xAxisKey);

    const validChartTypes = determineValidChartTypes({
      // eslint-disable-next-line
      xValues: activeTraceData.map((item: any) => item[xAxisKey]),
      // eslint-disable-next-line
      yValues: activeTraceData.map((item: any) => item[yAxisKey]),
    });
    const chartTypeOptions = validChartTypes.map((chartType) => ({
      value: chartType,
      label: capitalize(chartType) + " Chart",
    }));

    return [xAxisKeys, yAxisKeys, chartTypeOptions];
  }, [activeTrace, data]);

  const activeChartIdx = charts.findIndex(
    (chart) => chart.id === activeChart?.id
  );

  return (
    <div className="flex items-center h-full">
      <div className="space-y-8 w-[400px] lg:w-[500px] bg-cgray h-full flex flex-col justify-center">
        <ChartConfigFields />
        <div className="px-2">
          <TypographyH3 className="mb-6">Traces Options</TypographyH3>
          <div className="border-secondary border-b flex mx-2 mb-4">
            {activeChart?.traces.map((trace, idx) => (
              <Button
                key={trace.id}
                className={cn(
                  "border-none bg-transparent rounded-none text-black rounded-t-md hover:bg-cgray-hover ",
                  trace.id === activeTrace?.id &&
                    "text-white bg-secondary hover:bg-secondary hover:text-white"
                )}
                onClick={() => setActiveTraceId(trace.id)}
                variant="ghost"
              >
                {trace.label || `Trace ${idx + 1}`}
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
            <Label htmlFor="traceTitle">Trace Label</Label>
            <Input
              name="traceTitle"
              type="text"
              value={activeTrace?.label}
              onChange={(e) => handleUpdateTrace({ label: e.target.value })}
              className="shadow-sm border-none rounded-sm"
              placeholder="Enter trace label"
            />
            <ConfigurationSelect
              label="Data key"
              value={activeTrace?.selectedDataKey ?? ""}
              onChange={setDataKey}
              placeholder="Select data key"
              name="dataKey"
            >
              {listItems}
            </ConfigurationSelect>
            <div className="flex w-full justify-between space-x-4">
              <ConfigurationSelect
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
              </ConfigurationSelect>
              <ConfigurationSelect
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
              </ConfigurationSelect>
            </div>
            <div className="space-y-1">
              <Label htmlFor="chartType">Chart Type</Label>
              <MultiSelect
                className="shadow-sm"
                styles={{
                  control: (baseStyles) => ({
                    ...baseStyles,
                    border: "none",
                    borderRadius: "calc(var(--radius) - 4px)",
                  }),
                }}
                placeholder="Select chart type"
                name="chartType"
                isDisabled={!(activeTrace?.xAxisKey && activeTrace?.yAxisKey)}
                isMulti={true}
                options={chartTypeOptions}
                value={activeTrace?.chartType ?? []}
                onChange={setChartType}
              />
            </div>
            <div className="flex space-x-4">
              {activeTrace?.chartType.some(
                (option) => option.value === "bar"
              ) && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="chartType">Bar Color</Label>
                  <div className="relative w-[30px] h-[30px] ">
                    <button
                      className="rounded-sm h-full w-full"
                      style={{ background: activeTrace?.color }}
                      onClick={() => setColorPickerOpen(!colorPickerOpen)}
                    />
                    {colorPickerOpen && (
                      <div className="absolute top-100 left-0">
                        <TwitterPicker
                          color={activeTrace?.color}
                          onChange={(color) =>
                            handleUpdateTrace({ color: color.hex })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTrace?.chartType.some(
                (option) => option.value === "line"
              ) && (
                <div className="flex items-center space-x-2">
                  <Label htmlFor="chartType">Line Color</Label>
                  <div className="relative w-[30px] h-[30px] ">
                    <button
                      className="rounded-sm h-full w-full"
                      style={{ background: activeTrace?.lineColor }}
                      onClick={() =>
                        setLineColorPickerOpen(!lineColorPickerOpen)
                      }
                    />
                    {lineColorPickerOpen && (
                      <div className="absolute top-100 left-0">
                        <TwitterPicker
                          color={activeTrace?.lineColor}
                          onChange={(color) =>
                            handleUpdateTrace({ lineColor: color.hex })
                          }
                        />
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="flex grow flex-col justify-center h-screen">
        <Canvas
          activeNodeIdx={activeChartIdx}
          chartIds={charts.map((chart) => chart.id)}
        >
          {charts.map((chart) => {
            return (
              <BasicChart
                chartId={chart.id}
                key={"chart-" + chart.id}
                width={defaultChartWidth}
              />
            );
          })}
        </Canvas>
      </div>
    </div>
  );
};

export default ChartConfiguration;

interface Data2D {
  xValues: (number | string)[];
  yValues: (number | string)[];
}

function determineValidChartTypes(data: Data2D): ChartType[] {
  // Check if xValues are strings or numbers
  const isXNumeric = data.xValues.every((value) => typeof value === "number");
  const isXString = data.xValues.every((value) => typeof value === "string");

  // Check if y values are numbers
  const isYNumeric = data.yValues.every((item) => typeof item === "number");

  const validChartTypes: ChartType[] = [];

  // Check for valid chart types based on data patterns
  if (isXNumeric && isYNumeric) {
    validChartTypes.push("scatter", "bar", "line");
  }

  if (isXString && isYNumeric) {
    validChartTypes.push("bar", "pie", "scatter", "line");
  }

  // Add more checks based on your specific data patterns and chart types

  return Array.from(new Set(validChartTypes).values());
}

interface GroupedObject {
  [key: string]: GroupedObject | string[] | string;
}

function groupKeysToObject(keys: string[]): GroupedObject {
  const result: GroupedObject = {};

  keys.forEach((key) => {
    const keyParts = key.split(".");
    let currentObject = result;

    for (let i = 0; i < keyParts.length - 1; i++) {
      const part = keyParts[i];
      if (!currentObject[part]) {
        currentObject[part] = { elements: [] };
      }
      currentObject = currentObject[part] as GroupedObject;
    }

    const lastPart = keyParts[keyParts.length - 1];
    (currentObject.elements as string[]).push(lastPart);
  });

  return result;
}

// eslint-disable-next-line
function findArrayPaths(obj: any, currentPath: string[] = []): string[] {
  let arrayPaths: string[] = [];

  for (const key in obj) {
    // eslint-disable-next-line
    if (obj.hasOwnProperty(key)) {
      const newPath = [...currentPath, key];
      if (Array.isArray(obj[key])) {
        arrayPaths.push(newPath.join("."));
      } else if (typeof obj[key] === "object" && obj[key] !== null) {
        arrayPaths = arrayPaths.concat(findArrayPaths(obj[key], newPath));
      }
    }
  }

  return arrayPaths;
}
