"use client";

import { CheckCircle, AlertCircle, XCircle } from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { DPEData } from "@/lib/types";
import { EnergyLabel } from "@/components/energy-label";
import { formatDate, isDateValid } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

interface DPEResultsProps {
  dpeData: DPEData;
  errors: string[];
}

export function DPEResults({ dpeData, errors }: DPEResultsProps) {
  const isValid = errors.length === 0;
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {isValid ? (
            <>
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h3 className="text-xl font-semibold">DPE valide</h3>
            </>
          ) : (
            <>
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <h3 className="text-xl font-semibold">DPE incomplet</h3>
            </>
          )}
        </div>
        <Badge variant={isValid ? "default" : "destructive"}>
          {isValid ? "Conforme" : `${errors.length} problème(s)`}
        </Badge>
      </div>

      {errors.length > 0 && (
        <Card className="border-destructive/50 bg-destructive/5">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <XCircle className="h-5 w-5 text-destructive" />
              Problèmes détectés
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              {errors.map((error, index) => (
                <li key={index} className="text-destructive">{error}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Informations générales</CardTitle>
            <CardDescription>Données d'identification du bien</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Adresse</p>
              <p className="font-medium">{dpeData.adresse || "Non renseignée"}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Type de bien</p>
              <p className="font-medium">{dpeData.type_bien || "Non renseigné"}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Date de réalisation</p>
                <p className={`font-medium ${!isDateValid(dpeData.date_realisation) ? 'text-destructive' : ''}`}>
                  {formatDate(dpeData.date_realisation) || "Non renseignée"}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-muted-foreground">Date de validité</p>
                <p className={`font-medium ${!isDateValid(dpeData.date_validite) ? 'text-destructive' : ''}`}>
                  {formatDate(dpeData.date_validite) || "Non renseignée"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Coût énergétique</CardTitle>
            <CardDescription>Estimation annuelle des frais</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-between items-center p-4 bg-muted rounded-lg">
              <div>
                <p className="text-sm text-muted-foreground">Coût estimé</p>
                {dpeData.cout_energetique_estime ? (
                  <p className="text-2xl font-bold">
                    {dpeData.cout_energetique_estime.min} € - {dpeData.cout_energetique_estime.max} €
                    <span className="text-sm font-normal text-muted-foreground ml-1">/ an</span>
                  </p>
                ) : (
                  <p className="text-lg font-medium text-destructive">Non renseigné</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <EnergyLabel 
          title="Performance énergétique" 
          value={dpeData.consommation_energetique} 
          unit="kWh/m²/an"
          className={dpeData.classe_energetique?.toLowerCase() || ""}
          letter={dpeData.classe_energetique || "?"}
          error={!dpeData.consommation_energetique || !dpeData.classe_energetique}
        />
        
        <EnergyLabel 
          title="Impact environnemental" 
          value={dpeData.emissions_co2} 
          unit="kg CO₂/m²/an"
          className={dpeData.classe_ges?.toLowerCase() || ""}
          letter={dpeData.classe_ges || "?"}
          error={!dpeData.emissions_co2 || !dpeData.classe_ges}
          isGES={true}
        />
      </div>

      <div className="flex justify-center mt-6">
        <Button variant="outline" onClick={() => window.print()}>
          Imprimer le rapport
        </Button>
      </div>
    </div>
  );
}