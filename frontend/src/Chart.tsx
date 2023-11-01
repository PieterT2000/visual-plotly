import { ChangeEvent, useEffect, useState } from "react";
import Plot from "react-plotly.js";

// props is arguments that react component
// takes

type ChartProps = {
  title: string;
};

function Chart(props: ChartProps) {
  const [title, setTitle] = useState(props.title);

  useEffect(() => {
    if (title.length > 10) {
      alert("Title is too long!");
    }
  }, [title]);

  const handleInputChange = (evt: ChangeEvent<HTMLInputElement>) => {
    setTitle(evt.target.value);
  };

  return (
    <div>
      <input
        className="border-2 border-red-600 px-2 py-1"
        type="text"
        placeholder="Chart Title"
        onChange={handleInputChange}
        value={title}
      />
      <div>
        <Plot
          data={[
            {
              x: [1, 2, 3],
              y: [2, 6, 3],
              type: "scatter",
              mode: "lines+markers",
              marker: { color: "red" },
            },
            { type: "bar", x: [1, 2, 3], y: [2, 5, 3] },
          ]}
          layout={{ width: 320, height: 240, title }}
        />
      </div>
    </div>
  );
}

export default Chart;
