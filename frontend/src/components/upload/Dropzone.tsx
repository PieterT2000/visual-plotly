import { useState } from "react";
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

  return (
    <div className="w-[800px]">
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
