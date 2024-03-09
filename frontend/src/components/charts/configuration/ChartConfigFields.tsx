import { TypographyH3 } from "components/ui";
import { Input } from "components/ui/input";
import { Label } from "components/ui/label";
import { Textarea } from "components/ui/textarea";
import { useChartsContext } from "src/providers/context/ChartsContext";

const ChartConfigFields = () => {
  const { handleUpdateChart, activeChart } = useChartsContext();
  return (
    <div className="px-2">
      <TypographyH3 className="mb-6 ">Chart Options</TypographyH3>
      <div className="space-y-2">
        <div className="space-y-2 px-2">
          <Label htmlFor="documentTitle">Title</Label>
          <Input
            id="documentTitle"
            type="text"
            value={activeChart?.title ?? ""}
            onChange={(e) =>
              handleUpdateChart({ ...activeChart, title: e.target.value })
            }
            className="shadow-sm border-none rounded-sm"
            placeholder="Enter document title"
          />
        </div>
        <div className="space-y-2 px-2">
          <Label htmlFor="documentDescription">Description</Label>
          <Textarea
            id="description"
            value={activeChart?.description ?? ""}
            onChange={(e) =>
              handleUpdateChart({ ...activeChart, description: e.target.value })
            }
            className="shadow-sm border-none rounded-sm"
            placeholder="Enter document description"
          />
        </div>
        <div className="space-y-2 px-2">
          <Label htmlFor="chartName">Chart Name</Label>
          <Input
            id="chartName"
            type="text"
            value={activeChart?.name ?? ""}
            onChange={(e) =>
              handleUpdateChart({ ...activeChart, name: e.target.value })
            }
            className="shadow-sm border-none rounded-sm"
            placeholder="Enter chart title"
            maxLength={50}
          />
        </div>
      </div>
    </div>
  );
};

export default ChartConfigFields;
