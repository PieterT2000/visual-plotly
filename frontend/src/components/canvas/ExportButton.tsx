import { MouseEvent } from "react";
import { Panel } from "reactflow";
import { Button } from "../ui/button";
import { Download } from "lucide-react";

interface ExportButtonProps {
  onClick: (evt: MouseEvent) => void;
}

function ExportButton(props: ExportButtonProps) {
  return (
    <Panel position="bottom-right">
      <Button
        className="rounded-full h-16 w-16 shadow-[rgba(37,99,235,0.5)] shadow-lg"
        size={"icon"}
        onClick={props.onClick}
      >
        <Download size={28} />
      </Button>
    </Panel>
  );
}

export default ExportButton;
