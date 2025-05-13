// FileUploader.tsx
"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { UploadFeedback } from "@/components/upload/upload-feedback";
import { DropZone } from "@/components/upload/drop-zone";
export interface FileUploaderProps {
  onFileUploaded: (file: File) => void;
  isProcessing: boolean;
}

export function FileUploader({
  onFileUploaded,
  isProcessing,
}: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleFile = (file: File) => {
    const isValid =
      file.type === "application/pdf" || file.type.startsWith("image/");
    if (!isValid) return alert("Le fichier doit être au format PDF ou image.");
    setSelectedFile(file);
  };

  const triggerFileInput = () => inputRef.current?.click();

  const handleUpload = () => {
    if (selectedFile) onFileUploaded(selectedFile);
  };

  return (
    <div className="space-y-4">
      <DropZone
        dragActive={dragActive}
        selectedFile={selectedFile}
        isProcessing={isProcessing}
        onDrag={handleDrag}
        onDrop={handleDrop}
        onFileChange={handleFileChange}
        triggerFileInput={triggerFileInput}
        inputRef={inputRef}
      />

      {isProcessing ? (
        <UploadFeedback />
      ) : (
        selectedFile && (
          <div className="flex justify-center">
            <Button onClick={handleUpload} className="px-8">
              Valider le DPE
            </Button>
          </div>
        )
      )}
    </div>
  );
}
