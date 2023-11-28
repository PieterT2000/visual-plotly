import { useEffect, useState } from "react";
import { Label } from "components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "components/ui/select";
import {
  AlertDialogFooter,
  AlertDialog,
  AlertDialogContent,
  AlertDialogCancel,
  AlertDialogAction,
} from "components/ui/alert-dialog";
import get from "lodash.get";
import BarChart from "./components/charts/BarChart";
import PieChart from "./components/charts/PieChart";
import ScatterChart from "./components/charts/ScatterChart";
import { PlotType } from "plotly.js";

type Props = {
  files: string[];
  onSubmit?: () => void;
  onCancel?: () => void;
  dialogOpen: boolean;
  setDialogOpen: (open: boolean) => void;
};

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

type ChartType = PlotType | "line" | "";

const ConfigurationDialog = (props: Props) => {
  // eslint-disable-next-line
  const [data, setData] = useState<any>();
  const [selectedDataKey, setSelectedDataKey] = useState<string>();
  const [xAxisKey, setXAxisKey] = useState<string>("");
  const [yAxisKey, setYAxisKey] = useState<string>("");
  const [chartType, setChartType] = useState<ChartType>("");

  useEffect(() => {
    if (props.files.length === 0) return;
    fetch(props.files[0]).then((response) => {
      response.json().then(setData);
    });
  }, [props.files]);

  const dataKeys = findArrayPaths(data);
  const grouped = groupKeysToObject(dataKeys);
  // console.log(grouped);
  const listItems = renderDataKeyList(grouped);

  const handleSelectChange = (value: string) => {
    setSelectedDataKey(value);
    setXAxisKey("");
    setYAxisKey("");
    setChartType("");
  };

  const axisKeys = Object.keys(get(data, `${selectedDataKey}.0`, {}));
  const chartData = selectedDataKey ? get(data, selectedDataKey, []) : [];
  const xAxisKeys = axisKeys.filter((key: string) => key !== yAxisKey);
  const yAxisKeys = axisKeys.filter((key: string) => key !== xAxisKey);

  const validChartTypes = determineValidChartTypes({
    // eslint-disable-next-line
    xValues: chartData.map((item: any) => item[xAxisKey]),
    // eslint-disable-next-line
    yValues: chartData.map((item: any) => item[yAxisKey]),
  });

  return (
    <AlertDialog onOpenChange={props.setDialogOpen} open={props.dialogOpen}>
      <AlertDialogContent className="h-4/5 max-w-full w-4/5">
        <div className="grid gap-4 py-4 grid-cols-5 items-center">
          <div className="col-span-2 space-y-4">
            <div className="space-y-2 w-3/4">
              <Label htmlFor="name">Data Key</Label>
              <Select
                value={selectedDataKey}
                onValueChange={handleSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data key" />
                </SelectTrigger>
                <SelectContent>{listItems}</SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-3/4">
              <Label htmlFor="name">X-Axis</Label>
              <Select
                disabled={!selectedDataKey}
                value={xAxisKey}
                onValueChange={setXAxisKey}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select X axis key" />
                </SelectTrigger>
                <SelectContent>
                  {xAxisKeys.map((key: string) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-3/4">
              <Label htmlFor="name">Y-Axis</Label>
              <Select
                disabled={!selectedDataKey}
                value={yAxisKey}
                onValueChange={setYAxisKey}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select X axis key" />
                </SelectTrigger>
                <SelectContent>
                  {yAxisKeys.map((key: string) => (
                    <SelectItem key={key} value={key}>
                      {key}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 w-3/4">
              <Label htmlFor="name">Chart Type</Label>
              <Select
                disabled={!(xAxisKey && yAxisKey)}
                value={chartType}
                onValueChange={(val: ChartType) => setChartType(val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select chart type" />
                </SelectTrigger>
                <SelectContent>
                  {validChartTypes.map((type: ChartType) => (
                    <SelectItem key={type} value={type}>
                      {type} chart
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="col-span-3">
            {chartType === "bar" && (
              <BarChart
                data={chartData}
                xAxisKey={xAxisKey}
                yAxisKey={yAxisKey}
              />
            )}
            {chartType === "pie" && (
              <PieChart
                data={chartData}
                labelKey={xAxisKey}
                valueKey={yAxisKey}
              />
            )}
            {chartType === "scatter" && (
              <ScatterChart
                data={chartData}
                xAxisKey={xAxisKey}
                yAxisKey={yAxisKey}
              />
            )}
            {chartType === "line" && (
              <ScatterChart
                data={chartData}
                xAxisKey={xAxisKey}
                yAxisKey={yAxisKey}
                showLine
              />
            )}
          </div>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={props.onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={props.onSubmit} disabled={!chartType}>
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default ConfigurationDialog;

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
    validChartTypes.push("bar", "pie");
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
