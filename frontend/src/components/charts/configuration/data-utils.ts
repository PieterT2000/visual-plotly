import type { ChartType } from "src/providers/context/ChartsContext";

interface Data2D {
  xValues: (number | string)[];
  yValues: (number | string)[];
}

export interface GroupedObject {
  [key: string]: GroupedObject | string[] | string;
}

export function determineValidChartTypes(data: Data2D): ChartType[] {
  // Check if xValues are strings or numbers
  const isXNumeric = data.xValues.every((value) => typeof value === "number");
  const isXString = data.xValues.every((value) => typeof value === "string");

  // Check if y values are numbers
  const isYNumeric = data.yValues.every((item) => typeof item === "number");
  const isYString = data.yValues.every((item) => typeof item === "string");

  const validChartTypes: ChartType[] = [];

  // this prevents the issue of having a line chart with a line going backwards and forwards
  const hasUniqueXValues = new Set(data.xValues).size === data.xValues.length;
  const hasUniqueYValues = new Set(data.yValues).size === data.yValues.length;

  // If both x and y are numeric
  if (isXNumeric && isYNumeric) {
    validChartTypes.push("scatter", "bar");
    if (hasUniqueXValues) {
      validChartTypes.push("line");
    }
  }

  // if x is string and y is numeric
  if (isXString && isYNumeric) {
    validChartTypes.push("bar", "pie", "scatter");
    if (hasUniqueXValues) {
      validChartTypes.push("line");
    }
  }

  // if x is numeric and y is string
  if (isXNumeric && isYString) {
    // TODO: support horizontal bar chart
    validChartTypes.push("scatter");
    if (hasUniqueYValues) {
      validChartTypes.push("line");
    }
  }

  return Array.from(new Set(validChartTypes).values());
}

/**
 * This function takes an array of object key paths and groups them into a tree-like structure
 * All leaf key parts are grouped into an array called "elements"
 */
export function groupKeysToObject(keys: string[]): GroupedObject {
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

    if (keyParts.length === 1) {
      // top level key whose value is an array
      currentObject["elements"] = (
        (currentObject["elements"] as string[]) ?? []
      ).concat(lastPart);
    } else {
      (currentObject.elements as string[]).push(lastPart);
    }
  });

  return result;
}

/**
 * This function takes an object (no array!) and returns an array of all the (nested) paths to properties whose values are of type array.
 */
export function getFilteredObjectPaths(
  obj: any,
  filterCallback: (obj: any, key: string) => boolean,
  currentPath: string[] = []
): string[] {
  let arrayPaths: string[] = [];

  if (typeof obj !== "object" || obj === null || Array.isArray(obj))
    return arrayPaths;

  for (const key in obj) {
    // eslint-disable-next-line
    if (obj.hasOwnProperty(key)) {
      const newPath = [...currentPath, key];
      if (filterCallback(obj, key)) {
        arrayPaths.push(newPath.join("."));
        // null and array are both objects in JS
      } else if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        arrayPaths = arrayPaths.concat(
          getFilteredObjectPaths(obj[key], filterCallback, newPath)
        );
      }
    }
  }

  return arrayPaths;
}
