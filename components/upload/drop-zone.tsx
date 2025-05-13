// DropZone.tsx
import { Upload, File } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FilePreview } from "@/components/upload/file-preview";

interface DropZoneProps {
  dragActive: boolean;
  selectedFile: File | null;
  isProcessing: boolean;
  onDrag: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  triggerFileInput: () => void;
  inputRef: React.RefObject<HTMLInputElement>;
}

export function DropZone({
  dragActive,
  selectedFile,
  isProcessing,
  onDrag,
  onDrop,
  onFileChange,
  triggerFileInput,
  inputRef,
}: DropZoneProps) {
  return (
    <div
      className={`relative border-2 border-dashed rounded-lg p-8 flex flex-col items-center justify-center min-h-[200px] transition-colors ${
        dragActive
          ? "border-primary bg-primary/5"
          : selectedFile
          ? "border-primary/50 bg-primary/5"
          : "border-border bg-background hover:bg-secondary/50"
      }`}
      onDragEnter={onDrag}
      onDragLeave={onDrag}
      onDragOver={onDrag}
      onDrop={onDrop}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,image/*"
        onChange={onFileChange}
        disabled={isProcessing}
      />

      <div className="flex flex-col items-center justify-center text-center space-y-4">
        {selectedFile ? (
          <FilePreview filename={selectedFile.name} />
        ) : (
          <>
            <div className="p-3 rounded-full bg-secondary text-primary">
              <Upload className="h-10 w-10" />
            </div>
            <div className="space-y-1">
              <p className="font-medium">
                Glissez-déposez votre fichier DPE ici
              </p>
              <p className="text-sm text-muted-foreground">
                PDF ou image acceptés
              </p>
            </div>
            <Button
              variant="outline"
              onClick={triggerFileInput}
              disabled={isProcessing}
            >
              Sélectionner un fichier
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
