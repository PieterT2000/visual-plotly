import { removeObjectKeys } from "src/utils";
import { defaultPlotlyColors, getRandomPlotlyColor } from "src/utils/colors";

describe("Remove correct keys from object", () => {
  it("should remove the specified keys from the object", () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const keys = ["a", "c"];
    const result = removeObjectKeys(obj, keys as (keyof typeof obj)[]);
    expect(result).toEqual({ b: 2, d: 4 });
  });
  it("should remove no keys if input array is empty", () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const keys: string[] = [];
    const result = removeObjectKeys(obj, keys as (keyof typeof obj)[]);
    expect(result).toEqual(obj);
  });
  it("should return empty object if all keys are indicated for removal", () => {
    const obj = { a: 1, b: 2, c: 3, d: 4 };
    const keys = ["a", "b", "c", "d"];
    const result = removeObjectKeys(obj, keys as (keyof typeof obj)[]);
    expect(result).toEqual({});
  });
  it("should not throw if object is empty but keys are set", () => {
    const obj = {};
    const keys = ["a", "b", "c", "d"];
    const result = removeObjectKeys(obj, keys as (keyof typeof obj)[]);
    expect(result).toEqual({});
  });
});

describe("Pick random Plotly colors", () => {
  it("should return a color from the Plotly color palette", () => {
    const result = getRandomPlotlyColor();
    expect(defaultPlotlyColors.includes(result)).toBe(true);
  });
});
