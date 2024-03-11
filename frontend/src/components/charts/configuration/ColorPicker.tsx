import { useRef } from "react";
import { useToggle, useOnClickOutside } from "usehooks-ts";
import { ColorResult, TwitterPicker } from "react-color";
import { Label } from "src/components/ui/label";
import { defaultPlotlyColors } from "src/utils/colors";

interface ColorPickerProps {
  label: string;
  color?: string;
  onChange: (color: ColorResult) => void;
}

const ColorPicker = ({ label, color, onChange }: ColorPickerProps) => {
  const [open, toggleOpen, setOpen] = useToggle(false);

  const ref = useRef(null);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="chartType">{label}</Label>
      <div className="relative w-[30px] h-[30px]" ref={ref}>
        <button
          className="rounded-sm h-full w-full"
          style={{ background: color }}
          onClick={toggleOpen}
        />
        {open && (
          <div className="absolute -top-[100px]">
            <TwitterPicker
              color={color}
              colors={defaultPlotlyColors}
              onChange={onChange}
              triangle="top-left"
              // Hack to position the triangle at the bottom
              styles={{
                "top-left-triangle": {
                  triangle: {
                    top: "unset",
                    bottom: "-10px",
                    left: "8px",
                    rotate: "180deg",
                  },
                  triangleShadow: {
                    top: "unset",
                    bottom: "-13px",
                    left: "8px",
                    rotate: "180deg",
                  },
                },
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ColorPicker;
