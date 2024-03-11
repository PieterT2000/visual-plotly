import { useEffect, useState } from "react";
import { FileUploader, FileCard, MimeType, FileRejection } from "evergreen-ui";
import { cn } from "../../utils";
import { Button } from "../ui/button";

interface DropzoneProps {
  onContinue: (urls: string[]) => void;
  className?: string;
}

const acceptedMimeTypes = [MimeType.json];

export function Dropzone({ onContinue, className = "" }: DropzoneProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [validFiles, setValidFiles] = useState<File[]>([]);
  const [fileRejections, setFileRejections] = useState<FileRejection[]>([]);

  const handleRemove = (file: File) => {
    const newFiles = files.filter((f) => f !== file);
    setFiles(newFiles);
    const newValidFiles = validFiles.filter((f) => f !== file);
    setValidFiles(newValidFiles);
  };

  const handleContinue = () => {
    const urls = validFiles.map((file) => URL.createObjectURL(file));
    onContinue(urls);
  };

  const validateJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const result = JSON.parse(event.target?.result as string);
        if (Array.isArray(result))
          throw new Error(
            "Invalid JSON file. JSON file can't start with an array."
          );
      } catch (error: any) {
        setFileRejections((prev) => [
          ...prev,
          {
            file,
            message: error.message,
            reason: "INVALID_JSON",
          },
        ]);
        setValidFiles([]);
      }
    };
    reader.readAsText(file);
  };

  useEffect(() => {
    if (files.length === 0) return;
    validateJson(files[0]);
  }, [files]);

  return (
    <div className="w-full md:max-w-[800px]">
      <div>
        <h3>Upload File</h3>
        <p className="text-sm text-gray-500">
          You can upload 1 file. The file must have a .json extension.
        </p>
      </div>
      <FileUploader
        acceptedMimeTypes={acceptedMimeTypes}
        className={cn(className)}
        maxFiles={1}
        onChange={setFiles}
        onAccepted={setValidFiles}
        onRejected={setFileRejections}
        values={files}
        renderFile={(file) => {
          const { name, size, type } = file;
          const fileRejection = fileRejections.find(
            (fileRejection) => fileRejection.file === file
          );
          const { message } = fileRejection || {};
          return (
            <FileCard
              key={name}
              isInvalid={!!fileRejection}
              name={name}
              onRemove={() => handleRemove(file)}
              sizeInBytes={size}
              type={type}
              validationMessage={message}
            />
          );
        }}
      />
      {!!validFiles.length && (
        <Button onClick={handleContinue}>Continue</Button>
      )}
    </div>
  );
}
