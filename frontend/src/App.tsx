import { Dropzone } from "./components/upload/Dropzone";
import { useState } from "react";
import { TypographyH1 } from "./components/ui/h1";
import { TypographyP } from "./components/ui/p";
import ConfigurationDialog from "./components/charts/configuration";
import Layout from "./components/layout/Layout";
import ChartsProvider from "./providers/ChartsProvider";
import NavBar from "./components/layout/NavBar";

type View = "chart" | "dropzone";

function App() {
  const [view, setView] = useState<View>("dropzone");
  const [fileUrls, setFileUrls] = useState<string[]>([]);

  const onSuccessfulFileUpload = (urls: string[]) => {
    setFileUrls(urls);
    setView("chart");
  };

  return (
    <>
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
            onContinue={onSuccessfulFileUpload}
          />
        </div>
      )}
      {view === "chart" && (
        <ChartsProvider files={fileUrls}>
          <Layout>
            <NavBar />
            <div className="flex flex-col grow">
              <ConfigurationDialog />
            </div>
          </Layout>
        </ChartsProvider>
      )}
    </>
  );
}

export default App;
