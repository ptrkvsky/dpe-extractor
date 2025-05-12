export interface DPEData {
  adresse?: string;
  type_bien?: string;
  date_realisation?: string;
  date_validite?: string;
  consommation_energetique?: string | number;
  classe_energetique?: string;
  emissions_co2?: string | number;
  classe_ges?: string;
  cout_energetique_estime?: {
    min: number;
    max: number;
  };
}

export interface ValidationResult {
  data: DPEData;
  errors: string[];
}