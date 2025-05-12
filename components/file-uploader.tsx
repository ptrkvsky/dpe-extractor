"use client";

import { useState, useRef } from "react";
import { Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

interface FileUploaderProps {
  onFileUploaded: (file: File) => void;
  isProcessing: boolean;
}

export function FileUploader({ onFileUploaded, isProcessing }: FileUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    const isValidType = file.type === "application/pdf" || file.type.startsWith("image/");
    
    if (!isValidType) {
      alert("Le fichier doit être au format PDF ou image.");
      return;
    }
    
    setSelectedFile(file);
  };

  const handleUpload = () => {
    if (selectedFile) {
      onFileUploaded(selectedFile);
    }
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <div
        className={`relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
          dragActive 
            ? "border-primary bg-primary/5" 
            : selectedFile 
              ? "border-primary/50 bg-primary/5" 
              : "border-border bg-background hover:bg-secondary/50"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".pdf,image/*"
          onChange={handleFileChange}
          disabled={isProcessing}
        />
        
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          {selectedFile ? (
            <>
              <div className="p-3 rounded-full bg-primary/10 text-primary">
                <File className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Fichier sélectionné</p>
                <p className="text-sm text-muted-foreground">{selectedFile.name}</p>
              </div>
            </>
          ) : (
            <>
              <div className="p-3 rounded-full bg-secondary text-primary">
                <Upload className="h-10 w-10" />
              </div>
              <div className="space-y-1">
                <p className="font-medium">Glissez-déposez votre fichier DPE ici</p>
                <p className="text-sm text-muted-foreground">PDF ou image acceptés</p>
              </div>
              <Button variant="outline" onClick={handleButtonClick} disabled={isProcessing}>
                Sélectionner un fichier
              </Button>
            </>
          )}
        </div>
      </div>
      
      {isProcessing ? (
        <div className="space-y-2">
          <p className="text-sm text-center text-muted-foreground">
            Analyse du document en cours...
          </p>
          <Progress value={undefined} className="h-2" />
        </div>
      ) : selectedFile && (
        <div className="flex justify-center">
          <Button onClick={handleUpload} className="px-8">
            Valider le DPE
          </Button>
        </div>
      )}
    </div>
  );
}