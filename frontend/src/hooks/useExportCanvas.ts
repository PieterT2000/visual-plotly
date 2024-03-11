import {
  getTransformForBounds,
  getNodesBounds,
  ReactFlowInstance,
} from "reactflow";
import { jsPDF } from "jspdf";
import { toPng } from "html-to-image";
import { a4Extent } from "src/components/consts";
import { useCallback, useState } from "react";
import { PlotParams } from "react-plotly.js";

export const exportReactFlowToImgDataUrl = async (
  width: number,
  height: number,
  transform = "none"
) => {
  const captureElement = document.querySelector(
    ".react-flow__viewport"
  ) as HTMLElement;
  if (!captureElement) throw new Error("Could not find react flow container");

  const dataUrl = await toPng(captureElement, {
    pixelRatio: 2,
    filter: (node) => {
      const excludeClasses = [
        "resize-handle",
        "resize-line",
        // This assumes that the only edges present are the boundary edges, which should not be visible in the exported PDF
        // If, in the future, there other edges which should be exported, this should be updated
        "react-flow__edges",
      ];
      return !excludeClasses.some((cls) => node.classList?.contains(cls));
    },
    width,
    height,
    style: {
      transform,
    },
  });
  return dataUrl;
};

export function useExportCanvas(reactFlowInstance?: ReactFlowInstance) {
  const [isLoading, setIsLoading] = useState(false);

  const downloadPdf = useCallback(async () => {
    if (!reactFlowInstance) {
      return;
    }
    setIsLoading(true);

    const doc = new jsPDF({
      orientation: "portrait",
      format: "a4",
      unit: "px",
    });

    const nodesBounds = getNodesBounds(reactFlowInstance.getNodes());
    const imageWidth = a4Extent[1][0];
    const imageHeight = a4Extent[1][1];
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );
    // The CSS transform is used to scale and translate the Canvas viewport to fit the A4 page
    const cssTransform = `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`;

    try {
      const dataUrl = await exportReactFlowToImgDataUrl(
        imageWidth,
        imageHeight,
        cssTransform
      );

      const img = await new Promise((resolve) => {
        const img = new Image();
        img.src = dataUrl;
        img.onload = () => resolve(img);
      });

      if (!(img instanceof HTMLImageElement)) return;

      const pdfWidth = doc.internal.pageSize.getWidth();
      const pdfHeight = doc.internal.pageSize.getHeight();
      doc.addImage(img, "PNG", 0, 0, pdfWidth, pdfHeight, undefined, "NONE");
      doc.save("report.pdf");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }, [reactFlowInstance]);

  const renderPreviewImage = useCallback(() => {
    if (!reactFlowInstance) {
      throw new Error("ReactFlow instance is not available");
    }

    const nodesBounds = getNodesBounds(reactFlowInstance.getNodes());
    const imageWidth = a4Extent[1][0];
    const imageHeight = a4Extent[1][1];
    const transform = getTransformForBounds(
      nodesBounds,
      imageWidth,
      imageHeight,
      0.5,
      2
    );
    const cssTransform = `translate(${transform[0]}px, ${transform[1]}px) scale(${transform[2]})`;

    return new Promise<string>((resolve) => {
      const dataUrl = exportReactFlowToImgDataUrl(
        imageWidth,
        imageHeight,
        cssTransform
      );

      const timeout = setTimeout(() => {
        resolve(dataUrl);
        clearTimeout(timeout);
        // Give the impression to the user that generating the pdf preview is an async operation
      }, 50);
    });
  }, [reactFlowInstance]);

  const downloadJson = useCallback(() => {
    const exportData = [] as {
      layout: PlotParams["layout"];
      data: PlotParams["data"];
    }[];
    const chartElements = document
      .querySelector(".react-flow__viewport")
      ?.querySelectorAll(".p-chart");
    chartElements?.forEach((el) => {
      const chartComponent = el as HTMLDivElement & PlotParams;
      exportData.push({
        layout: chartComponent.layout,
        data: chartComponent.data,
      });
    });

    // download the data as a JSON file
    const data = JSON.stringify(exportData, null, 2);
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const aTag = document.createElement("a");
    aTag.href = url;
    aTag.download = "data.json";
    aTag.click();
  }, []);

  return { downloadPdf, renderPreviewImage, downloadJson, isLoading };
}
