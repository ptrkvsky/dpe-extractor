export function UploadFeedback() {
  return (
    <div className="space-y-2">
      <p className="text-sm text-center text-muted-foreground">
        Analyse du document en cours...
      </p>
      <div className="flex justify-center">
        <div className="h-2 w-2 rounded-full bg-primary animate-ping" />
      </div>
    </div>
  );
}
