import Canvas from "src/components/canvas/Canvas";
import ChartConfigFields from "./ChartConfigFields";
import TraceConfigFields from "./TraceConfigFields";
import { ScrollArea } from "src/components/ui/scroll-area";

const ChartConfiguration = () => {
  return (
    <div className="flex items-center">
      <ScrollArea className="h-screen">
        <div className="py-8 space-y-8 w-[400px] lg:w-[500px] bg-cgray min-h-screen flex flex-col">
          <ChartConfigFields />
          <TraceConfigFields />
        </div>
      </ScrollArea>
      <div className="flex grow flex-col justify-center h-screen">
        <Canvas />
      </div>
    </div>
  );
};

export default ChartConfiguration;
