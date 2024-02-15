import { Plus } from "lucide-react";
import { Chart, useChartsContext } from "src/providers/context/ChartsContext";
import { cn } from "src/utils";
import { Button } from "../ui/button";

const NavBar = () => {
  const {
    charts,
    chartThumbs,
    activeChart,
    setActiveChartId,
    handleAddChart,
    setActiveTraceId,
  } = useChartsContext();

  const handleSelectChart = (chart: Chart) => {
    const chartId = chart.id;
    if (activeChart?.id === chartId) return;
    setActiveChartId(chartId);
    setActiveTraceId(chart.traces[0].id);
  };

  return (
    <div className="overflow-y-auto h-screen p-8 grid no-scrollbar">
      <div className="flex flex-col m-auto gap-4">
        {charts.map((chart) => (
          <button
            key={chart.id}
            className="relative cursor-pointer rounded-full shadow-lg"
            onClick={() => handleSelectChart(chart)}
          >
            <img
              className={cn(
                "rounded-full h-[80px] w-[80px] overflow-hidden",
                chart.id === activeChart?.id && "ring-2 ring-secondary"
              )}
              src={chartThumbs[chart.id]}
              alt={chart.name}
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black rounded-full opacity-0 hover:opacity-50 transition-opacity flex items-center justify-center">
              <span className="z-[999] text-white truncate">{chart.name}</span>
            </div>
          </button>
        ))}

        <Button
          variant="ghost"
          className="hover:bg-cgray-hover rounded-md p-2"
          onClick={handleAddChart}
        >
          <Plus />
        </Button>
      </div>
    </div>
  );
};

export default NavBar;
