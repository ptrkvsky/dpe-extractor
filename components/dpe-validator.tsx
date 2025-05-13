"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DPEResults } from "@/components/dpe-results";
import { DPEData } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { FileUploader } from "@/components/upload/file-uploader";
import { consoleEasterEgg } from "@/lib/utils";

export function DPEValidator() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [dpeData, setDpeData] = useState<DPEData | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("upload");
  const { toast } = useToast();

  useEffect(() => {
    consoleEasterEgg();
  }, []);

  const handleFileUploaded = async (file: File) => {
    setIsProcessing(true);
    setDpeData(null);
    setValidationErrors([]);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/extract-dpe", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erreur lors de l'analyse du document");
      }

      const result = await response.json();

      setDpeData(result.data);
      setValidationErrors(result.errors || []);
      setActiveTab("results");

      if (result.errors && result.errors.length > 0) {
        toast({
          title: "Validation incomplète",
          description: `${result.errors.length} problème(s) détecté(s)`,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Validation réussie",
          description: "Toutes les informations requises sont présentes",
          variant: "default",
        });
      }
    } catch (error) {
      console.error("Error processing file:", error);
      toast({
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Card className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="upload">Téléchargement</TabsTrigger>
          <TabsTrigger value="results" disabled={!dpeData}>
            Résultats
          </TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="p-4 md:p-6">
          <FileUploader
            onFileUploaded={handleFileUploaded}
            isProcessing={isProcessing}
          />
        </TabsContent>
        <TabsContent value="results" className="p-4 md:p-6">
          {dpeData && (
            <DPEResults dpeData={dpeData} errors={validationErrors} />
          )}
        </TabsContent>
      </Tabs>
    </Card>
  );
}
