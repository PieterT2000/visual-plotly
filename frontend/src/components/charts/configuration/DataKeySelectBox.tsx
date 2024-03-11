import { SelectGroup, SelectItem, SelectLabel } from "src/components/ui/select";
import SelectBox from "./SelectBox";
import {
  GroupedObject,
  getFilteredObjectPaths,
  groupKeysToObject,
} from "./data-utils";
import { useChartsContext } from "src/providers/context/ChartsContext";

const DataKeySelectBox = () => {
  const { data, handleUpdateTrace, activeTrace } = useChartsContext();
  const dataKeys = getFilteredObjectPaths(data, (obj, key) =>
    Array.isArray(obj[key])
  );
  const grouped = groupKeysToObject(dataKeys);
  const listItems = renderDataKeyList(grouped);

  const setDataKey = (value: string) =>
    handleUpdateTrace({
      selectedDataKey: value,
      xAxisKey: "",
      yAxisKey: "",
      chartType: undefined,
    });

  return (
    <SelectBox
      label="Data key"
      value={activeTrace?.selectedDataKey ?? ""}
      onChange={setDataKey}
      placeholder="Select data key"
      name="dataKey"
    >
      {listItems}
    </SelectBox>
  );
};

export default DataKeySelectBox;

function renderDataKeyList(
  value: GroupedObject | string | string[],
  keyPath: string[] = [],
  depth = 0
): React.ReactNode {
  if (Array.isArray(value)) {
    const prefix = depth > 0 ? keyPath.join(".") + "." : "";
    return value.map((item: string) => (
      <SelectItem key={prefix + item} value={prefix + item}>
        {item}
      </SelectItem>
    ));
  } else if (typeof value === "object") {
    const entries = Object.entries(value);
    return entries.map(([key, childValue]) =>
      key === "elements" ? (
        renderDataKeyList(childValue, keyPath, depth)
      ) : (
        <SelectGroup key={key}>
          <SelectLabel>{`${Array(depth + 1).join("-")} ${key}`}</SelectLabel>
          {renderDataKeyList(childValue, [...keyPath, key], depth + 1)}
        </SelectGroup>
      )
    );
  } else {
    return null; // Handle other types as needed
  }
}
