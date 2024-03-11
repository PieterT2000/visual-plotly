import { Plus, X } from "lucide-react";
import { Chart, useChartsContext } from "src/providers/context/ChartsContext";
import { cn } from "src/utils";
import { Button } from "../ui/button";
import { MouseEvent } from "react";

const NavBar = () => {
  const {
    charts,
    chartThumbs,
    activeChart,
    setActiveChartId,
    handleAddChart,
    setActiveTraceId,
    handleDeleteChart,
  } = useChartsContext();

  const onSelectChart = (chart: Chart) => {
    const chartId = chart.id;
    if (activeChart?.id === chartId) return;
    setActiveChartId(chartId);
    setActiveTraceId(chart.traces[0].id);
  };

  const onDeleteChart = (chart: Chart, evt: MouseEvent) => {
    evt.stopPropagation();
    handleDeleteChart(chart.id);
  };

  return (
    <div className="overflow-y-auto h-screen p-8 grid no-scrollbar">
      <div className="flex flex-col m-auto gap-4">
        {charts.map((chart) => (
          <button
            key={chart.id}
            className="chart_thumb-container relative cursor-pointer rounded-apple shadow-apple"
            onClick={() => onSelectChart(chart)}
          >
            <img
              className={cn(
                "rounded-apple h-[75px] w-[75px] overflow-hidden bg-appleFill border-2",
                chart.id === activeChart?.id &&
                  "border-2 border-appleBorder border-primary/50"
              )}
              src={chartThumbs[chart.id]}
              alt={chart.name}
            />
            <div
              className="chart_thumb-delete"
              onClick={(evt) => onDeleteChart(chart, evt)}
            >
              <X className="icon" />
            </div>
            <div className="chart_thumb-overlay absolute top-0 left-0 w-full h-full rounded-apple flex items-center justify-center opacity-0">
              <span className="z-[11] text-white truncate px-1">
                {chart.title ?? chart.name}
              </span>
            </div>
          </button>
        ))}

        <Button
          variant="ghost"
          className="hover:bg-cgray-hover rounded-apple p-2"
          onClick={handleAddChart}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
