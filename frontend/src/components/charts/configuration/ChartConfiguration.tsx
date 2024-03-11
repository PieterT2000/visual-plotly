import Canvas from "src/components/canvas/Canvas";
import ChartConfigFields from "./ChartConfigFields";
import TraceConfigFields from "./TraceConfigFields";

const ChartConfiguration = () => {
  return (
    <div className="flex items-center h-full">
      <div className="py-8 space-y-8 w-[400px] lg:w-[500px] bg-cgray h-full flex flex-col">
        <ChartConfigFields />
        <TraceConfigFields />
      </div>
      <div className="flex grow flex-col justify-center h-screen">
        <Canvas />
      </div>
    </div>
  );
};

export default ChartConfiguration;
