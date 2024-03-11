import React, { SetStateAction, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "../ui/button";
import { TypographyH3, TypographyP } from "../ui";
import formattedCode from "@/generated/code.html?raw";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: SetStateAction<boolean>) => void;
  onSubmit: (selectedTab: "pdf" | "json") => void;
  isLoading: boolean;
  children?: React.ReactNode;
}

type Tabs = "pdf" | "json";

const ExportDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
  children,
}: ExportDialogProps) => {
  const [tabs, setTabs] = useState<Tabs>("pdf");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader className="space-y-4">
          <TypographyH3 className="font-semibold leading-none tracking-tight">
            Download Report
          </TypographyH3>
          <TypographyP className="leading-none text-sm text-muted-foreground">
            Export your report as a PDF or JSON file.
          </TypographyP>
        </DialogHeader>
        <Tabs
          value={tabs}
          onValueChange={(value) => setTabs(value as Tabs)}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="pdf">PDF</TabsTrigger>
            <TabsTrigger value="json">JSON</TabsTrigger>
          </TabsList>
          <TabsContent value="pdf">
            <TypographyP className="leading-5 text-sm text-muted-foreground">
              When selecting PDF, an A4 size PDF will be generated and
              downloaded in your browser.
            </TypographyP>
            {children}
          </TabsContent>
          <TabsContent value="json">
            <TypographyP className="leading-5 text-sm text-muted-foreground">
              Download the JSON file to use it in your Python code. Below is an
              example for displaying one chart. Note that the output may contain
              multiple charts.
            </TypographyP>
            <div
              className="my-2 px-6 py-5 bg-[rgb(40,44,52)] text-sm"
              dangerouslySetInnerHTML={{ __html: formattedCode }}
            />
          </TabsContent>
        </Tabs>
        <DialogFooter>
          <Button
            variant={"outline"}
            type="button"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button type="submit" onClick={() => onSubmit(tabs)}>
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Download
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ExportDialog;
