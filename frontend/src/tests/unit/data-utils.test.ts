import {
  determineValidChartTypes,
  getFilteredObjectPaths,
  groupKeysToObject,
} from "src/components/charts/configuration/data-utils";

describe("Filter nested object paths", () => {
  it("should find all nested property paths whose values are arrays", () => {
    const obj = {
      a: [1, 2, 3],
      b: {
        c: [4, 5, 6],
        d: {
          e: [7, 8, 9],
          f: 10,
        },
      },
    };

    const result = getFilteredObjectPaths(obj, (obj, key) =>
      Array.isArray(obj[key])
    );
    expect(result).toEqual(["a", "b.c", "b.d.e"]);
  });

  it("should return an empty array if no nested properties are arrays", () => {
    const obj = {
      a: 1,
      b: {
        c: 2,
        d: {
          e: 3,
          f: 4,
        },
      },
    };

    const result = getFilteredObjectPaths(obj, (obj, key) =>
      Array.isArray(obj[key])
    );
    expect(result).toEqual([]);
  });

  it("should find all nested property paths whose values are are numbers or strings", () => {
    const obj = {
      x: undefined,
      c: [{ b: 3 }],
      a: 1,
      b: {
        c: 2,
        d: {
          e: "hello",
          f: 4,
          g: true,
        },
        k: null,
      },
    };

    const result = getFilteredObjectPaths(
      obj,
      (obj, key) => typeof obj[key] === "number" || typeof obj[key] === "string"
    );
    expect(result).toEqual(["a", "b.c", "b.d.e", "b.d.f"]);
  });

  it("should return an empty array if input is array", () => {
    const obj = [
      {
        a: 1,
        b: "Hello",
      },
      {
        c: 3,
        d: null,
      },
    ];
    const result = getFilteredObjectPaths(
      obj,
      (obj, key) => typeof obj[key] === "number"
    );
    expect(result).toEqual([]);
  });
});

describe("Convert array of object paths to tree structure", () => {
  it("should convert an array of object paths to a tree structure with a single top-level key", () => {
    const keys = ["a", "b", "c", "d"];
    const result = groupKeysToObject(keys);
    expect(result).toEqual({
      elements: ["a", "b", "c", "d"],
    });
  });

  it("should convert an array of object paths to a tree structure with a single nested key", () => {
    const keys = ["a.b", "a.c", "a.d"];
    const result = groupKeysToObject(keys);
    expect(result).toEqual({
      a: {
        elements: ["b", "c", "d"],
      },
    });
  });

  it("should convert an array of object paths to a tree structure with a single nested key and a single top-level key", () => {
    const keys = ["a.b", "a.c", "a.d", "e"];
    const result = groupKeysToObject(keys);
    expect(result).toEqual({
      a: {
        elements: ["b", "c", "d"],
      },
      elements: ["e"],
    });
  });

  it("should convert a complex array of object paths to a tree structure", () => {
    const keys = [
      "a.c",
      "a.b.c",
      "a.b.d",
      "a.e.f",
      "a.e.g",
      "h.i.j",
      "x",
      "y.z",
    ];
    const result = groupKeysToObject(keys);
    expect(result).toEqual({
      a: {
        elements: ["c"],
        b: {
          elements: ["c", "d"],
        },
        e: {
          elements: ["f", "g"],
        },
      },
      h: {
        elements: [],
        i: {
          elements: ["j"],
        },
      },
      elements: ["x"],
      y: {
        elements: ["z"],
      },
    });
  });
});

describe("Find appropriate chart types for data structure", () => {
  it("should return appropriate chart types for x:number and y:number", () => {
    const data = {
      xValues: [1, 2, 3],
      yValues: [4, 5, 6],
    };
    const result = determineValidChartTypes(data);
    expect(result).toEqual(["scatter", "bar", "line"]);
  });

  it("should return appropriate chart types for x:string and y:number", () => {
    const data = {
      xValues: ["a", "b", "c"],
      yValues: [4, 5, 6],
    };
    const result = determineValidChartTypes(data);
    expect(result).toEqual(["bar", "pie", "scatter", "line"]);
  });

  it("should return appropriate chart types for x:number and y:string", () => {
    const data = {
      xValues: [1, 2, 3],
      yValues: ["a", "b", "c"],
    };
    const result = determineValidChartTypes(data);
    expect(result).toEqual(["scatter", "line"]);
  });

  it("should return no chart types for x:string and y:string", () => {
    const data = {
      xValues: ["a", "b", "c"],
      yValues: ["d", "e", "f"],
    };
    const result = determineValidChartTypes(data);
    expect(result).toEqual([]);
  });

  it("should not return line chart for x:number and y:number with duplicate x values", () => {
    const data = {
      xValues: [1, 1, 2],
      yValues: [4, 5, 6],
    };
    const result = determineValidChartTypes(data);
    expect(result).toEqual(["scatter", "bar"]);
  });
});
