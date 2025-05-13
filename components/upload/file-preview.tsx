import { File } from "lucide-react";

export function FilePreview({ filename }: { filename: string }) {
  return (
    <>
      <div className="p-3 rounded-full bg-primary/10 text-primary">
        <File className="h-10 w-10" />
      </div>
      <div className="space-y-1">
        <p className="font-medium">Fichier sélectionné</p>
        <p className="text-sm text-muted-foreground">{filename}</p>
      </div>
    </>
  );
}
