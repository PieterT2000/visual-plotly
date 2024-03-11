import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "components/ui/select";
import { Label } from "components/ui/label";
import { ReactNode } from "react";
import { cn } from "src/utils";

interface ConfigurationSelectProps {
  label: string | ReactNode;
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  name: string;
}

const SelectBox = (props: ConfigurationSelectProps) => {
  return (
    <div className={cn("space-y-1", props.className)}>
      <Label htmlFor={props.name}>{props.label}</Label>
      <Select
        name={props.name}
        disabled={props.disabled}
        value={props.value}
        onValueChange={props.onChange}
      >
        <SelectTrigger className="shadow-sm border-none focus:ring-1 rounded-sm">
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
        <SelectContent>{props.children}</SelectContent>
      </Select>
    </div>
  );
};

export default SelectBox;
