import React, { useRef, useState } from "react";
import { Card, CardContent } from "components/ui/card";
import { ImportIcon } from "lucide-react";
import { Button } from "components/ui/button";

interface DropzoneProps {
  onChange: (urls: string[]) => void;
  className?: string;
  fileExtension?: string;
}

export function Dropzone({
  onChange,
  className = "",
  fileExtension,
}: DropzoneProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileInfo, setFileInfo] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    const { files } = e.dataTransfer;
    handleFiles(files);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files) {
      handleFiles(files);
    }
  };

  const handleFiles = (files: FileList) => {
    const uploadedFile = files[0];
    console.log(files);

    // Check file extension
    if (fileExtension && !uploadedFile.name.endsWith(`.${fileExtension}`)) {
      setError(`Invalid file type. Expected: .${fileExtension}`);
      return;
    }

    const fileSizeInKB = Math.round(uploadedFile.size / 1024); // Convert to KB

    const fileList = Array.from(files).map((file) => URL.createObjectURL(file));
    onChange(fileList);

    // Display file information
    setFileInfo(`Uploaded file: ${uploadedFile.name} (${fileSizeInKB} KB)`);
    setError(null); // Reset error state
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <Card
      className={`bg-muted border-dashed border-2 hover:border-muted-foreground/50 hover:cursor-pointer ${className}`}
    >
      <CardContent
        className="flex flex-col items-center justify-center px-2 py-4 text-xs space-y-2"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <ImportIcon className="h-8 w-8 text-muted-foreground" />
        <div className="flex items-center justify-center text-muted-foreground">
          <span className="">Drag File to Upload or</span>
          <Button
            variant="ghost"
            size="sm"
            className="ml-auto h-8 flex space-x-2 text-xs px-0 pl-1"
            onClick={handleButtonClick}
          >
            Click Here
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept={`.${fileExtension}`} // Set accepted file type
            onChange={handleFileInputChange}
            className="hidden"
            multiple
          />
        </div>
        {fileInfo && <p className="text-muted-foreground">{fileInfo}</p>}
        {error && <span className="text-red-500">{error}</span>}
      </CardContent>
    </Card>
  );
}
