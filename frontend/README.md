# Frontend

## Tech stack

- [React](https://react.dev/): UI framework
- [TypeScript](https://www.typescriptlang.org/): static typed JS at compile time
- [Plotly.js](https://plotly.com/javascript/): charting library
- [React Flow](https://reactflow.dev/): canvas library
- [Tailwind](https://tailwindcss.com/) & [ShadCN UI](https://ui.shadcn.com/): Component library
- [Vite](https://vitejs.dev/): build tool
- [Jest](https://jestjs.io/): unit tests

## General User flow

A user navigates to the app and uploads a JSON file. After confirmation and validation they are taken to a configuration page, where they can display multiple charts and customize each chart to their liking. The app currently supports the following export strategies:

- export to pdf
- export to JSON

There are a few requirements for the JSON structure:

- its toplevel should be an object rather than an array
- it should at least contain one property whose value is an array of objects. The app is currently based around 2D data, requiring x and y-axis information.

### Example input

✅ Valid JSON

```json
{
   "type": "Monthly data",
   "range": 31,
   "results": [
      {
         "timestamp": 123893234,
         "data": {
            "unit": "kg",
            "value": 3,
            "cum_progress": 10,
         },
         "meta_x": "lorem_ipsum",
      },
      {
         "timestamp": 123893290,
         "data": {
            "unit": "kg",
            "value": 5,
         }
      },
      ...etc
   ]
   ... more data
}
```

❌ Invalid JSON example 1

```json
{
  "name": "Jane Doe",
  "age": 32,
  "data": {
    "speed": 120,
    "time": "3s"
  },
  "data2": {
    "speed": 140,
    "time": "2.5s"
  }
}
```

❌ Invalid JSON example 2

```json
[
   {
      "x": 3,
      "y": 5
   },
   {
      "x": 4,
      "y": 3
   },
   ...etc
]
```

In order to use the data from example 2, you would have to upload a JSON file where the array is assigned to a property

```json
{
   "data": [
      {
         "x": 3,
         "y": 5,
      },
      ...etc
   ]
}
```

## Code Organization

All re-usable Shadcn components (atoms) are installed in the `src/components/ui` folder. All other compound components are located in various nested folders in the `src/components` folder, depending on their category.
The main component responsible for chart configuration is located [here](src/components/charts/configuration/ChartConfiguration.tsx)
The `ChartConfiguration` component is divided up in `ChartFields` and `TraceFields` configurations. One chart can have multiple traces, and in the UI this would correspond to one tab per trace. Each trace can have its own data selector, colors, etc.
The code related to the Canvas can be found in the `src/components/canvas` folder. The two central components are:

- [Canvas.tsx](src/components/canvas/Canvas.tsx): renders the infinite Canvas to the DOM and is also responsible for rendering all Chart Nodes.
- [ChartNode.tsx](src/components/canvas/Canvas.tsx) Renders a Custom Node to the canvas which contains the corresponding configured Plotly.js chart.

Global state is mostly handled by the [ChartsProvider](src/providers/ChartsProvider.tsx). Individual components can subscribe to the ChartProvider's context by using the the `useChartsContext` hook.

### Extendibility

In order to extend the app's functionality, such as adding support for new chart types, or customizing chart properties, it is important to be aware of some of the key components and functions.

#### Charts

[BasicChart.tsx](src/components/charts/BasicChart.tsx) is the component that renders all supported chart types (pie, scatter, line, bar).
The list of valid chart types, shown to the user in the dropdown upon selection of an x and y axis key, are determined by the [determineValidChartTypes](src/components/charts/configuration/data-utils.ts#determineValidChartTypes) function.

#### JSON parser

The functions responsible for parsing the uploaded JSON file and showing possible data keys to be selected by the user can be found in the [data-utils.ts](src/components/charts/configuration/data-utils.ts) file. By default, only the keys whose values are of type `Array` will be shown to the user in the _Select Data Key_ dropdown.
The [DataKeySelectBox](src/components/charts/configuration/DataKeySelectBox.tsx) component is responsible for selecting those keys and rendering them inside a dropdown.
<<<<<<< HEAD
=======

### Future work

The user may be supported to generate multiple-page pdfs rather than single-page pdfs.
Also, the drag-n-drop functionality for chart nodes may be made more constrained by using templates.
These changes may benefit from using a different library than the react-flow library currently in use. For example, [react-grid-layout](https://github.com/react-grid-layout/react-grid-layout) would be well suited to this.
Lastly, the application could be made stateful by saving pdf configurations to persistence storage.
>>>>>>> develop
