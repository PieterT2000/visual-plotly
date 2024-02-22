import { CSSProperties } from "react";
import { Handle, NodeProps, Position } from "reactflow";

export const InvisibleNode = ({
  data,
}: NodeProps<{ style: CSSProperties }>) => {
  return (
    <div
      className="block opacity-0 relative"
      style={{ width: "1px", height: "1px" }}
    >
      <Handle
        type="source"
        position={Position.Bottom}
        style={{
          ...data.style,
          height: "0px",
          width: "0px",
          transform: "none",
        }}
      />
      <Handle
        type="target"
        position={Position.Bottom}
        style={{
          ...data.style,
          height: "0px",
          width: "0px",
          transform: "none",
        }}
      />
    </div>
  );
};
