import Chart from "./Chart";
import "./App.css";
import { Dropzone } from "./Dropzone";
import { useState } from "react";
import { TypographyH1 } from "./components/ui/h1";
import { TypographyP } from "./components/ui/p";
import ConfigurationDialog from "./ConfigurationDialog";

type View = "chart" | "dropzone";

function App() {
  const [view] = useState<View>("dropzone");
  const [showDialog, setShowDialog] = useState<boolean>(false);
  const [fileUrls, setFileUrls] = useState<string[]>([]);

  console.log(showDialog);

  const onFileUpload = (urls: string[]) => {
    console.log("on file upload");
    setFileUrls(urls);
    setShowDialog(true);
  };

  return (
    <div>
      {view === "dropzone" && (
        <div className="h-screen flex flex-col justify-center items-center space-y-12">
          <TypographyH1>Visual Plotly</TypographyH1>
          <TypographyP className="w-2/3">
            Visual Plotly makes creating charts easy. Just adjust them visually,
            and it instantly gives you the chart and Python code. Simplify your
            data visualization with Visual Plotly.
          </TypographyP>
          <Dropzone
            className="h-1/3 flex justify-center items-center w-full"
            onChange={onFileUpload}
            fileExtension="json"
          />
        </div>
      )}
      {view === "chart" && <Chart title="Bar Chart" />}
      <ConfigurationDialog
        files={fileUrls}
        dialogOpen={showDialog}
        setDialogOpen={setShowDialog}
      />
    </div>
  );
}

export default App;
